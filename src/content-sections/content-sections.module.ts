import { Module } from '@nestjs/common';
import { ContentSectionsController } from './content-sections.controller';
import { ContentSectionsService } from './content-sections.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ContentSectionsController],
  providers: [ContentSectionsService],
})
export class ContentSectionsModule {}
