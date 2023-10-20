import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UserProfileDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    name: string;
    
    @ApiProperty()
    @IsString()
    @MaxLength(140)
    bio: string;
}