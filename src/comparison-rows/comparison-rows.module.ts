import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ComparisonRowsController } from './comparison-rows.controller';
import { ComparisonRowsService } from './comparison-rows.service';

@Module({
  imports: [AuthModule],
  controllers: [ComparisonRowsController],
  providers: [ComparisonRowsService],
})
export class ComparisonRowsModule {}
