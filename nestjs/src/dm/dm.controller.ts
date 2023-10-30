import { Controller, Get, Post, Body, Put, Param, Delete, UsePipes, ValidationPipe, ParseIntPipe, UseFilters, UseGuards, Req, Request, ForbiddenException, Header } from '@nestjs/common';
import { DmService } from './dm.service';
import { SendDmDto } from './dto/send-dm-dto';
import { ConversationEntity } from './entities/conversation.entity';
import { DirectMessageEntity } from './entities/direct-message.entity';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from 'src/prisma-client-exception/prisma-client-exception.filter';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags("Direct Messages")
@UsePipes(new ValidationPipe({whitelist: true}))
@UseFilters(PrismaClientExceptionFilter)
@UseGuards(AuthGuard)
@Controller('dm')
export class DmController {
	constructor(private readonly dmService: DmService) {}

	/* user1 only */
	@Get(':user1')
	@ApiOkResponse({type: ConversationEntity, isArray: true})
	async findAllConversationsOfUser(@Param('user1') user1: string, @Request() req): Promise<ConversationEntity[]>
	{
		if (req.user.login != user1)
			throw new ForbiddenException();
		return this.dmService.getAllConversationsOfUser(user1);
	}

	/* user1 only */
	@Get(':user1/:user2')
	@ApiOkResponse({type: ConversationEntity})
	async findOneConversation(@Param('user1') user1: string, @Param('user2') user2: string, @Request() req): Promise<ConversationEntity>
	{
		if (req.user.login != user1)
			throw new ForbiddenException();
		return this.dmService.getOneConversation(user1, user2);
	}

	/* user1 only */
	@Delete(':user1/:user2')
	@Header('content-type', 'application/json')
	async deleteOneConversation(@Param('user1') user1: string, @Param('user2') user2: string, @Request() req)
	{
		if (req.user.login != user1)
			throw new ForbiddenException();
		return this.dmService.deleteOneConversation(user1, user2);
	}

	/* user1 only */
	@Get(':user1/:user2/messages')
	@ApiOkResponse({type: DirectMessageEntity, isArray: true})
	async getAllMessagesFromConversation(@Param('user1') user1: string, @Param('user2') user2: string, @Request() req): Promise<DirectMessageEntity[]>
	{
		if (req.user.login != user1)
			throw new ForbiddenException();
		return this.dmService.getAllMessagesFromConversation(user1, user2);
	}

	/* user1 only */
	@Post(':user1/:user2/messages')
	@Header('content-type', 'application/json')
	async sendMessage(@Param('user1') user1: string, @Param('user2') user2: string, @Body() payload: SendDmDto, @Request() req)
	{
		if (req.user.login != user1)
			throw new ForbiddenException();
		return this.dmService.sendMessage(user1, user2, payload);
	}

	/* user1 only */
	@Get(':user1/:user2/messages/:msgId')
	@ApiOkResponse({type: DirectMessageEntity})
	async getOneMessage(@Param('user1') user1: string, @Param('user2') user2: string, @Param('msgId', ParseIntPipe) msgId: number, @Request() req): Promise<DirectMessageEntity>
	{
		if (req.user.login != user1)
			throw new ForbiddenException();
		return this.dmService.getOneMessage(msgId);
	}

	/* user1 only */
	@Delete(':user1/:user2/messages/:msgId')
	@Header('content-type', 'application/json')
	deleteMessage(@Param('user1') user1: string, @Param('user2') user2: string, @Param('msgId', ParseIntPipe) msgId: number, @Request() req)
	{
		if (req.user.login != user1)
			throw new ForbiddenException();
		return this.dmService.deleteMessage(msgId, user1);
	}

	/* user1 only */
	@Put(':user1/:user2/messages/:msgId')
	@Header('content-type', 'application/json')
	updateMessage(@Param('user1') user1: string, @Param('user2') user2: string, @Param('msgId', ParseIntPipe) msgId: number, @Body() payload: SendDmDto, @Request() req)
	{
		if (req.user.login != user1)
			throw new ForbiddenException();
		return this.dmService.updateMessage(msgId, payload, user1);
	}
}
