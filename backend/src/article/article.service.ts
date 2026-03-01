import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}

  create(createArticleDto: CreateArticleDto) {
    return this.prisma.article.create({
      data: createArticleDto,
    });
  }

  async findAll(query: any) {
    const { page = 1, limit = 10, search, category, tag } = query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const articles = await this.prisma.article.findMany({
      where: {
        ...(search && {
          OR: [
            { title: { contains: search } },
            { content: { contains: search } },
            { tags: { contains: search } },
            { category: { contains: search } },
            { readingTime: { contains: search } },
          ],
        }),
        ...(category && { category }),
        ...(tag && { tags: { contains: tag } }),
      },
      skip,
      take: Number(limit),
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
            nickname: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
                nickname: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        likes: true,
        collections: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // 处理文章数据，添加author字段和阅读时间
    return articles.map(article => ({
      ...article,
      author: article.user?.nickname || article.user?.username || '未知作者',
      authorAvatar: article.user?.avatar,
      createdAt: article.createdAt.toISOString().split('T')[0],
      publishDate: article.createdAt.toISOString().split('T')[0],
      readingTime: article.readingTime,
    }));
  }

  async findOne(id: number) {
    // 先更新浏览量
    await this.prisma.article.update({
      where: {
        id: id,
      },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
    
    // 然后返回文章详情
    const article = await this.prisma.article.findUnique({
      where: {
        id: id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
            nickname: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
                nickname: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        likes: true,
        collections: true,
      },
    });

    // 处理文章数据，添加author字段和阅读时间
    if (article) {
      return {
        ...article,
        author: article.user?.nickname || article.user?.username || '未知作者',
        authorAvatar: article.user?.avatar,
        createdAt: article.createdAt.toISOString().split('T')[0],
        publishDate: article.createdAt.toISOString().split('T')[0],
        readingTime: article.readingTime,
      };
    }
    return null;
  }

  async findPopular(limit: number = 5) {
    const articles = await this.prisma.article.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
            nickname: true,
          },
        },
      },
      orderBy: { viewCount: 'desc' },
      take: limit,
    });

    // 处理文章数据，添加author字段和阅读时间
    return articles.map(article => ({
      ...article,
      author: article.user?.nickname || article.user?.username || '未知作者',
      authorAvatar: article.user?.avatar,
      createdAt: article.createdAt.toISOString().split('T')[0],
      publishDate: article.createdAt.toISOString().split('T')[0],
      readingTime: article.readingTime,
    }));
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return this.prisma.article.update({
      where: { id },
      data: updateArticleDto,
    });
  }

  remove(id: number) {
    return this.prisma.article.delete({
      where: { id },
    });
  }

  like(articleId: number, userId: number) {
    return this.prisma.like.create({
      data: {
        articleId,
        userId,
      },
    });
  }

  unlike(articleId: number, userId: number) {
    return this.prisma.like.delete({
      where: {
        userId_articleId: {
          articleId,
          userId,
        },
      },
    });
  }

  comment(articleId: number, userId: number, content: string, parentId?: number) {
    return this.prisma.comment.create({
      data: {
        articleId,
        userId,
        content,
        parentId,
      },
    });
  }

  collect(articleId: number, userId: number) {
    return this.prisma.collection.create({
      data: {
        articleId,
        userId,
      },
    });
  }

  uncollect(articleId: number, userId: number) {
    return this.prisma.collection.delete({
      where: {
        unique_user_article_collection: {
          articleId,
          userId,
        },
      },
    });
  }
}