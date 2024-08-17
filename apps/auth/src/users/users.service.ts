import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';
import { RoleEntity, UserEntity } from '@app/common';
@Injectable()
export class UsersService {

    constructor(private readonly userRepository: UsersRepository) {}


    async create(createUserDto: CreateUserDto){
            await this.validateCreateUserEntity(createUserDto)
        
            const user = new UserEntity({
                ...createUserDto,
                password: await bcrypt.hash(createUserDto.password, 10),
                roles: createUserDto?.roles?.map(role => new RoleEntity(role)) 
            })
        return  this.userRepository.create(user)
    }

    async validateCreateUserEntity(createUserEntity: CreateUserDto){
        try {
            await this.userRepository.findOne({email: createUserEntity.email})
           
        }catch(err){
            return;
        }
        throw new UnprocessableEntityException('User already exists')
    }

    async getUser(getUserDto: GetUserDto){
        return this.userRepository.findOne(getUserDto, {roles: true})
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
