import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { BlogService } from './blog.service';
import { SaveBlogPostDto } from './dto/blog-post.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blog: BlogService) {}

  @Get('posts')
  listPublished(@Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    return this.blog.listPublished(Number(page) || 1, Number(pageSize) || 9);
  }

  @Get('posts/:slug')
  findPublished(@Param('slug') slug: string) {
    return this.blog.findPublished(slug);
  }

  @UseGuards(AdminAuthGuard)
  @Get('admin/posts')
  listAdmin() {
    return this.blog.listAdmin();
  }

  @UseGuards(AdminAuthGuard)
  @Get('admin/posts/:id')
  findAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.blog.findAdmin(id);
  }

  @UseGuards(AdminAuthGuard)
  @Post('admin/posts')
  create(@Body() dto: SaveBlogPostDto) {
    return this.blog.create(dto);
  }

  @UseGuards(AdminAuthGuard)
  @Patch('admin/posts/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: SaveBlogPostDto) {
    return this.blog.update(id, dto);
  }

  @UseGuards(AdminAuthGuard)
  @Post('admin/posts/:id/publish')
  publish(@Param('id', ParseIntPipe) id: number) {
    return this.blog.publish(id);
  }

  @UseGuards(AdminAuthGuard)
  @Post('admin/posts/:id/unpublish')
  unpublish(@Param('id', ParseIntPipe) id: number) {
    return this.blog.unpublish(id);
  }

  @UseGuards(AdminAuthGuard)
  @Delete('admin/posts/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.blog.remove(id);
  }
}
