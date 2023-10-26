import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserStatusService } from './user.status.service';
import { UserGateway } from './user.gateway';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule], 
  providers: [UserService, UserStatusService, UserGateway],
  exports: [UserService, UserStatusService, UserGateway],
  controllers: [UserController],
})
export class UserModule {}
