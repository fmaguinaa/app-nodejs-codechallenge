import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'anti-fraud-client',
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'anti-fraud-consumer',
        },
      },
    },
  );
  app.listen();
}
bootstrap();
