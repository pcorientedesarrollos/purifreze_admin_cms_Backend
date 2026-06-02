import { IsBoolean, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateComparisonRowDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  feature?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  category?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  purifrezeText?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  garrafonesText?: string;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
