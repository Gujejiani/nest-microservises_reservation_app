import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UsersService {

    constructor(private readonly userRepository: UsersRepository) {}


    async create(createUserDto: CreateUserDto){

       

        return  this.userRepository.create({
            ...createUserDto,
            password: await bcrypt.hash(createUserDto.password, 10)
        })
    }


    async verifyUser(email: string, password: string){
        const user = await this.userRepository.findOne({email})
        
        const passwordIsValid = await bcrypt.compare(password, user.password)
        console.log('password is valid ', user)
        if(passwordIsValid){
            return user
        }
        throw new UnauthorizedException('Invalid credentials')
    }
    
}
