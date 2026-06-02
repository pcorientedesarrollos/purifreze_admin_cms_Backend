import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FaqItemsController } from './faq-items.controller';
import { FaqItemsService } from './faq-items.service';

@Module({
  imports: [AuthModule],
  controllers: [FaqItemsController],
  providers: [FaqItemsService],
})
export class FaqItemsModule {}
