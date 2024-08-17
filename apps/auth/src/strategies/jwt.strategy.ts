import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { UsersService } from "../users/users.service";
import { ExtractJwt, Strategy } from "passport-jwt";

import { TokenPayload } from "../interfaces/tocken-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(configService: ConfigService, private readonly usersService: UsersService){
        super({
            
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: any) => {
                    console.log('here we Authentication Cookie', request?.cookies?.Authentication, request?.Authentication)
                    return request?.cookies?.Authentication || request?.Authentication ; // it might come from rpc request
                }
            
            ]),
            secretOrKey: configService.get('JWT_SECRET')
        })
    }

    async validate({userId}: TokenPayload){
        return this.usersService.getUser({id: userId})
    }
}