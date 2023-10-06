import { Module } from '@nestjs/common';
import { TfaService } from './tfa.service';
import { TfaController } from './tfa.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [TfaService],
  controllers: [TfaController],
})
export class TfaModule {}
