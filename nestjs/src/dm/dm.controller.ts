import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { DmService } from './dm.service';
import { SendDmDto } from './dto/send-dm-dto';

@Controller('conversations')
export class DmController {
	constructor(private readonly dmService: DmService) {}

	@Get()
	findAllConversations()
	{
		return this.dmService.getAllConversations();
	}

	@Get(':user1')
	findAllConversationsOfUser(@Param('user1') user1: string)
	{
		return this.dmService.getAllConversationsOfUser(user1);
	}

	@Get(':user1/:user2')
	findOneConversation(@Param('user1') user1: string, @Param('user2') user2: string)
	{
		return this.dmService.getOneConversation(user1, user2);
	}

	@Post(':user1/:user2')
	@UsePipes(ValidationPipe)
	sendMessage(@Param('user1') user1: string, @Param('user2') user2: string, @Body() payload: SendDmDto)
	{
		return this.dmService.sendMessage(user1, user2, payload);
	}
}
