import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './users/guards/local-auth.guard';
import { CurrentUser } from './decorators/new-user.decorator';
import { UserDocument } from './users/models/user.schema';
import { Response } from 'express';
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
  async login(@CurrentUser() user: UserDocument, @Res({passthrough: true}) response: Response){
    await this.authService.login(user, response)
    response.send(user)
  
  }
}
