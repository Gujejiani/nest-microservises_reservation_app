import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UsersService } from "../users/users.service";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) { // default is local and guard use it
    constructor(private readonly userService: UsersService){
        super(
            {
                usernameField: 'email',
                passwordField: 'password'
            }
        )
    }



    async validate(email: string, password: string){
        try{

            console.log('verifing user')
            return await this.userService.verifyUser(email, password)

        }catch (err){
            console.log('ERROR comes from here ')
            throw new UnauthorizedException(err)
        }
    }
}