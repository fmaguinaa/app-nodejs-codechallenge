import {Inject, Injectable, Logger, NotFoundException} from "@nestjs/common";
import {ClientKafka, KafkaLogger} from "@nestjs/microservices";
import {TransactionCreateEvent} from "./events/transaction-create.event";
import {PrismaService} from "./prisma/prisma.service";
import {Transaction} from "@prisma/client";
import {TransactionDto} from "./dto/transaction.dto";
import {UpdateTransactionDto} from "./dto/update-transaction.dto";
import {AntiFraudVerifyEvent} from "./events/anti-fraud.verify.event";

@Injectable()
export class TransactionService {
  constructor(
    @Inject('ANTI_FRAUD_SERVICE') private readonly antiFraudClient: ClientKafka,
    private readonly prisma: PrismaService
  ) {}

  public async getAllTransactions(): Promise<Array<TransactionDto>>{
    const transactions = await this.prisma.transaction.findMany({
      include: {
        TransactionType: {
          select: { name: true },
        },
        TransactionStatus: {
          select: { name: true },
        },
      },
    });
    Logger.log("TransactionService.getAllTransactions.transactions", JSON.stringify(transactions));

    return transactions.map(this.mapToTransactionDto);
  }

  public async getTransactionById(id: string): Promise<TransactionDto> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { transactionExternalId: id },
      include: {
        TransactionType: {
          select: { name: true },
        },
        TransactionStatus: {
          select: { name: true },
        },
      },
    });
    Logger.log("TransactionService.getTransactionById.transaction", JSON.stringify(transaction));

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return this.mapToTransactionDto(transaction);
  }

  public async createTransaction(data: any): Promise<TransactionDto> {
    const transaction = await this.prisma.transaction.create({
      data: {
        accountExternalIdDebit: data.accountExternalIdDebit,
        accountExternalIdCredit: data.accountExternalIdCredit,
        value: data.value,
        TransactionType: {
          connect: { id: data.transferTypeId }
        },
        TransactionStatus: {
          connect: { id: 1 }
        },
      },
      include: {
        TransactionType: true,
        TransactionStatus: true,
      },
    });

    Logger.log("TransactionService.createTransaction.transaction", JSON.stringify(transaction));

    return this.mapToTransactionDto(transaction);
  }

  public async updateTransactionStatusById(data: UpdateTransactionDto): Promise<TransactionDto> {

    Logger.log("TransactionService.updateTransactionStatusById", data);

    const transactionStatus = await this.prisma.transactionStatus.findFirst(
      {
        where: {name: data.transactionStatus}
      });

    const transaction = await this.prisma.transaction.update({
      where: { transactionExternalId: data.transactionExternalId },
      data: {
        updatedAt: new Date(),
        TransactionStatus: {
          connect: { id: transactionStatus.id}
        },
      },
      include: {
        TransactionType: {
          select: { name: true },
        },
        TransactionStatus: {
          select: { name: true },
        },
      },
    });

    Logger.log("TransactionService.updateTransactionStatusById.transaction", JSON.stringify(transaction));

    return this.mapToTransactionDto(transaction);
  }

  public async deleteTransaction(id: string): Promise<TransactionDto> {
    const transaction =  await this.prisma.transaction.delete({
      where: { transactionExternalId: id },
      include: {
        TransactionType: {
          select: { name: true },
        },
        TransactionStatus: {
          select: { name: true },
        },
      },
    });
    Logger.log("TransactionService.deleteTransaction.transaction", JSON.stringify(transaction));

    return this.mapToTransactionDto(transaction);
  }

  private mapToTransactionDto(transaction): TransactionDto {
    return {
      transactionExternalId: transaction.transactionExternalId,
      transactionType: {
        name: transaction.TransactionType.name,
      },
      transactionStatus: {
        name: transaction.TransactionStatus.name,
      },
      value: transaction.value.toNumber(),
      createdAt: transaction.createdAt.toISOString(),
    };
  }

  public verifyTransaction(transaction: TransactionDto) {
    Logger.log("TransactionService.verifyTransaction", transaction);
    this.antiFraudClient.emit('verify_transaction', new AntiFraudVerifyEvent(
      transaction.transactionExternalId,
      transaction.value
    ).toString());
  }
}