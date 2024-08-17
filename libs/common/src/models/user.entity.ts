
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { AbstractEntity } from "../database/abstract.entity";
import { RoleEntity } from "./role.entity";


@Entity()
export class UserEntity extends AbstractEntity<UserEntity> {
    @Column()
    password: string;

    
    @Column()
    email: string

    @ManyToMany(()=> RoleEntity,{cascade:true})
    @JoinTable()
    roles?: RoleEntity[];
   
}


