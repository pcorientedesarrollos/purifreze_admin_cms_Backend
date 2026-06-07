import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaveSeoMetadataDto } from './dto/seo-metadata.dto';

@Injectable()
export class SeoService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEntity(entityType: string, entityId: string) {
    return this.prisma.seoMetadata.findUnique({
      where: { entityType_entityId: { entityType, entityId } },
    });
  }

  async findAllByType(entityType: string) {
    return this.prisma.seoMetadata.findMany({
      where: { entityType },
      orderBy: { entityId: 'asc' },
    });
  }

  async upsert(dto: SaveSeoMetadataDto) {
    const { entityType, entityId, ...data } = dto;
    
    return this.prisma.seoMetadata.upsert({
      where: { entityType_entityId: { entityType, entityId } },
      create: { entityType, entityId, ...data },
      update: data,
    });
  }

  async delete(entityType: string, entityId: string) {
    return this.prisma.seoMetadata.delete({
      where: { entityType_entityId: { entityType, entityId } },
    });
  }

  calculateReadTime(text: string): number {
    const words = text.trim().match(/\S+/g)?.length || 0;
    return Math.max(1, Math.round(words / 200));
  }
}
