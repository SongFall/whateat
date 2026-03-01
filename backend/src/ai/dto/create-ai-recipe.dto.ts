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
}
