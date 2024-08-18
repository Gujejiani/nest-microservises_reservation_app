import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

async function bootstrap() {

  const app = await NestFactory.create(PaymentsModule);
  const configService = app.get(ConfigService);
  // instead create microservice, we can use connectMicroservice to retrieve config from ConfigService

  app.connectMicroservice({
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: configService.get('PORT'), // TCP_PORT
      }
  })
  app.useLogger(app.get(Logger))
  
  await app.startAllMicroservices()
  await app.listen(configService.getOrThrow('PORT_HTTP'));
}
bootstrap();
