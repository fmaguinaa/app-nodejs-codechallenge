import {Inject, Injectable, Logger} from '@nestjs/common';
import {TransactionEvent} from "./events/transaction.event";
import {ClientKafka} from "@nestjs/microservices";
import {TransactionUpdateEvent} from "./events/transaction.update.event";

const LIMIT = 1000;
const enum STATUS {
  REJECTED = 'Rejected',
  APPROVED = 'Approved'
}

@Injectable()
export class AntiFraudService {
  constructor(
    @Inject('TRANSACTION_SERVICE') private readonly transactionClient: ClientKafka,
  ) {}

  handleVerifyTransaction(transaction: TransactionEvent): string {
    Logger.log('AntiFraudService.handleVerifyTransaction.transaction', transaction)
    Logger.log('AntiFraudService.handleVerifyTransaction.LIMIT', LIMIT)
    if(transaction.value > LIMIT) {
      return STATUS.REJECTED;
    } else {
      return STATUS.APPROVED;
    }
  }

  handleUpdateTransactionStatus(transaction: TransactionEvent, status: string) {
    Logger.log('AntiFraudService.handleUpdateTransactionStatus.transaction', transaction)
    Logger.log('AntiFraudService.handleUpdateTransactionStatus.status', status)
    this.transactionClient.emit(
      'update_transaction',
      new TransactionUpdateEvent(
        transaction.transactionExternalId,
        status
      ).toString()
    )
  }
}
