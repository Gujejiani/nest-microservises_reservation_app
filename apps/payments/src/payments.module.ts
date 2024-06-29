import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModuleCommon } from '@app/common';
@Module({
  imports: [ ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: Joi.object({
      PORT: Joi.number().required(),
      STRIPE_SECRET_KEY: Joi.string().required(),
      STRIPE_PUBLIC_KEY: Joi.string().required(),
      TEST_CUSTOMER_ID: Joi.string().required(),
    })
  
  }),
  LoggerModuleCommon
],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
