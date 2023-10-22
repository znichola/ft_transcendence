import { Module } from '@nestjs/common';
import { PongGateway } from './pong.gateway';
import { PongService } from './pong.service';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import {UserService} from "../user/user.service";

@Module({
  imports: [UserModule, AuthModule],
  providers: [PongGateway, PongService],
  exports: [PongService],
})
export class PongModule {}
