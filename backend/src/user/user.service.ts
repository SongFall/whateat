import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // 密码哈希处理
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        nickname: true,
        bio: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        nickname: true,
        bio: true,
        location: true,
        preferences: true,
        role: true,
        followingCount: true,
        followerCount: true,
        likeCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async getUserArticles(userId: number) {
    return this.prisma.article.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        excerpt: true,
        coverImage: true,
        viewCount: true,
        createdAt: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserRecipes(userId: number) {
    return this.prisma.recipe.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        description: true,
        coverImage: true,
        cookTime: true,
        difficulty: true,
        servings: true,
        calories: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserCollections(userId: number) {
    return this.prisma.collection.findMany({
      where: { userId },
      select: {
        id: true,
        article: {
          select: {
            id: true,
            title: true,
            excerpt: true,
            coverImage: true,
            createdAt: true,
          },
        },
        recipe: {
          select: {
            id: true,
            title: true,
            description: true,
            coverImage: true,
            createdAt: true,
          },
        },
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async followUser(followerId: number, followingId: number) {
    // 检查是否已经关注
    const existingFollow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existingFollow) {
      throw new HttpException('Already following this user', HttpStatus.BAD_REQUEST);
    }

    // 创建关注关系
    await this.prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });

    // 更新关注计数
    await this.prisma.user.update({
      where: { id: followerId },
      data: {
        followingCount: {
          increment: 1,
        },
      },
    });

    await this.prisma.user.update({
      where: { id: followingId },
      data: {
        followerCount: {
          increment: 1,
        },
      },
    });

    return { success: true, message: 'Followed successfully' };
  }

  async unfollowUser(followerId: number, followingId: number) {
    // 检查是否已经关注
    const existingFollow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (!existingFollow) {
      throw new HttpException('Not following this user', HttpStatus.BAD_REQUEST);
    }

    // 删除关注关系
    await this.prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    // 更新关注计数
    await this.prisma.user.update({
      where: { id: followerId },
      data: {
        followingCount: {
          decrement: 1,
        },
      },
    });

    await this.prisma.user.update({
      where: { id: followingId },
      data: {
        followerCount: {
          decrement: 1,
        },
      },
    });

    return { success: true, message: 'Unfollowed successfully' };
  }

  async likeUser(userId: number, targetUserId: number) {
    // 暂时先直接更新用户的likeCount，不检查是否已经点赞
    // 实际项目中应该创建一个用户点赞表来记录点赞关系
    await this.prisma.user.update({
      where: { id: targetUserId },
      data: {
        likeCount: {
          increment: 1,
        },
      },
    });

    return { success: true, message: 'Liked successfully' };
  }

  async unlikeUser(userId: number, targetUserId: number) {
    // 暂时先直接更新用户的likeCount，不检查是否已经点赞
    // 实际项目中应该创建一个用户点赞表来记录点赞关系
    await this.prisma.user.update({
      where: { id: targetUserId },
      data: {
        likeCount: {
          decrement: 1,
        },
      },
    });

    return { success: true, message: 'Unliked successfully' };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      // 创建更新数据对象，过滤掉空值
      const updateData: any = {};
      
      // 遍历所有字段，只包含非空值
      for (const [key, value] of Object.entries(updateUserDto)) {
        if (value !== undefined && value !== null && value !== '') {
          updateData[key] = value;
        }
      }
      
      // 如果更新密码，需要重新哈希
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      return await this.prisma.user.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  async login(loginUserDto: LoginUserDto) {
    // 查找用户
    const user = await this.prisma.user.findUnique({
      where: { email: loginUserDto.email },
    });

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // 生成 JWT token
    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // 返回用户信息和 token
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    };
  }

  async validateUser(email: string, password: string) {
    // 查找用户
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    // 不返回密码
    const { password: _, ...result } = user;
    return result;
  }

  // 获取用户留言（给该用户的留言）
  async getUserComments(targetUserId: number) {
    return this.prisma.userComment.findMany({
      where: { targetUserId },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
        replies: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                nickname: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 创建用户留言
  async createUserComment(userId: number, targetUserId: number, content: string, parentId?: number) {
    return this.prisma.userComment.create({
      data: {
        content,
        userId,
        targetUserId,
        parentId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
      },
    });
  }

  // 删除用户留言
  async deleteUserComment(commentId: number, userId: number) {
    // 检查留言是否存在且属于当前用户
    const comment = await this.prisma.userComment.findUnique({
      where: { id: commentId },
      select: {
        userId: true,
      },
    });

    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }

    if (comment.userId !== userId) {
      throw new HttpException('You can only delete your own comments', HttpStatus.FORBIDDEN);
    }

    // 删除留言
    await this.prisma.userComment.delete({
      where: { id: commentId },
    });

    return { success: true, message: 'Comment deleted successfully' };
  }
}
