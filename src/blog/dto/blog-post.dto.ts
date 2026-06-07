import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BlogBlockDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsIn(['paragraph', 'heading', 'list', 'link', 'image', 'quote', 'callout'])
  type: 'paragraph' | 'heading' | 'list' | 'link' | 'image' | 'quote' | 'callout';

  @IsObject()
  data: Record<string, unknown>;
}

export class SaveBlogPostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  excerpt: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  coverImageUrl?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(7)
  coverColor?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  coverIcon?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  authorName?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(5)
  authorInitials?: string | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlogBlockDto)
  blocks: BlogBlockDto[];
}
