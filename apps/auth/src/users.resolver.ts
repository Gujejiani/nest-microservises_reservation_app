import { UserDocument } from "@app/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UsersService } from "./users/users.service";
import { CreateUserDto } from "./users/dto/create-user.dto";



@Resolver(()=> UserDocument)

export class UsersResolver {
    constructor(private readonly userService: UsersService){
        
    }

    @Mutation(()=> UserDocument)
    createUser(
        @Args('createUserInput') createUserInput: CreateUserDto
    ){
        return this.userService.create(createUserInput);
    }


    @Query(()=> [UserDocument], {name: 'users'})
    findAll(){
        return this.userService.findAll();
    }


}