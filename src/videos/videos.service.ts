import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';

@Injectable()
export class VideosService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.video.findMany({
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
  }

  create(dto: CreateVideoDto) {
    return this.prisma.video.create({ data: dto });
  }

  async update(id: number, dto: UpdateVideoDto) {
    try {
      return await this.prisma.video.update({ where: { id }, data: dto });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Video no existe.');
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.video.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Video no existe.');
      }
      throw error;
    }
  }

  reorder(ids: number[]) {
    return this.prisma.$transaction(
      ids.map((id, index) =>
        this.prisma.video.update({
          where: { id },
          data: { sortOrder: index },
        }),
      ),
    );
  }
}
