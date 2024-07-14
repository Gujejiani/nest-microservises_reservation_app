import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from '@app/common/dto/payments-create-charge.dto';


@Controller()
export class PaymentsController {
 



  constructor(private readonly paymentsService: PaymentsService,) {}

  @Get()
  getHello(): string {
    return this.paymentsService.getHello();
  }

  @MessagePattern('create_charge')
  @UsePipes(new ValidationPipe())  
  createCharge(@Payload() data: PaymentsCreateChargeDto){
    console.log(' microservice create_charge received data: ', data)
   return this.paymentsService.createCharge(data).catch(err=>{
      console.log('error in creating charge', err.message)
   })
  }
}
