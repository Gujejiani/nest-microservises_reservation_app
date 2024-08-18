import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DatabaseModule, HealthModule, PAYMENTS_SERVICE, RoleEntity } from '@app/common';
import { ReservationsRepository } from './reservations.repository';
import { ReservationEntity } from './entities/reservation.entity';
import { LoggerModuleCommon, AUTH_SERVICE } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';


@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([
    ReservationEntity,
    RoleEntity
  ]),
  ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: Joi.object({
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
        transport: Transport.RMQ,
        options: {
          urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
          queue: 'auth',
      }
    }),
    inject: [ConfigService]
    }
  ]),
  ClientsModule.registerAsync([
    {
      name: PAYMENTS_SERVICE,
      useFactory: (configService: ConfigService)=>({
        transport: Transport.RMQ,
        options: {
          urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
          queue: 'payments',
      }
    }),
    inject: [ConfigService]
    }
  ]),
  HealthModule
],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule {}
