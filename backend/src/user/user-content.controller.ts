import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('user-content')
export class UserContentController {
  constructor(private readonly userService: UserService) {}

  @Get(':id/articles')
  async getUserArticles(@Param('id') id: string) {
    try {
      const articles = await this.userService.getUserArticles(+id);
      return {
        success: true,
        data: articles,
        message: '获取用户文章成功',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: `获取用户文章失败: ${error instanceof Error ? error.message : String(error)}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/recipes')
  async getUserRecipes(@Param('id') id: string) {
    try {
      const recipes = await this.userService.getUserRecipes(+id);
      return {
        success: true,
        data: recipes,
        message: '获取用户食谱成功',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: `获取用户食谱失败: ${error instanceof Error ? error.message : String(error)}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/collections')
  async getUserCollections(@Param('id') id: string) {
    try {
      const collections = await this.userService.getUserCollections(+id);
      return {
        success: true,
        data: collections,
        message: '获取用户收藏成功',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: `获取用户收藏失败: ${error instanceof Error ? error.message : String(error)}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  async followUser(@Param('id') id: string, @Request() req) {
    try {
      const followerId = req.user?.id;
      if (!followerId) {
        throw new HttpException(
          {
            success: false,
            message: '请先登录',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const result = await this.userService.followUser(followerId, +id);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: `关注用户失败: ${error instanceof Error ? error.message : String(error)}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/unfollow')
  async unfollowUser(@Param('id') id: string, @Request() req) {
    try {
      const followerId = req.user?.id;
      if (!followerId) {
        throw new HttpException(
          {
            success: false,
            message: '请先登录',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const result = await this.userService.unfollowUser(followerId, +id);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: `取消关注用户失败: ${error instanceof Error ? error.message : String(error)}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async likeUser(@Param('id') id: string, @Request() req) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpException(
          {
            success: false,
            message: '请先登录',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const result = await this.userService.likeUser(userId, +id);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: `点赞用户失败: ${error instanceof Error ? error.message : String(error)}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/unlike')
  async unlikeUser(@Param('id') id: string, @Request() req) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpException(
          {
            success: false,
            message: '请先登录',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const result = await this.userService.unlikeUser(userId, +id);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: `取消点赞用户失败: ${error instanceof Error ? error.message : String(error)}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/comments')
  async getUserComments(@Param('id') id: string) {
    try {
      const comments = await this.userService.getUserComments(+id);
      return {
        success: true,
        data: comments,
        message: '获取用户留言成功',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: `获取用户留言失败: ${error instanceof Error ? error.message : String(error)}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  async createUserComment(@Param('id') id: string, @Body() body: { content: string, parentId?: number }, @Request() req) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpException(
          {
            success: false,
            message: '请先登录',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const comment = await this.userService.createUserComment(userId, +id, body.content, body.parentId);
      return {
        success: true,
        data: comment,
        message: '留言成功',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: `留言失败: ${error instanceof Error ? error.message : String(error)}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('comments/:id')
  async deleteUserComment(@Param('id') id: string, @Request() req) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpException(
          {
            success: false,
            message: '请先登录',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const result = await this.userService.deleteUserComment(+id, userId);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: `删除留言失败: ${error instanceof Error ? error.message : String(error)}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}