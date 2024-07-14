import { NestFactory } from '@nestjs/core';

import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { NotificationsModule } from './notifications.module';

async function bootstrap() {

  const app = await NestFactory.create(NotificationsModule);
  const configService = app.get(ConfigService);
  // instead create microservice, we can use connectMicroservice to retrieve config from ConfigService

  app.connectMicroservice({
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: configService.get('PORT'),
      }
  })
  app.useLogger(app.get(Logger))
  
  await app.startAllMicroservices()
}
bootstrap();
