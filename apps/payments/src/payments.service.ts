import {  NOTIFICATIONS_SERVICE_NAME, NotificationsServiceClient,  } from '@app/common';
import { PaymentsCreateChargeDto } from '@app/common/dto/payments-create-charge.dto';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc } from '@nestjs/microservices';
import Stripe from 'stripe';


@Injectable()
export class PaymentsService implements OnModuleInit {

  private notificationsService: NotificationsServiceClient

  private readonly stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
    apiVersion: '2024-04-10',
  
  })
  constructor(private readonly configService: ConfigService, @Inject(NOTIFICATIONS_SERVICE_NAME) private readonly client: ClientGrpc) {

  }
  onModuleInit() {
    this.notificationsService = this.client.getService<NotificationsServiceClient>(NOTIFICATIONS_SERVICE_NAME);
  }
  getHello(): string {
    return 'Hello World!';
  }


  
 async createCharge({
    card,
    amount,
    email
 }: PaymentsCreateChargeDto){
  // const cardd = await this.stripe.customers.createSource(
  //   this.configService.get('TEST_CUSTOMER_ID'), // customer id

  //   {source: 'tok_mastercard'}
  // );

    // const paymentMethod = await this.stripe.paymentMethods.create({
    //   type: 'card',
    //   card,
      
      
    // });
   
    // pm_card_visa
     console.log('paymentMethod card data', card)


    const paymentIntent = await this.stripe.paymentIntents.create({
     // payment_method: cardd?.id ,
      amount: amount * 100, 
      confirm: true,
    //  payment_method_types: ['card'],
      currency: 'usd',
      payment_method: 'pm_card_visa',
      return_url: 'https://example.com/return',
     // customer:  this.configService.get('TEST_CUSTOMER_ID'),
    })
    if(email){

      if(!this.notificationsService){
        this.notificationsService = this.client.getService<NotificationsServiceClient>(NOTIFICATIONS_SERVICE_NAME);
      }

      this.notificationsService.notifyEmail ({
        email: email,
        text: `You have successfully paid $${amount }! Thank you!`
      }).subscribe()
    }
 
    return paymentIntent

  }
  
}