import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AiService } from './ai.service';
import { CreateAiRecipeDto } from './dto/create-ai-recipe.dto';
import { CreateAiArticleDto } from './dto/create-ai-article.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-recipe')
  @HttpCode(HttpStatus.OK)
  async generateRecipe(@Body() createAiRecipeDto: CreateAiRecipeDto) {
    const { ingredients, imageUrls, taste } = createAiRecipeDto;
    const recipeId = await this.aiService.generateRecipe(ingredients, imageUrls, taste);
    return { recipeId };
  }

  @Post('generate-article')
  @HttpCode(HttpStatus.OK)
  async generateArticle(@Body() createAiArticleDto: CreateAiArticleDto) {
    const { style, theme, summary } = createAiArticleDto;
    const articleId = await this.aiService.generateArticle(style, theme, summary);
    return { articleId };
  }
}
