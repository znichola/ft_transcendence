import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UserAvatarDto {
	@ApiProperty()
	@IsString()
    path: string; // Will be changed with the avatar upload implementation
}