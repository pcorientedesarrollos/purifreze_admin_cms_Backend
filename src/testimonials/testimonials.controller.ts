import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { ReorderDto } from './dto/reorder.dto';
import { TestimonialsService } from './testimonials.service';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';

@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly service: TestimonialsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  @UseGuards(AdminAuthGuard)
  create(@Body() dto: CreateTestimonialDto) {
    return this.service.create(dto);
  }

  @Post('reorder')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async reorder(@Body() dto: ReorderDto) {
    await this.service.reorder(dto.ids);
  }

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTestimonialDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
  }
}
