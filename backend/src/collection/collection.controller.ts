import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { CollectionService } from './collection.service';

@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.collectionService.findAll(query);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string, @Query('type') type?: string) {
    return this.collectionService.findByUser(+userId, type);
  }

  @Post('recipe')
  collectRecipe(@Body() body: { userId: number; recipeId: number }) {
    return this.collectionService.collectRecipe(body.userId, body.recipeId);
  }

  @Post('article')
  collectArticle(@Body() body: { userId: number; articleId: number }) {
    return this.collectionService.collectArticle(body.userId, body.articleId);
  }

  @Delete('recipe')
  uncollectRecipe(@Body() body: { userId: number; recipeId: number }) {
    return this.collectionService.uncollectRecipe(body.userId, body.recipeId);
  }

  @Delete('article')
  uncollectArticle(@Body() body: { userId: number; articleId: number }) {
    return this.collectionService.uncollectArticle(body.userId, body.articleId);
  }
}
