import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComparisonRowDto } from './dto/create-comparison-row.dto';
import { UpdateComparisonRowDto } from './dto/update-comparison-row.dto';

@Injectable()
export class ComparisonRowsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.comparisonRow.findMany({
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
  }

  create(dto: CreateComparisonRowDto) {
    return this.prisma.comparisonRow.create({ data: dto });
  }

  async update(id: number, dto: UpdateComparisonRowDto) {
    try {
      return await this.prisma.comparisonRow.update({ where: { id }, data: dto });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Fila de comparacion no existe.');
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.comparisonRow.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Fila de comparacion no existe.');
      }
      throw error;
    }
  }

  reorder(ids: number[]) {
    return this.prisma.$transaction(
      ids.map((id, index) =>
        this.prisma.comparisonRow.update({
          where: { id },
          data: { sortOrder: index },
        }),
      ),
    );
  }
}
