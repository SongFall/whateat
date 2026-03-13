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

    // 构建查询条件
    const where = {
      ...(search && {
        OR: [
          { title: { contains: search } },
          { content: { contains: search } },
          { tags: { contains: search } },
          { category: { contains: search } },
        ],
      }),
      ...(category && { category }),
      ...(tag && { tags: { contains: tag } }),
    };

    // 并行执行查询
    const [articles, count] = await Promise.all([
      this.prisma.article.findMany({
        where,
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
      }),
      this.prisma.article.count({ where }),
    ]);

    // 处理文章数据，添加author字段和阅读时间
    const processedArticles = articles.map((article) => ({
      ...article,
      author: article.user?.nickname || article.user?.username || '未知作者',
      authorAvatar: article.user?.avatar,
      createdAt: article.createdAt.toISOString().split('T')[0],
      publishDate: article.createdAt.toISOString().split('T')[0],
      readingTime: article.readingTime,
    }));

    // 返回包含文章列表和总数的对象
    return {
      data: processedArticles,
      count,
      page: Number(page),
      limit: Number(limit),
    };
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
    return articles.map((article) => ({
      ...article,
      author: article.user?.nickname || article.user?.username || '未知作者',
      authorAvatar: article.user?.avatar,
      createdAt: article.createdAt.toISOString().split('T')[0],
      publishDate: article.createdAt.toISOString().split('T')[0],
      readingTime: article.readingTime,
    }));
  }

  async findRecommended(limit: number = 3) {
    try {
      console.log('开始获取推荐文章，limit:', limit);
      // 确保limit是正整数
      const validLimit = Math.max(1, Math.min(10, Number(limit) || 3));
      console.log('有效limit:', validLimit);
      
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
        // 综合排序：优先考虑浏览量，其次是创建时间
        orderBy: [
          { viewCount: 'desc' },
          { createdAt: 'desc' }
        ],
        take: validLimit,
      });
      
      console.log('获取到文章数量:', articles.length);

      // 处理文章数据，添加author字段和阅读时间
      const result = articles.map((article) => ({
        ...article,
        author: article.user?.nickname || article.user?.username || '未知作者',
        authorAvatar: article.user?.avatar,
        createdAt: article.createdAt ? article.createdAt.toISOString().split('T')[0] : null,
        publishDate: article.createdAt ? article.createdAt.toISOString().split('T')[0] : null,
        readingTime: article.readingTime || 0,
      }));
      
      console.log('处理完成，返回结果数量:', result.length);
      return result;
    } catch (error) {
      console.error('获取推荐文章失败:', error);
      throw error;
    }
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return this.prisma.article.update({
      where: { id },
      data: updateArticleDto,
    });
  }

  async remove(id: number, userId: number) {
    // Delete related records first to avoid foreign key constraint
    await this.prisma.comment.deleteMany({
      where: { articleId: id },
    });
    
    await this.prisma.like.deleteMany({
      where: { articleId: id },
    });
    
    await this.prisma.collection.deleteMany({
      where: { articleId: id },
    });
    
    // Now delete the article
    return this.prisma.article.delete({
      where: {
        id,
        userId,
      },
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

  async comment(
    articleId: number,
    userId: number,
    content: string,
    parentId?: number,
  ) {
    const comment = await this.prisma.comment.create({
      data: {
        articleId,
        userId,
        content,
        parentId,
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
      },
    });
    
    return {
      ...comment,
      author: comment.user?.nickname || comment.user?.username || '未知用户',
      authorAvatar: comment.user?.avatar,
      createdAt: comment.createdAt.toISOString().split('T')[0],
    };
  }

  async updateComment(
    commentId: number,
    userId: number,
    content: string,
  ) {
    // 先检查评论是否存在且属于该用户
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    
    if (!comment) {
      throw new Error('评论不存在');
    }
    
    if (comment.userId !== userId) {
      throw new Error('无权修改此评论');
    }
    
    const updatedComment = await this.prisma.comment.update({
      where: { id: commentId },
      data: { content },
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
    });
    
    return {
      ...updatedComment,
      author: updatedComment.user?.nickname || updatedComment.user?.username || '未知用户',
      authorAvatar: updatedComment.user?.avatar,
      createdAt: updatedComment.createdAt.toISOString().split('T')[0],
    };
  }

  async deleteComment(
    commentId: number,
    userId: number,
  ) {
    // 先检查评论是否存在
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        article: {
          select: {
            userId: true,
          },
        },
      },
    });
    
    if (!comment) {
      throw new Error('评论不存在');
    }
    
    // 检查用户是否为评论作者或文章作者
    const isCommentAuthor = comment.userId === userId;
    const isArticleAuthor = comment.article.userId === userId;
    
    if (!isCommentAuthor && !isArticleAuthor) {
      throw new Error('无权删除此评论');
    }
    
    return this.prisma.comment.delete({
      where: { id: commentId },
    });
  }

  async getComments(
    articleId: number,
    query: { page?: number; limit?: number },
  ) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    
    const [comments, count] = await Promise.all([
      this.prisma.comment.findMany({
        where: { articleId, parentId: null }, // 只获取顶级评论
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
              nickname: true,
            },
          },
          replies: {
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
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.comment.count({ where: { articleId, parentId: null } }),
    ]);
    
    // 处理评论数据
    const processedComments = comments.map(comment => ({
      ...comment,
      author: comment.user?.nickname || comment.user?.username || '未知用户',
      authorAvatar: comment.user?.avatar,
      createdAt: comment.createdAt.toISOString().split('T')[0],
      replies: comment.replies.map(reply => ({
        ...reply,
        author: reply.user?.nickname || reply.user?.username || '未知用户',
        authorAvatar: reply.user?.avatar,
        createdAt: reply.createdAt.toISOString().split('T')[0],
      })),
    }));
    
    return {
      data: processedComments,
      count,
      page,
      limit,
    };
  }

  async getCommentReplies(
    commentId: number,
    query: { page?: number; limit?: number },
  ) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    
    const [replies, count] = await Promise.all([
      this.prisma.comment.findMany({
        where: { parentId: commentId },
        skip,
        take: limit,
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
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.comment.count({ where: { parentId: commentId } }),
    ]);
    
    // 处理回复数据
    const processedReplies = replies.map(reply => ({
      ...reply,
      author: reply.user?.nickname || reply.user?.username || '未知用户',
      authorAvatar: reply.user?.avatar,
      createdAt: reply.createdAt.toISOString().split('T')[0],
    }));
    
    return {
      data: processedReplies,
      count,
      page,
      limit,
    };
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

  async findByUserId(userId: number, query: any = {}) {
    const { page = 1, limit = 10 } = query;
    const skip = (Number(page) - 1) * Number(limit);

    // 并行执行查询
    const [articles, count] = await Promise.all([
      this.prisma.article.findMany({
        where: { userId },
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
      }),
      this.prisma.article.count({ where: { userId } }),
    ]);

    // 处理文章数据，添加author字段和阅读时间
    const processedArticles = articles.map((article) => ({
      ...article,
      author: article.user?.nickname || article.user?.username || '未知作者',
      authorAvatar: article.user?.avatar,
      createdAt: article.createdAt.toISOString().split('T')[0],
      publishDate: article.createdAt.toISOString().split('T')[0],
      readingTime: article.readingTime,
    }));

    // 返回包含文章列表和总数的对象
    return {
      data: processedArticles,
      count,
      page: Number(page),
      limit: Number(limit),
    };
  }
}
