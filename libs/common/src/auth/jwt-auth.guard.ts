import {CanActivate, Injectable, ExecutionContext, Inject} from '@nestjs/common'
import { AUTH_SERVICE } from '../constants/services'
import { ClientProxy } from '@nestjs/microservices'
import { Observable, map, tap } from 'rxjs'


@Injectable()
export class JwtAuthGuard implements CanActivate {
        constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy){}
        
        canActivate (context: ExecutionContext): boolean | Observable<boolean> {
            const jwt  = context.switchToHttp().getRequest().cookies?.Authentication

            if(!jwt){
                return false
            }

           return this.authClient.send('authenticate', {
                Authentication: jwt

            }).pipe(tap(res=>{
                context.switchToHttp().getRequest().user = res;
            }, map(()=> {
                 return true
            })))
            // const request = context.switchToHttp().getRequest();
            // return validateRequest(request)
        }
}