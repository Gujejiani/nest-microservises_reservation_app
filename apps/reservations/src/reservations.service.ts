
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import {  UserEntity, PAYMENTS_SERVICE_NAME, PaymentsServiceClient } from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { map } from 'rxjs';
import { ReservationEntity } from './entities/reservation.entity';


@Injectable()
export class ReservationsService implements OnModuleInit {
  private paymentService: PaymentsServiceClient;
  constructor(private readonly reservationsRepository: ReservationsRepository, @Inject(PAYMENTS_SERVICE_NAME) private readonly client: ClientGrpc) {}
 
 
 onModuleInit() {
    this.paymentService = this.client.getService<PaymentsServiceClient>(PAYMENTS_SERVICE_NAME);
 }
 
  async create(createReservationDto: CreateReservationDto, {email, id: userId}: UserEntity ) {
  try{
    return this.paymentService.createCharge ({
      ...createReservationDto.charge,
      email
    }).pipe(  map ( (res)=>{
      console.log('CHECK BELOWWWWWWWWWWWWWWWWWWWWWW  >> > > > > > > > > > > >' )
      console.log(res)
      console.log('CHECK UPPPPPPP = >....... . ... . .  > >> > > > > >> > > >> > > ')
      const reservation  = new ReservationEntity({
        ...createReservationDto,
        invoiceId: res.id,
        timeStamp: new Date(),
        userId: userId,
        
      })
      return   this.reservationsRepository.create(reservation);
   

    }))
  }catch (err){
    return err
  }
   

 


  }

  async findAll() {
    return this.reservationsRepository.find({});
  }

  async findOne(id: number) {
    return this.reservationsRepository.findOne({ id: id });
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate({id: id}, 
      updateReservationDto
    );
  }

  async remove(id: number) {
    return this.reservationsRepository.findOneAndDelete({ id});
  }
}
