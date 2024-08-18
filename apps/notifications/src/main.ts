import { NestFactory } from '@nestjs/core';

import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { NotificationsModule } from './notifications.module';
import { NOTIFICATIONS_PACKAGE_NAME } from '@app/common';
import { join } from 'path';

async function bootstrap() {

  const app = await NestFactory.create(NotificationsModule);
  const configService = app.get(ConfigService);
  // instead create microservice, we can use connectMicroservice to retrieve config from ConfigService

  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: NOTIFICATIONS_PACKAGE_NAME,
      protoPath: join(__dirname, '../../../proto/notifications.proto'),
      url: configService.getOrThrow<string>('NOTIFICATIONS_GRPC_URL'),
    },
  })
  app.useLogger(app.get(Logger))
  
  await app.startAllMicroservices()
}
bootstrap();
