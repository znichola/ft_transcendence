import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './services/chat.service';
import { ChatMessageService } from './services/chat-message.service';
import { ChatMemberService } from './services/chat-member.service';
import { ChatBannedService } from './services/chat-banned.service';
import { ChatUtils } from './services/chat-utils.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [ChatController],
  providers: [ChatService, ChatMessageService, ChatMemberService, ChatBannedService, ChatUtils]
})
export class ChatModule {}
