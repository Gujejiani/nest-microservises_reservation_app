import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DatabaseModule, HealthModule, PAYMENTS_SERVICE } from '@app/common';
import { ReservationsRepository } from './reservations.repository';
import { ReservationDocument, ReservationSchema } from './entities/reservation.entity';
import { LoggerModuleCommon, AUTH_SERVICE } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GraphQLModule } from '@nestjs/graphql';
import {ApolloFederationDriver, ApolloFederationDriverConfig} from '@nestjs/apollo'
import { ReservationsResolver } from './reservations.resolver';


@Module({
  imports: [ DatabaseModule, DatabaseModule.forFeature([ {
    name: ReservationDocument.name,
    schema: ReservationSchema
  
  },
 

]),


  GraphQLModule.forRoot<ApolloFederationDriverConfig>({
    driver: ApolloFederationDriver,
    autoSchemaFile: {
      federation: 2
    },
    
  }),
  ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: Joi.object({
      MONGODB_URI: Joi.string().required(),
      PORT: Joi.number().required(),
      AUTH_HOST: Joi.string().required(),
      AUTH_TCP_PORT: Joi.number().required(),
      PAYMENTS_HOST: Joi.string().required(),
      PAYMENTS_TCP_PORT: Joi.number().required(),
    })
    
  }),
  LoggerModuleCommon,
  ClientsModule.registerAsync([
    {
      name: AUTH_SERVICE,
      useFactory: (configService: ConfigService)=>({
        transport: Transport.TCP,
        options: {
          host: configService.get('AUTH_HOST'),
          port: configService.get('AUTH_TCP_PORT'),
      }
    }),
    inject: [ConfigService]
    }
  ]),
  ClientsModule.registerAsync([
    {
      name: PAYMENTS_SERVICE,
      useFactory: (configService: ConfigService)=>({
        transport: Transport.TCP,
        options: {
          host: configService.get('PAYMENTS_HOST'),
          port: configService.get('PAYMENTS_TCP_PORT'),
      }
    }),
    inject: [ConfigService]
    }
  ]),
  HealthModule
],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepository, ReservationsResolver],
})
export class ReservationsModule {}
