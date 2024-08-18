import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { HealthModule, LoggerModuleCommon } from '@app/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloFederationDriver } from '@nestjs/apollo';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.number().required(),
        HTTP_PORT: Joi.number().required(),
        TCP_PORT: Joi.number().required(),
      })
    
    }),
    UsersModule, LoggerModuleCommon,
    
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile:  {
        federation: 2
      }
    }),
    JwtModule.registerAsync({
    useFactory: (configService: ConfigService)=>(
      {
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get<number>('JWT_EXPIRATION')}s`
        }
      }
    ),
    inject: [ConfigService]
  }),
  HealthModule

],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy, JwtStrategy],
})
export class AuthModule {}
