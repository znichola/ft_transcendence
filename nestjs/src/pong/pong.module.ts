import { Module } from '@nestjs/common';
import { PongService } from './pong.service';
import { PongController } from './pong.controller';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import {UserService} from "../user/user.service";

@Module({
  imports: [AuthModule],
  controllers: [PongController],
  providers: [PongService],
  exports: [PongService],
})
export class PongModule {}
