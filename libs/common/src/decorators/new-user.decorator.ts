import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { UserEntity } from "@app/common";



// local strategy adds user to request object
const getCurrentUserByContext = (context: ExecutionContext): UserEntity => {
    const request = context.switchToHttp().getRequest()
    return request.user

}

export const CurrentUser = createParamDecorator(
    (_data: unknown, context: ExecutionContext) => getCurrentUserByContext(context)
)  