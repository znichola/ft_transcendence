import { Module } from '@nestjs/common';
import { DmService } from './dm.service';
import { DmController } from './dm.controller';
import { DmGateway } from './dm.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DmController],
  providers: [DmService, DmGateway],
})
export class DmModule {}
