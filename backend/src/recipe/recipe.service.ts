import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipeService {
  constructor(private readonly prisma: PrismaService) {}

  create(createRecipeDto: CreateRecipeDto) {
    return this.prisma.recipe.create({
      data: createRecipeDto,
    });
  }

  async findAll(query: any) {
    const { page = 1, limit = 10, search, difficulty } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const recipes = await this.prisma.recipe.findMany({
      where: {
        ...(search && {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
            { ingredients: { contains: search } },
          ],
        }),
        ...(difficulty && { difficulty }),
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
      },
      orderBy: { createdAt: 'desc' },
    });

    // 处理返回的数据结构，使其与前端期望一致
    return recipes.map((recipe) => ({
      ...recipe,
      imageUrl: recipe.coverImage,
      prepTime: '10分钟', // 默认为10分钟
      cookTime: recipe.cookTime ? `${recipe.cookTime}分钟` : '15分钟',
      tags: ['家常菜', 'AI生成'], // 默认标签
    }));
  }

  async findOne(id: number) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
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

    if (!recipe) {
      throw new HttpException('Recipe not found', HttpStatus.NOT_FOUND);
    }

    // 处理ingredients和steps字段，从字符串转换为数组
    const processedRecipe = {
      ...recipe,
      // 添加imageUrl字段，指向coverImage
      imageUrl: recipe.coverImage,
      ingredients: recipe.ingredients
        ? recipe.ingredients.split('\n').map((item) => {
            // 尝试解析为对象格式，如果失败则返回原始字符串
            try {
              // 简单处理，将食材字符串转换为对象
              const match = item.match(/^(.*?)\s*(\d+.*)$/);
              if (match) {
                return { name: match[1].trim(), amount: match[2].trim() };
              }
              return { name: item.trim(), amount: '' };
            } catch (error) {
              return { name: item.trim(), amount: '' };
            }
          })
        : [],
      steps: recipe.steps
        ? recipe.steps.split('\n').map((step, index) => {
            // 移除步骤描述中可能存在的"步骤 X"前缀
            const cleanedStep = step.trim().replace(/^步骤\s*\d+\s*/, '');
            // 尝试提取步骤标题（如果有）
            // 格式1: "准备工作 土豆去皮洗净..."
            // 格式2: "准备工作：土豆去皮洗净..."
            let title = `步骤 ${index + 1}`;
            let description = cleanedStep;

            // 尝试匹配"步骤名称：步骤描述"格式
            const titleMatch1 = cleanedStep.match(/^(.+?)[：:](.+)$/);
            if (titleMatch1) {
              title = titleMatch1[1].trim();
              description = titleMatch1[2].trim();
            } else {
              // 尝试匹配"步骤名称 步骤描述"格式（没有冒号）
              // 这里需要更智能的分割，因为步骤描述中可能包含空格
              // 我们假设步骤名称是简短的，通常是2-4个汉字
              const titleMatch2 = cleanedStep.match(
                /^([\u4e00-\u9fa5]{2,4})\s+(.+)$/,
              );
              if (titleMatch2) {
                title = titleMatch2[1].trim();
                description = titleMatch2[2].trim();
              }
            }

            return {
              title,
              description,
              image: '',
            };
          })
        : [],
      // 添加其他前端期望的字段
      prepTime: '10分钟', // 默认为10分钟
      tags: ['家常菜', 'AI生成'], // 默认标签
      tools: [
        { name: '炒锅', use: '炒菜' },
        { name: '砧板', use: '切菜' },
        { name: '刀', use: '切菜' },
      ], // 默认工具
    };

    return processedRecipe;
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto) {
    try {
      return await this.prisma.recipe.update({
        where: { id },
        data: updateRecipeDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Recipe not found', HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.recipe.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Recipe not found', HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  async findByUserId(userId: number, query: any = {}) {
    const { page = 1, limit = 10 } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const recipes = await this.prisma.recipe.findMany({
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
      },
      orderBy: { createdAt: 'desc' },
    });

    // 处理返回的数据结构，使其与前端期望一致
    return recipes.map((recipe) => ({
      ...recipe,
      imageUrl: recipe.coverImage,
      prepTime: '10分钟', // 默认为10分钟
      cookTime: recipe.cookTime ? `${recipe.cookTime}分钟` : '15分钟',
      tags: ['家常菜', 'AI生成'], // 默认标签
    }));
  }
}
