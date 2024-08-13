import { Module } from '@nestjs/common';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {PrismaModule} from "./prisma/prisma.module";
import {TransactionService} from "./transaction.service";
import {TransactionController} from "./transaction.controller";

@Module({
  imports: [
    PrismaModule,
    ClientsModule.register([
      {
        name: 'ANTI_FRAUD_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction-client',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'anti-fraud-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class AppModule {}
