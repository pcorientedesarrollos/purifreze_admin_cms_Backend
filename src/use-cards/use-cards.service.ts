import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUseCardDto } from './dto/create-use-card.dto';
import { UpdateUseCardDto } from './dto/update-use-card.dto';

@Injectable()
export class UseCardsService {
  constructor(private readonly prisma: PrismaService) {}

  listPublic() {
    return this.prisma.useCard.findMany({
      where: { isVisible: true },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
  }

  listAdmin() {
    return this.prisma.useCard.findMany({
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
  }

  create(dto: CreateUseCardDto) {
    return this.prisma.useCard.create({ data: this.clean(dto) });
  }

  async update(id: number, dto: UpdateUseCardDto) {
    try {
      return await this.prisma.useCard.update({ where: { id }, data: this.clean(dto) });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Tarjeta de usos no existe.');
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.useCard.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Tarjeta de usos no existe.');
      }
      throw error;
    }
  }

  reorder(ids: number[]) {
    return this.prisma.$transaction(
      ids.map((id, index) =>
        this.prisma.useCard.update({
          where: { id },
          data: { sortOrder: index },
        }),
      ),
    );
  }

  private clean<T extends CreateUseCardDto | UpdateUseCardDto>(dto: T): T {
    return {
      ...dto,
      description: dto.description?.trim() || null,
      icon: dto.icon?.trim() || null,
      mediaUrl: dto.mediaUrl?.trim() || null,
      altText: dto.altText?.trim() || null,
    };
  }
}
