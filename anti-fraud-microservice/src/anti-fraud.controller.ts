import {Controller, Logger} from '@nestjs/common';
import { MessagePattern, Payload} from "@nestjs/microservices";
import { AntiFraudService } from './anti-fraud.service';
import {TransactionEvent} from "./events/transaction.event";

@Controller()
export class AntiFraudController {
  constructor(private readonly appService: AntiFraudService) {}
  @MessagePattern('verify_transaction')
  async handleVerifyTransaction(@Payload() data: TransactionEvent) {
    Logger.log('AntiFraudController.handleVerifyTransaction.data', data)
    const status =  this.appService.handleVerifyTransaction(data);
    Logger.log('AntiFraudController.handleVerifyTransaction.status', status)
    this.appService.handleUpdateTransactionStatus(data, status);
  }
}
