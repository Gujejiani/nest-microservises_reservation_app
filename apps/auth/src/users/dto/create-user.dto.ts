import { IsArray, IsEmail, IsOptional, IsStrongPassword, ValidateNested } from "class-validator";
import { RoleDto } from "./role.dto";
import { Type } from "class-transformer";



export class CreateUserDto {

    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string

    @IsOptional()
    @IsArray()
    // @IsString({ each: true })
    // @IsNotEmpty({ each: true })
    @ValidateNested()
    @Type(()=>RoleDto)
    roles?: RoleDto[];
}