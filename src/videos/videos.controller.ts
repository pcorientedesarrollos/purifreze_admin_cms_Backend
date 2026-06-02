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
import { CreateVideoDto } from './dto/create-video.dto';
import { ReorderDto } from './dto/reorder.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { VideosService } from './videos.service';

@Controller('videos')
export class VideosController {
  constructor(private readonly service: VideosService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  @UseGuards(AdminAuthGuard)
  create(@Body() dto: CreateVideoDto) {
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
    @Body() dto: UpdateVideoDto,
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
