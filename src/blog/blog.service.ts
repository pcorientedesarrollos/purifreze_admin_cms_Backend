import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { BlogPostStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { validateBlocks } from './blog-blocks';
import { SaveBlogPostDto } from './dto/blog-post.dto';

@Injectable()
export class BlogService {
  private readonly logger = new Logger(BlogService.name);

  constructor(private readonly prisma: PrismaService) {}

  async listPublished(page = 1, pageSize = 9) {
    const safePage = Math.max(1, page);
    const safeSize = Math.min(24, Math.max(1, pageSize));
    const where = { status: BlogPostStatus.PUBLISHED };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (safePage - 1) * safeSize,
        take: safeSize,
        select: this.cardSelect(),
      }),
      this.prisma.blogPost.count({ where }),
    ]);
    return { items, page: safePage, pageSize: safeSize, total, pageCount: Math.max(1, Math.ceil(total / safeSize)) };
  }

  async findPublished(slug: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { slug } });
    if (post?.status === BlogPostStatus.PUBLISHED) return { post, canonicalSlug: post.slug };
    const redirect = await this.prisma.blogPostSlugRedirect.findUnique({
      where: { slug },
      include: { post: true },
    });
    if (redirect?.post.status === BlogPostStatus.PUBLISHED) {
      return { post: redirect.post, canonicalSlug: redirect.post.slug };
    }
    throw new NotFoundException('El artículo no existe.');
  }

  listAdmin() {
    return this.prisma.blogPost.findMany({ orderBy: { updatedAt: 'desc' } });
  }

  findAdmin(id: number) {
    return this.requirePost(id);
  }

  async create(dto: SaveBlogPostDto) {
    const data = this.data(dto);
    const slug = await this.uniqueSlug(data.slug);
    return this.prisma.blogPost.create({ data: { ...data, slug } });
  }

  private async uniqueSlug(base: string): Promise<string> {
    let candidate = base;
    let suffix = 2;
    while (await this.prisma.blogPost.findUnique({ where: { slug: candidate }, select: { id: true } })) {
      candidate = `${base}-${suffix}`.slice(0, 255);
      suffix += 1;
    }
    return candidate;
  }

  async update(id: number, dto: SaveBlogPostDto) {
    const current = await this.requirePost(id);
    const slug = slugify(dto.title);
    await this.assertSlugAvailable(slug, id);
    return this.prisma.$transaction(async (tx) => {
      if (current.status === BlogPostStatus.PUBLISHED && current.slug !== slug) {
        await tx.blogPostSlugRedirect.upsert({
          where: { slug: current.slug },
          update: { postId: id },
          create: { slug: current.slug, postId: id },
        });
      }
      return tx.blogPost.update({ where: { id }, data: this.data(dto) });
    });
  }

  async publish(id: number) {
    await this.requirePost(id);
    return this.prisma.blogPost.update({
      where: { id },
      data: { status: BlogPostStatus.PUBLISHED, publishedAt: new Date() },
    });
  }

  async unpublish(id: number) {
    await this.requirePost(id);
    return this.prisma.blogPost.update({
      where: { id },
      data: { status: BlogPostStatus.DRAFT, publishedAt: null },
    });
  }

  async remove(id: number) {
    try {
      await this.prisma.blogPost.delete({ where: { id } });
      this.logger.log(`Artículo eliminado correctamente. id=${id}`);
    } catch (error) {
      this.logger.error(
        `Error al eliminar artículo. id=${id}`,
        error instanceof Error ? error.stack : String(error),
      );
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('El artículo no existe.');
      }
      throw error;
    }
  }

  private data(dto: SaveBlogPostDto): Prisma.BlogPostUncheckedCreateInput {
    return {
      title: dto.title.trim(),
      slug: slugify(dto.title),
      excerpt: dto.excerpt.trim(),
      coverImageUrl: dto.coverImageUrl?.trim() || null,
      blocks: validateBlocks(dto.blocks) as unknown as Prisma.InputJsonValue,
    };
  }

  private async requirePost(id: number) {
    const post = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('El artículo no existe.');
    return post;
  }

  private async assertSlugAvailable(slug: string, id: number) {
    const match = await this.prisma.blogPost.findUnique({ where: { slug } });
    if (match && match.id !== id) throw new ConflictException('Ya existe un artículo con ese título.');
  }

  private cardSelect() {
    return {
      id: true, title: true, slug: true, excerpt: true, coverImageUrl: true, publishedAt: true, updatedAt: true,
    };
  }
}

export function slugify(value: string): string {
  const slug = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 255);
  if (!slug) throw new ConflictException('El título debe generar una URL válida.');
  return slug;
}
