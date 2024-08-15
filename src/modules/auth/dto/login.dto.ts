import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto{

    @ApiProperty()
    @IsString()
    username: string;

    @ApiProperty()
    @MinLength(8)
    @MaxLength(20)
    password: string;
}