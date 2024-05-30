import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DatabaseModule } from '@app/common';
import { ReservationsRepository } from './reservations.repository';
import { ReservationDocument, ReservationSchema } from './entities/reservation.entity';
import { LoggerModuleCommon } from '@app/common';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([{
    name: ReservationDocument.name,
    schema: ReservationSchema
  
  }]),
  LoggerModuleCommon
],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule {}
