import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
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
  createCharge(@Payload() data: PaymentsCreateChargeDto, @Ctx() context: RmqContext ){
    const channel = context.getChannelRef();  
    const originalMsg = context.getMessage();

    channel.ack(originalMsg);
  
    // throw new Error('error in creating charge')
   return this.paymentsService.createCharge(data).catch(err=>{
      console.log('error in creating charge', err.message)
   })
  }
}
