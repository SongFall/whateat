import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getStats() {
    // 并行执行查询，提高性能
    const [userCount, recipeCount, articleCount] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.recipe.count(),
      this.prisma.article.count(),
    ]);

    return {
      users: userCount,
      recipes: recipeCount,
      articles: articleCount,
    };
  }
}
