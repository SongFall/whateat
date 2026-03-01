import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  ingredients: string;

  @IsString()
  steps: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsInt()
  cookTime?: number;

  @IsOptional()
  @IsString()
  difficulty?: string;

  @IsOptional()
  @IsInt()
  servings?: number;

  @IsOptional()
  @IsInt()
  calories?: number;

  @IsInt()
  userId: number;
}