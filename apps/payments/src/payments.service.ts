import { CreateChargeDto } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';


@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
    apiVersion: '2024-04-10',
  
  })
  constructor(private readonly configService: ConfigService) {

  }
  getHello(): string {
    return 'Hello World!';
  }


  
 async createCharge({
    card,
    amount
 }: CreateChargeDto){
  const cardd = await this.stripe.customers.createSource(
    this.configService.get('TEST_CUSTOMER_ID'), // customer id

    {source: 'tok_mastercard'}
  );

    // const paymentMethod = await this.stripe.paymentMethods.create({
    //   type: 'card',
    //   card,
      
      
    // });
   
    // pm_card_visa
    console.log('paymentMethod ', cardd, card)
    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: cardd?.id ,
      amount: amount * 100, 
      confirm: true,
      payment_method_types: ['card'],
      currency: 'usd',
      customer:  this.configService.get('TEST_CUSTOMER_ID'),
    })

    return paymentIntent

  }
  
}