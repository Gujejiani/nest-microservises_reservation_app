import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { LoggerModuleCommon } from '@app/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.number().required(),
        PORT: Joi.number().required(),
      })
    
    }),
    UsersModule, LoggerModuleCommon, JwtModule.registerAsync({
    useFactory: (configService: ConfigService)=>(
      {
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get<number>('JWT_EXPIRATION')}s`
        }
      }
    ),
    inject: [ConfigService]
  })],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy],
})
export class AuthModule {}
