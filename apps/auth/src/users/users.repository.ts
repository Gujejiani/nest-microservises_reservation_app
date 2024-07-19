import { AbstractRepository, UserDocument } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";



@Injectable()
export class UsersRepository extends AbstractRepository<UserDocument>  {
      logger = new Logger(UsersRepository.name) as any;



    constructor(@InjectModel(UserDocument.name) userModel: Model<UserDocument> ){
        super(userModel)
    }


}