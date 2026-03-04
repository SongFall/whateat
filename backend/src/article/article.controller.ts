import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.articleService.findAll(query);
  }

  @Get('popular')
  findPopular(@Query('limit') limit: string) {
    return this.articleService.findPopular(limit ? Number(limit) : 5);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }

  @Post(':id/like')
  like(@Param('id') id: string, @Body() body: { userId: number }) {
    return this.articleService.like(+id, body.userId);
  }

  @Delete(':id/like')
  unlike(@Param('id') id: string, @Body() body: { userId: number }) {
    return this.articleService.unlike(+id, body.userId);
  }

  @Post(':id/comment')
  comment(
    @Param('id') id: string,
    @Body() body: { userId: number; content: string; parentId?: number },
  ) {
    return this.articleService.comment(
      +id,
      body.userId,
      body.content,
      body.parentId,
    );
  }

  @Post(':id/collect')
  collect(@Param('id') id: string, @Body() body: { userId: number }) {
    return this.articleService.collect(+id, body.userId);
  }

  @Delete(':id/collect')
  uncollect(@Param('id') id: string, @Body() body: { userId: number }) {
    return this.articleService.uncollect(+id, body.userId);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string, @Query() query: any) {
    return this.articleService.findByUserId(+userId, query);
  }
}
