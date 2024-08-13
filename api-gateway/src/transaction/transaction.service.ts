import {Inject, Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {CreateTransactionDto} from "../dto/create-transaction.dto";
import {ClientKafka} from "@nestjs/microservices";
import {TransactionCreateEvent} from "../events/transaction-create.event";
import {UpdateTransactionDto} from "../dto/update-transaction.dto";
import {TransactionUpdateEvent} from "../events/transaction-update.event";
import {Admin, Kafka} from "kafkajs";

@Injectable()
export class TransactionService implements OnModuleInit {
  private admin: Admin;
  constructor(
    @Inject('TRANSACTION_SERVICE') private readonly transactionClient: ClientKafka
  ) { }

  async onModuleInit() {
    this.transactionClient.subscribeToResponseOf('list_transactions');
    this.transactionClient.subscribeToResponseOf('list_transactions.reply');

    this.transactionClient.subscribeToResponseOf('find_transaction_by_id');
    this.transactionClient.subscribeToResponseOf('find_transaction_by_id.reply');

    this.transactionClient.subscribeToResponseOf('create_transaction');
    this.transactionClient.subscribeToResponseOf('create_transaction.reply');

    this.transactionClient.subscribeToResponseOf('update_transaction');
    this.transactionClient.subscribeToResponseOf('update_transaction.reply');

    this.transactionClient.subscribeToResponseOf('delete_transaction');
    this.transactionClient.subscribeToResponseOf('delete_transaction.reply');

    await this.transactionClient.connect();
  }

  async listTransactions() {
    return await this.transactionClient.send('list_transactions', {});
  }

  async getTransactionById(id: string) {
    return await this.transactionClient.send(
      'find_transaction_by_id',
      id
    )
  }

  async createTransaction(request: CreateTransactionDto) {
    Logger.log('createTransaction', request)
    return await this.transactionClient.send(
      'create_transaction',
      new TransactionCreateEvent(
        request.accountExternalIdDebit,
        request.accountExternalIdCredit,
        request.transferTypeId,
        request.value
      ).toString()
    )
  }

  async updateTransaction(request: UpdateTransactionDto) {
    Logger.log('updateTransaction', request)
    return await this.transactionClient.send(
      'update_transaction',
      new TransactionUpdateEvent(
        request.transactionExternalId,
        request.transactionStatus,
      ).toString()
    )
  }
  async deleteTransaction(id: string) {
    Logger.log('deleteTransaction', id)
    return await this.transactionClient.send(
      'delete_transaction',
      id
    )
  }
}
