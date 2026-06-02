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

  @IsIn(['paragraph', 'heading', 'list', 'link', 'image'])
  type: 'paragraph' | 'heading' | 'list' | 'link' | 'image';

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlogBlockDto)
  blocks: BlogBlockDto[];
}
