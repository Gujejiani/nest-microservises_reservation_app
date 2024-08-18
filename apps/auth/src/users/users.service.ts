import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';
@Injectable()
export class UsersService {

    constructor(private readonly userRepository: UsersRepository) {}


    async create(createUserDto: CreateUserDto){
            await this.validateCreateUserDto(createUserDto)
       

        return  this.userRepository.create({
            ...createUserDto,
            password: await bcrypt.hash(createUserDto.password, 10)
        })
    }

    async validateCreateUserDto(createUserDto: CreateUserDto){
        try {
            await this.userRepository.findOne({email: createUserDto.email})
           
        }catch(err){
            return;
        }
        throw new UnprocessableEntityException('User already exists')
    }

    async getUser(getUserDto: GetUserDto){
        return this.userRepository.findOne(getUserDto)
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

    async findAll(){
        return this.userRepository.find({})
    }
    
}
