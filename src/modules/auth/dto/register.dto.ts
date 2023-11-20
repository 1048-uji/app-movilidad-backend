import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
    @ApiProperty()
    @IsString()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    password: string;

    @ApiProperty()
    @IsString()
    @MinLength(4)
    @MaxLength(25)
    username: string;
}