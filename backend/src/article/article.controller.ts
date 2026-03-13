import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CreateCommentDto, UpdateCommentDto, CommentQueryDto } from './dto/comment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetCurrentUser } from '../common/decorators/get-current-user.decorator';

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

  @Get('recommended')
  findRecommended(@Query('limit') limit: string) {
    return this.articleService.findRecommended(limit ? Number(limit) : 3);
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

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  like(@Param('id') id: string, @GetCurrentUser() user: { userId: number }) {
    return this.articleService.like(+id, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  unlike(@Param('id') id: string, @GetCurrentUser() user: { userId: number }) {
    return this.articleService.unlike(+id, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comment')
  comment(
    @Param('id') id: string,
    @Body() body: CreateCommentDto,
    @GetCurrentUser() user: { userId: number },
  ) {
    return this.articleService.comment(
      +id,
      user.userId,
      body.content,
      body.parentId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('comments/:commentId')
  updateComment(
    @Param('commentId') commentId: string,
    @Body() body: UpdateCommentDto,
    @GetCurrentUser() user: { userId: number },
  ) {
    return this.articleService.updateComment(
      +commentId,
      user.userId,
      body.content,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('comments/:commentId')
  deleteComment(
    @Param('commentId') commentId: string,
    @GetCurrentUser() user: { userId: number },
  ) {
    return this.articleService.deleteComment(
      +commentId,
      user.userId,
    );
  }

  @Get(':id/comments')
  getComments(
    @Param('id') id: string,
    @Query() query: CommentQueryDto,
  ) {
    return this.articleService.getComments(
      +id,
      query,
    );
  }

  @Get('comments/:commentId/replies')
  getCommentReplies(
    @Param('commentId') commentId: string,
    @Query() query: CommentQueryDto,
  ) {
    return this.articleService.getCommentReplies(
      +commentId,
      query,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/collect')
  collect(@Param('id') id: string, @GetCurrentUser() user: { id: number }) {
    return this.articleService.collect(+id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/collect')
  uncollect(@Param('id') id: string, @GetCurrentUser() user: { id: number }) {
    return this.articleService.uncollect(+id, user.id);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string, @Query() query: any) {
    return this.articleService.findByUserId(+userId, query);
  }
}
