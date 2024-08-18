import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

import { Response } from 'express';
import {  Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthServiceController, AuthServiceControllerMethods, CurrentUser, UserEntity } from '@app/common';
@Controller('auth')
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
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
  async authenticate(
    @Payload() payload: any
  ){
    return {
      ...payload.user,
      id: payload.user._id
    }
  }
}
