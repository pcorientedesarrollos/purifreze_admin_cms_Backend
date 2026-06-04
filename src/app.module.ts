import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { ComparisonRowsModule } from './comparison-rows/comparison-rows.module';
import { FaqItemsModule } from './faq-items/faq-items.module';
import { MediaModule } from './media/media.module';
import { PrismaModule } from './prisma/prisma.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { UseCardsModule } from './use-cards/use-cards.module';
import { VideosModule } from './videos/videos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    BlogModule,
    ComparisonRowsModule,
    FaqItemsModule,
    MediaModule,
    TestimonialsModule,
    UseCardsModule,
    VideosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
