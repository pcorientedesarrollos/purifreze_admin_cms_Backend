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
import { CreateUseCardDto } from './dto/create-use-card.dto';
import { ReorderDto } from './dto/reorder.dto';
import { UpdateUseCardDto } from './dto/update-use-card.dto';
import { UseCardsService } from './use-cards.service';

@Controller('use-cards')
export class UseCardsController {
  constructor(private readonly service: UseCardsService) {}

  @Get()
  findPublic() {
    return this.service.listPublic();
  }

  @Get('admin')
  @UseGuards(AdminAuthGuard)
  findAdmin() {
    return this.service.listAdmin();
  }

  @Post()
  @UseGuards(AdminAuthGuard)
  create(@Body() dto: CreateUseCardDto) {
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
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUseCardDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
  }
}
