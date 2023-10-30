import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UserProfileDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
	@IsOptional()
    name?: string;

    @ApiProperty()
    @IsString()
    @MaxLength(140)
	@IsOptional()
    bio?: string;
}