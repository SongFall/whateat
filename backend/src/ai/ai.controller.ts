import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { CreateAiRecipeDto } from './dto/create-ai-recipe.dto';
import { CreateAiArticleDto } from './dto/create-ai-article.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetCurrentUser } from '../common/decorators/get-current-user.decorator';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-recipe')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async generateRecipe(@Body() createAiRecipeDto: CreateAiRecipeDto, @GetCurrentUser() user: { userId: number }) {
  // async generateRecipe(@Body() createAiRecipeDto: CreateAiRecipeDto) {
    const { ingredients, imageUrls, taste, cuisine, cookingMethod, difficulty, servings, cookingTime, dietaryRestrictions } = createAiRecipeDto;
    const recipeId = await this.aiService.generateRecipe(
      user.userId,
      ingredients,
      imageUrls,
      taste,
      cuisine,
      cookingMethod,
      difficulty,
      servings,
      cookingTime,
      dietaryRestrictions,    
    );
    return { recipeId };
  }

  @Post('generate-article')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async generateArticle(@Body() createAiArticleDto: CreateAiArticleDto, @GetCurrentUser() user: { userId: number }) {
    const { style, theme, summary } = createAiArticleDto;
    const articleId = await this.aiService.generateArticle(
      user.userId,
      style,
      theme,
      summary,
    );
    return { articleId };
  }
}
