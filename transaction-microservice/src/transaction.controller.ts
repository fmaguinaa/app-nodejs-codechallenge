import {Injectable, Logger} from "@nestjs/common";
import {Ctx, KafkaContext, MessagePattern, Payload} from "@nestjs/microservices";
import {TransactionService} from "./transaction.service";
import {CreateTransactionDto} from "./dto/create-transaction.dto";
import {TransactionDto} from "./dto/transaction.dto";
import {UpdateTransactionDto} from "./dto/update-transaction.dto";

@Injectable()
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @MessagePattern('list_transactions')
  async handleListTransactions() {
    Logger.log('TransactionController.handleListTransactions')
    return await this.service.getAllTransactions();
 }


  @MessagePattern('find_transaction_by_id')
  async handleFindTransactionById(@Payload() transactionId: string): Promise<TransactionDto> {
    Logger.log('TransactionController.handleFindTransactionById')
    return await this.service.getTransactionById(transactionId);
  }

  @MessagePattern('create_transaction')
  async handleCreateTransaction(@Payload() data: CreateTransactionDto): Promise<TransactionDto> {
    const transaction =  await this.service.createTransaction(data);
    Logger.log('TransactionController.handleCreateTransaction.transaction', transaction)
    if(transaction) {
      this.service.verifyTransaction(transaction);
    }
    return transaction;
  }

  @MessagePattern('update_transaction')
  async handleUpdateTransaction(@Payload() data: UpdateTransactionDto): Promise<TransactionDto> {
    Logger.log('TransactionController.handleCreateTransaction.data', data)
    return await this.service.updateTransactionStatusById(data);
  }

  @MessagePattern('delete_transaction')
  async handleDeleteTransaction(@Payload() transactionId: string): Promise<TransactionDto> {
    Logger.log('TransactionController.handleCreateTransaction.transactionId', transactionId)
    return await this.service.deleteTransaction(transactionId);
  }
}