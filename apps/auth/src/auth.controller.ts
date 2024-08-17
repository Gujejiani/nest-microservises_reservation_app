import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

import { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser, UserEntity } from '@app/common';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return 'Hello World!';
    // return this.authService.getHello();
  }
  

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() user: UserEntity, @Res({passthrough: true}) response: Response){
    await this.authService.login(user, response)
    response.send(user)
  
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(
    @Payload() payload: any
  ){
    return payload.user
  }
}
