
import {CanActivate, Injectable, ExecutionContext, Inject, Logger, UnauthorizedException, OnModuleInit} from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { Observable, catchError, map, of, tap } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { AUTH_SERVICE_NAME, AuthServiceClient } from '../types'



@Injectable()
export class JwtAuthGuard implements CanActivate, OnModuleInit {

           
        private readonly logger = new Logger(JwtAuthGuard.name)
        private authService: AuthServiceClient;

        constructor(@Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc, private readonly reflector :Reflector){}
        onModuleInit(){
            this.authService = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME)
        }
        canActivate (context: ExecutionContext): boolean | Observable<boolean> {
            const jwt  = context.switchToHttp().getRequest().cookies?.Authentication

            if(!jwt){
                return false
            }

           return this.authService.authenticate({
                Authentication: jwt

            }).pipe( tap(res=>{
                context.switchToHttp().getRequest().user = res;
                const roles = this.reflector.get<string[]>('roles', context.getHandler())

                if(roles?.length){
                    const user = {
                        ...res,
                        _id: res.id
                    }
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