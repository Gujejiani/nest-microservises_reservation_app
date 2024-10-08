
import {CanActivate, Injectable, ExecutionContext, Inject, Logger, UnauthorizedException} from '@nestjs/common'
import { AUTH_SERVICE } from '../constants/services'
import { ClientProxy } from '@nestjs/microservices'
import { Observable, catchError, map, of, tap } from 'rxjs'
import { Reflector } from '@nestjs/core'



@Injectable()
export class JwtAuthGuard implements CanActivate {
        private readonly logger = new Logger(JwtAuthGuard.name)


        constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy, private readonly reflector :Reflector){}
        
        canActivate (context: ExecutionContext): boolean | Observable<boolean> {
            const jwt  = context.switchToHttp().getRequest().cookies?.Authentication

            if(!jwt){
                return false
            }

           return this.authClient.send('authenticate', {
                Authentication: jwt

            }).pipe( tap(res=>{
                context.switchToHttp().getRequest().user = res;
                const roles = this.reflector.get<string[]>('roles', context.getHandler())

                if(roles?.length){
                    const user = res
                    console.log('USER HAHAHAHAHAs =>>>>>>>>>>>> ', user)
                    const hasRole = user.roles.some(role => roles.includes(role))
                    if(!hasRole){
                        this.logger.error("user does not have the right role")
                        throw new UnauthorizedException('Unauthorized HAHA')
                       
                    }
                }
            }), 
            map( ()=>  true
            ),
            catchError((err)=> {
                this.logger.error(err)
                return of(false)
            })
            )
            // const request = context.switchToHttp().getRequest();
            // return validateRequest(request)
        }
}