import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { DmModule } from './dm/dm.module';
import { TfaModule } from './tfa/tfa.module';
import { PongGateway } from './pong/pong.gateway';
import { PongModule } from './pong/pong.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PongService } from './pong/pong.service';

@Module({
  imports: [PongModule, PrismaModule, UserModule, AuthModule, ChatModule, DmModule, TfaModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, UserService, PrismaService, PongService],
})
export class AppModule {}