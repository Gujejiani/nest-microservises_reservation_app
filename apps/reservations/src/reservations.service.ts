import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { PAYMENTS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';


@Injectable()
export class ReservationsService {
  constructor(private readonly reservationsRepository: ReservationsRepository, @Inject(PAYMENTS_SERVICE) private readonly paymentService: ClientProxy) {}
 async create(createReservationDto: CreateReservationDto, userId: string) {
  try{
    return this.paymentService.send('create_charge', createReservationDto.charge).pipe(  map ( (res)=>{
      console.log('CHECK BELOWWWWWWWWWWWWWWWWWWWWWW  >> > > > > > > > > > > >' )
      console.log(res)
      console.log('CHECK UPPPPPPP = >....... . ... . .  > >> > > > > >> > > >> > > ')
      return   this.reservationsRepository.create({
        ...createReservationDto,
        invoiceId: res.id,
        timeStamp: new Date(),
        userId: userId
      });
   

    }))
  }catch (err){
    return err
  }
   

 


  }

  async findAll() {
    return this.reservationsRepository.find({});
  }

  async findOne(id: string) {
    return this.reservationsRepository.findOne({ _id: id });
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate({_id: id}, {
      $set: updateReservationDto
    });
  }

  async remove(id: string) {
    return this.reservationsRepository.findOneAndDelete({ _id: id});
  }
}
