import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFaqItemDto } from './dto/create-faq-item.dto';
import { UpdateFaqItemDto } from './dto/update-faq-item.dto';

@Injectable()
export class FaqItemsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.faqItem.findMany({
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
  }

  create(dto: CreateFaqItemDto) {
    return this.prisma.faqItem.create({ data: dto });
  }

  async update(id: number, dto: UpdateFaqItemDto) {
    try {
      return await this.prisma.faqItem.update({ where: { id }, data: dto });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('FAQ no existe.');
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.faqItem.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('FAQ no existe.');
      }
      throw error;
    }
  }

  reorder(ids: number[]) {
    return this.prisma.$transaction(
      ids.map((id, index) =>
        this.prisma.faqItem.update({
          where: { id },
          data: { sortOrder: index },
        }),
      ),
    );
  }
}
