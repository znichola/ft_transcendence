import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [PrismaModule, PrismaModule, UserModule, AuthModule, ChatModule],
  controllers: [AppController],
  providers: [AppService, UserService, PrismaService],
})
export class AppModule {}