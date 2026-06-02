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
import { ComparisonRowsService } from './comparison-rows.service';
import { CreateComparisonRowDto } from './dto/create-comparison-row.dto';
import { ReorderDto } from './dto/reorder.dto';
import { UpdateComparisonRowDto } from './dto/update-comparison-row.dto';

@Controller('comparison-rows')
export class ComparisonRowsController {
  constructor(private readonly service: ComparisonRowsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  @UseGuards(AdminAuthGuard)
  create(@Body() dto: CreateComparisonRowDto) {
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
    @Body() dto: UpdateComparisonRowDto,
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
