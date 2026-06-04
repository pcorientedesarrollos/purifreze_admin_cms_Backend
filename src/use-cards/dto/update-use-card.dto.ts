import { IsBoolean, IsIn, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { useCardTypes, type UseCardType } from './create-use-card.dto';

export class UpdateUseCardDto {
  @IsOptional()
  @IsIn(useCardTypes)
  type?: UseCardType;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  icon?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  mediaUrl?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  altText?: string | null;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
