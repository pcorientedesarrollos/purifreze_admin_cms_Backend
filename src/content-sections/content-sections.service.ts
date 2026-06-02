import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContentSectionDto } from './dto/create-content-section.dto';
import { UpdateContentSectionDto } from './dto/update-content-section.dto';

@Injectable()
export class ContentSectionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.contentSection.findMany({
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
  }

  async create(createContentSectionDto: CreateContentSectionDto) {
    try {
      return await this.prisma.contentSection.create({
        data: createContentSectionDto,
      });
    } catch (error) {
      console.log('ERROR', error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('A section with that key already exists.');
      }

      throw error;
    }
  }

  async update(key: string, updateContentSectionDto: UpdateContentSectionDto) {
    try {
      return await this.prisma.contentSection.update({
        where: { key },
        data: updateContentSectionDto,
      });
    } catch (error) {
      console.log('ERROR', error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('The requested section does not exist.');
      }

      throw error;
    }
  }
}
