import { IsNotEmpty, IsOptional, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  content: string;

  @IsOptional()
  @IsNumber()
  parentId?: number;
}

export class UpdateCommentDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  content: string;
}

export class CommentQueryDto {
  @IsOptional()
  @IsNumber()
  page: number = 1;

  @IsOptional()
  @IsNumber()
  limit: number = 10;
}
