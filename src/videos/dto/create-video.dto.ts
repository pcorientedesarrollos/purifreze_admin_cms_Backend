import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export const videoPlacements = ['gallery', 'uses'] as const;
export type VideoPlacement = (typeof videoPlacements)[number];

export class CreateVideoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  url: string;

  @IsOptional()
  @IsIn(videoPlacements)
  placement?: VideoPlacement;

  @IsOptional()
  @IsBoolean()
  vertical?: boolean;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
