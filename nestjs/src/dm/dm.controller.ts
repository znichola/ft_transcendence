import { Controller, Get, Post, Body, Put, Param, Delete, UsePipes, ValidationPipe, ParseIntPipe, UseFilters } from '@nestjs/common';
import { DmService } from './dm.service';
import { SendDmDto } from './dto/send-dm-dto';
import { ConversationEntity } from './entities/conversation.entity';
import { MessageEntity } from './entities/message.entity';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from 'src/prisma-client-exception/prisma-client-exception.filter';

@ApiTags("Direct Messages")
@UsePipes(new ValidationPipe({whitelist: true}))
@UseFilters(PrismaClientExceptionFilter)
@Controller('dm')
export class DmController {
	constructor(private readonly dmService: DmService) {}

	@Get()
	@ApiOkResponse({type: ConversationEntity, isArray: true})
	findAllConversations(): Promise<ConversationEntity[]>
	{
		return this.dmService.getAllConversations();
	}

	@Get(':user1')
	@ApiOkResponse({type: ConversationEntity, isArray: true})
	findAllConversationsOfUser(@Param('user1') user1: string): Promise<ConversationEntity[]>
	{
		return this.dmService.getAllConversationsOfUser(user1);
	}

	@Get(':user1/:user2')
	@ApiOkResponse({type: ConversationEntity})
	findOneConversation(@Param('user1') user1: string, @Param('user2') user2: string): Promise<ConversationEntity>
	{
		return this.dmService.getOneConversation(user1, user2);
	}

	@Get(':user1/:user2/messages')
	@ApiOkResponse({type: MessageEntity, isArray: true})
	getAllMessagesFromConversation(@Param('user1') user1: string, @Param('user2') user2: string): Promise<MessageEntity[]>
	{
		return this.dmService.getAllMessagesFromConversation(user1, user2);
	}

	@Post(':user1/:user2/messages')
	sendMessage(@Param('user1') user1: string, @Param('user2') user2: string, @Body() payload: SendDmDto)
	{
		return this.dmService.sendMessage(user1, user2, payload);
	}

	@Get(':user1/:user2/messages/:msgId')
	@ApiOkResponse({type: MessageEntity})
	getOneMessage(@Param('user1') user1: string, @Param('user2') user2: string, @Param('msgId', ParseIntPipe) msgId: number): Promise<MessageEntity>
	{
		return this.dmService.getOneMessage(msgId);
	}

	@Delete(':user1/:user2/messages/:msgId')
	deleteMessage(@Param('user1') user1: string, @Param('user2') user2: string, @Param('msgId', ParseIntPipe) msgId: number)
	{
		return this.dmService.deleteMessage(msgId);
	}

	@Put(':user1/:user2/messages/:msgId')
	updateMessage(@Param('user1') user1: string, @Param('user2') user2: string, @Param('msgId', ParseIntPipe) msgId: number, @Body() payload: SendDmDto)
	{
		return this.dmService.updateMessage(msgId, payload);
	}
}
