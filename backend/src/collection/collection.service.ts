import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CollectionService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(query: any) {
    const { page = 1, limit = 10 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    
    return this.prisma.collection.findMany({
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
        recipe: true,
        article: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findByUser(userId: number, type?: string) {
    return this.prisma.collection.findMany({
      where: {
        userId,
        ...(type === 'recipe' && { recipeId: { not: null } }),
        ...(type === 'article' && { articleId: { not: null } }),
      },
      include: {
        recipe: {
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
        },
        article: {
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
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  collectRecipe(userId: number, recipeId: number) {
    return this.prisma.collection.create({
      data: {
        userId,
        recipeId,
      },
    });
  }

  collectArticle(userId: number, articleId: number) {
    return this.prisma.collection.create({
      data: {
        userId,
        articleId,
      },
    });
  }

  uncollectRecipe(userId: number, recipeId: number) {
    return this.prisma.collection.delete({
      where: {
        unique_user_recipe_collection: {
          userId,
          recipeId,
        },
      },
    });
  }

  uncollectArticle(userId: number, articleId: number) {
    return this.prisma.collection.delete({
      where: {
        unique_user_article_collection: {
          userId,
          articleId,
        },
      },
    });
  }
}