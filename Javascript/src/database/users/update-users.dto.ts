import { IsInt, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsInt()
  socialcredits?: number;

  @IsOptional()
  @IsInt()
  O?: number;

  @IsOptional()
  @IsInt()
  C?: number;

  @IsOptional()
  @IsInt()
  E?: number;

  @IsOptional()
  @IsInt()
  A?: number;

  @IsOptional()
  @IsInt()
  N?: number;
}
