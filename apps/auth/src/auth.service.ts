import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/tocken-payload.interface';
import { UserEntity } from '@app/common';
@Injectable()
export class AuthService {
  

  constructor(private readonly configService: ConfigService, private readonly jwtService: JwtService) { }


 async login(user: UserEntity, response: Response){
    const tokenPayload: TokenPayload = {
      userId: user.id,

    }

    const expires  = new Date();
    expires.getSeconds() + this.configService.get('JWT_EXPIRATION')


    const token = this.jwtService.sign(tokenPayload)

    response.cookie('Authentication', token, {
      expires,
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production'
    })
  }
}
