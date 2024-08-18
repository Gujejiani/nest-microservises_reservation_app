import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule, UserDocument, UserSchema } from '@app/common';
// import {  UserDocument, UserSchema } from '../../../../libs/common/src/models/user.schema';
import { UsersRepository } from './users.repository';
import { UsersResolver } from '../users.resolver';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersResolver],
  imports: [DatabaseModule, DatabaseModule.forFeature([{
    name: UserDocument.name,
    schema: UserSchema
  
  }])],
  exports: [UsersService]
})
export class UsersModule {}
