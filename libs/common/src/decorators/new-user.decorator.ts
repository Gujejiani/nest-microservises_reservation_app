import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { UserDocument } from "@app/common";



// local strategy adds user to request object
const getCurrentUserByContext = (context: ExecutionContext): UserDocument => {
    if(context.getType() === 'http'){
      return context.switchToHttp().getRequest().user
        
    }

    // if graphql
    const user = context.getArgs()[2]?.req?.headers?.user;
    console.log('NO USER FOUND')

    if(user){
        return JSON.parse(user)
    }
  

}

export const CurrentUser = createParamDecorator(
    (_data: unknown, context: ExecutionContext) => getCurrentUserByContext(context)
)  