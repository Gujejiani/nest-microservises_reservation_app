import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DatabaseModule } from '@app/common';
import { ReservationsRepository } from './reservations.repository';
import { ReservationDocument, ReservationSchema } from './entities/reservation.entity';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([{
    name: ReservationDocument.name,
    schema: ReservationSchema
  
  }]),
  LoggerModule.forRoot()

],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule {}