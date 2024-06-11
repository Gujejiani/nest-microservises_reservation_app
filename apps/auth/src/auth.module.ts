import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { LoggerModuleCommon } from '@app/common';

@Module({
  imports: [UsersModule, LoggerModuleCommon],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
