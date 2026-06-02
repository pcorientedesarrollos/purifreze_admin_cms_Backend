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
import { CreateFaqItemDto } from './dto/create-faq-item.dto';
import { FaqItemsService } from './faq-items.service';
import { ReorderDto } from './dto/reorder.dto';
import { UpdateFaqItemDto } from './dto/update-faq-item.dto';

@Controller('faq-items')
export class FaqItemsController {
  constructor(private readonly service: FaqItemsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  @UseGuards(AdminAuthGuard)
  create(@Body() dto: CreateFaqItemDto) {
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
    @Body() dto: UpdateFaqItemDto,
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
