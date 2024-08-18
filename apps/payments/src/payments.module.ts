import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModuleCommon, NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloFederationDriver } from '@nestjs/apollo';
import { PaymentsResolver } from './payments.resolver';
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
  GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloFederationDriver,
    autoSchemaFile:  {
      federation: 2
    }
  }),
  ClientsModule.registerAsync([
    {
      name: NOTIFICATIONS_SERVICE,
      useFactory: ( configService: ConfigService)=>({
        transport: Transport.TCP,
        options: {
          host: configService.get('NOTIFICATIONS_HOST'),
          port: configService.get('NOTIFICATIONS_TCP_PORT'),
        }
      }),
      inject: [ConfigService]
    }
  ]),
  LoggerModuleCommon,
],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsResolver],
})
export class PaymentsModule {}
