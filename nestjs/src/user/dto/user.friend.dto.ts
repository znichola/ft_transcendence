import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UserFriendDto {
	@ApiProperty()
	@IsString()
    target: string;
}