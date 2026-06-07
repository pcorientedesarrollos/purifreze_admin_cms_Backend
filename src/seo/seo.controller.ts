import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { SeoService } from './seo.service';
import { SaveSeoMetadataDto } from './dto/seo-metadata.dto';

@Controller('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Get(':entityType/:entityId')
  async findByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.seoService.findByEntity(entityType, entityId);
  }

  @Get(':entityType')
  async findAllByType(@Param('entityType') entityType: string) {
    return this.seoService.findAllByType(entityType);
  }

  @Put()
  async upsert(@Body() dto: SaveSeoMetadataDto) {
    return this.seoService.upsert(dto);
  }

  @Delete(':entityType/:entityId')
  async delete(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.seoService.delete(entityType, entityId);
  }
}
