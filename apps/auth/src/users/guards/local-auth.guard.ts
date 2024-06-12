import { AuthGuard } from "@nestjs/passport";



// local strategy adds user to request object
export class LocalAuthGuard extends AuthGuard('local') {
    
}