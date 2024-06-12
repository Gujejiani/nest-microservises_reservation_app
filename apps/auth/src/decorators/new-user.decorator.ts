import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { UserDocument } from "../users/models/user.schema";


// local strategy adds user to request object
const getCurrentUserByContext = (context: ExecutionContext): UserDocument => {
    const request = context.switchToHttp().getRequest()
    return request.user

}

export const CurrentUser = createParamDecorator(
    (_data: unknown, context: ExecutionContext) => getCurrentUserByContext(context)
)  