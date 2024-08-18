import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { AUTH_PACKAGE_NAME, AUTH_SERVICE_NAME, DatabaseModule, HealthModule, PAYMENTS_PACKAGE_NAME, PAYMENTS_SERVICE_NAME, RoleEntity } from '@app/common';
import { ReservationsRepository } from './reservations.repository';
import { ReservationEntity } from './entities/reservation.entity';
import { LoggerModuleCommon } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';


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
      name: AUTH_SERVICE_NAME,
      useFactory: (configService: ConfigService)=>({
        transport: Transport.GRPC,
        options: {
          package: AUTH_PACKAGE_NAME,
          protoPath: join(__dirname, '../../../proto/auth.proto'),
          url: configService.getOrThrow<string>('AUTH_GRPC_URL'),
      }
    }),
    inject: [ConfigService]
    }
  ]),
  ClientsModule.registerAsync([
    {
      name: PAYMENTS_SERVICE_NAME,
      useFactory: (configService: ConfigService)=>({
        transport: Transport.GRPC,
        options: {
          package: PAYMENTS_PACKAGE_NAME,
          protoPath: join(__dirname, '../../../proto/payments.proto'),
          url: configService.getOrThrow<string>('PAYMENTS_GRPC_URL'),
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
