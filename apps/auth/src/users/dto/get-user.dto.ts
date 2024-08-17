import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { RoleDto } from "./role.dto";

export class GetUserDto {


    @IsString()
    @IsNotEmpty()
    id: number

    @IsOptional()
    @IsArray()
    // @IsString({ each: true })
    // @IsNotEmpty({ each: true })
    @ValidateNested()
    @Type(()=>RoleDto)
    roles?: RoleDto[];
}