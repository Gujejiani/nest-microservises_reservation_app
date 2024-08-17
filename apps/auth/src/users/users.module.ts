import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule, RoleEntity, UserEntity,  } from '@app/common';
// import {  UserEntity, UserSchema } from '../../../../libs/common/src/models/user.schema';
import { UsersRepository } from './users.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  imports: [DatabaseModule, DatabaseModule.forFeature([
    UserEntity,
    RoleEntity
  ])],
  exports: [UsersService]
})
export class UsersModule {}
