import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export const useCardTypes = ['text', 'image', 'video'] as const;
export type UseCardType = (typeof useCardTypes)[number];

export class CreateUseCardDto {
  @IsIn(useCardTypes)
  type: UseCardType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

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
