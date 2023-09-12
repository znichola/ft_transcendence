import { IsString, IsInt, IsDate, IsDateString, IsISO8601, IsNumberString, IsEmail, IsNumber} from "class-validator";

export class ChatRoomData
{
	@IsInt()
	id: number;

	@IsDateString()
	creation_date: string;

	@IsNumber({}, {each: true})
	members: number[];
}
