import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { PAYMENTS_SERVICE, UserEntity } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';
import { ReservationEntity } from './entities/reservation.entity';


@Injectable()
export class ReservationsService {
  constructor(private readonly reservationsRepository: ReservationsRepository, @Inject(PAYMENTS_SERVICE) private readonly paymentService: ClientProxy) {}
 async create(createReservationDto: CreateReservationDto, {email, id: userId}: UserEntity ) {
  try{
    return this.paymentService.send('create_charge', {
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
