import { IsString, IsOptional, IsArray, IsUrl } from 'class-validator';

export class CreateAiRecipeDto {
  @IsString()
  ingredients: string;

  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  imageUrls: string[];

  @IsString()
  taste: string;

  @IsString()
  @IsOptional()
  cuisine: string;

  @IsString()
  @IsOptional()
  cookingMethod: string;

  @IsString()
  @IsOptional()
  difficulty: string;

  @IsString()
  @IsOptional()
  servings: string;

  @IsString()
  @IsOptional()
  cookingTime: string;

  @IsString()
  @IsOptional()
  dietaryRestrictions: string;
}
