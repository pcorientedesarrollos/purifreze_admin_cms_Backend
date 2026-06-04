import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UseCardsController } from './use-cards.controller';
import { UseCardsService } from './use-cards.service';

@Module({
  imports: [AuthModule],
  controllers: [UseCardsController],
  providers: [UseCardsService],
})
export class UseCardsModule {}
