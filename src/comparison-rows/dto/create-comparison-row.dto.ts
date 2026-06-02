import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateComparisonRowDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  feature: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  category: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  purifrezeText: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  garrafonesText: string;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
