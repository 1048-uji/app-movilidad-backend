import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
    
    @ApiProperty()
    @IsString()
    @MinLength(4)
    @MaxLength(25)
    username: string;
    
    @ApiProperty()
    @IsString()
    @MinLength(4)
    @MaxLength(16)
    password: string;

}