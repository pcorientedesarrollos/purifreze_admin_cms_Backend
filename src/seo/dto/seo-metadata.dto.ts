import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class SaveSeoMetadataDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  entityType: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  entityId: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  metaTitle?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  metaDesc?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  keywords?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  ogTitle?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  ogDesc?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  ogImage?: string | null;

  @IsOptional()
  @IsString()
  @IsIn(['summary', 'summary_large_image'])
  twitterCard?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  canonicalUrl?: string | null;

  @IsOptional()
  @IsBoolean()
  noIndex?: boolean;

  @IsOptional()
  @IsBoolean()
  noFollow?: boolean;
}
