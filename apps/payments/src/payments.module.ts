import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModuleCommon, NOTIFICATIONS_PACKAGE_NAME, NOTIFICATIONS_SERVICE_NAME } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
@Module({
  imports: [ ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: Joi.object({
      PORT: Joi.number().required(),
      STRIPE_SECRET_KEY: Joi.string().required(),
      STRIPE_PUBLIC_KEY: Joi.string().required(),
      TEST_CUSTOMER_ID: Joi.string().required(),
      NOTIFICATIONS_HOST: Joi.string().required(),
      NOTIFICATIONS_TCP_PORT: Joi.number().required(),
    })
  
  }),

  ClientsModule.registerAsync([
    {
      name: NOTIFICATIONS_SERVICE_NAME,
      useFactory: ( configService: ConfigService)=>({
        transport: Transport.GRPC,
        options: {
        package: NOTIFICATIONS_PACKAGE_NAME,
          protoPath: join(__dirname, '../../../proto/notifications.proto'),
          url: configService.getOrThrow<string>('NOTIFICATIONS_GRPC_URL'),
        }
      }),
      inject: [ConfigService]
    }
  ]),
  LoggerModuleCommon,
],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
