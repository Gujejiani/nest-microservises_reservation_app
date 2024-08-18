import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';

import { PaymentsCreateChargeDto } from '@app/common/dto/payments-create-charge.dto';
import { PaymentsServiceController, PaymentsServiceControllerMethods } from '@app/common';


@Controller()
@PaymentsServiceControllerMethods()
export class PaymentsController implements PaymentsServiceController {
 



  constructor(private readonly paymentsService: PaymentsService,) {}

  @Get()
  getHello(): string {
    return this.paymentsService.getHello();
  }

  
  @UsePipes(new ValidationPipe())  
  async createCharge(data: PaymentsCreateChargeDto){
  
 
   return this.paymentsService.createCharge(data)
  }
}
