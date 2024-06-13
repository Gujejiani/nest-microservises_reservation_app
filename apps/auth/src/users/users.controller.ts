import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { CurrentUser } from '../decorators/new-user.decorator';
import { UserDocument } from './models/user.schema';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}
    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto)
    }


    @Get()
    @UseGuards(JwtAuthGuard)
    async getUser(@CurrentUser() user: UserDocument){
        return user
    }

}
