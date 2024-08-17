import { PrimaryGeneratedColumn } from "typeorm";


export  class AbstractEntity<T> {

    @PrimaryGeneratedColumn()
    id: number;

    constructor(entity: Partial<T>) {
        Object.assign(this, entity);
    }
}

// import { Prop, Schema } from "@nestjs/mongoose";
// import { SchemaTypes , Types} from "mongoose";

// @Schema()
// export abstract class AbstractDocument {
 
//     @Prop({type: SchemaTypes.ObjectId, })
//     _id: Types.ObjectId
// }