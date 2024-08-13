import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {CreateTransactionDto} from "../dto/create-transaction.dto";
import {UpdateTransactionDto} from "../dto/update-transaction.dto";

@Controller('transactions')
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Get()
  async listTransactions() {
    return await this.service.listTransactions();
  }

  @Get(':id')
  getTransactionById(@Param('id') id: string) {
    return this.service.getTransactionById(id);
  }

  @Post()
  createTransaction(@Body() request: CreateTransactionDto ) {
    return this.service.createTransaction(request);
  }

  @Put(':id')
  update( @Body() request: UpdateTransactionDto ) {
    return this.service.updateTransaction(request);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.deleteTransaction(id);
  }
}
