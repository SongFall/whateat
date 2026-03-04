import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import OpenAI from 'openai';
import { PrismaService } from '../prisma/prisma.service';
import { AliyunOssService } from '../upload/aliyun-oss.service';
import {
  generateRecipePrompt,
  generateRecipeImagePrompt,
  generateArticlePrompt,
  generateArticleImagePrompt,
  SYSTEM_MESSAGES,
  NEGATIVE_PROMPT,
} from './prompts';

export interface RecipeData {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  coverImage: string;
  cookingTime: string;
  difficulty: string;
  servings: string;
  calories: string;
}

export interface ArticleData {
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tags: string[];
}

@Injectable()
export class AiService {
  private readonly API_KEY = process.env.QWEN_API_KEY;
  private readonly QWEN_MODEL = process.env.QWEN_MODEL; // Qwen多模态模型，用于食谱和文章生成
  private readonly QWEN_IMAGE_MODEL = process.env.QWEN_IMAGE_MODEL; // Qwen图片生成模型
  private readonly BASE_URL =
    'https://dashscope.aliyuncs.com/compatible-mode/v1';
  private readonly IMAGE_URL =
    'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';

  private openai: OpenAI;

  constructor(
    private prisma: PrismaService,
    private aliyunOssService: AliyunOssService,
  ) {
    // 初始化OpenAI客户端，使用阿里云百炼的OpenAI兼容接口
    this.openai = new OpenAI({
      apiKey: this.API_KEY,
      baseURL: this.BASE_URL,
    });
  }

  private async callApiWithRetry(
    config: any,
    maxRetries: number = 3,
    baseDelay: number = 1000,
  ): Promise<any> {
    let retries = 0;
    while (retries < maxRetries) {
      try {
        const response = await axios(config);
        return response.data;
      } catch (error: any) {
        if (
          error.response &&
          error.response.status === 429 &&
          retries < maxRetries - 1
        ) {
          const delay = baseDelay * Math.pow(2, retries); // 指数退避策略
          await new Promise((resolve) => setTimeout(resolve, delay));
          retries++;
        } else {
          throw error;
        }
      }
    }
    throw new Error('达到最大重试次数');
  }

  async generateRecipe(
    userId: number,
    ingredients: string,
    imageUrls?: string[],
    taste?: string,
    cuisine?: string,
    cookingMethod?: string,
    difficulty?: string,
    servings?: string,
    cookingTime?: string,
    dietaryRestrictions?: string,
    
  ): Promise<number> {
    try {
      const qwenResponse = await this.callQwenModelForRecipe(
        ingredients,
        imageUrls,
        taste,
        cuisine,
        cookingMethod,
        difficulty,
        servings,
        cookingTime,
        dietaryRestrictions,
      );

      // 解析QWEN返回的食谱数据
      console.log('QWEN返回的原始数据:', qwenResponse.choices[0].message.content);
      let rawRecipeData: any = qwenResponse.choices[0].message.content;
      
      // 如果返回的是字符串，解析为JSON
      if (typeof rawRecipeData === 'string') {
        try {
          rawRecipeData = JSON.parse(rawRecipeData);
        } catch (error) {
          console.error('解析JSON失败:', error);
          rawRecipeData = {};
        }
      }
      
      // 转换JSON响应为RecipeData格式
      const recipeData: RecipeData = {
        title: rawRecipeData?.title || '',
        description: rawRecipeData?.description || '',
        ingredients: rawRecipeData?.ingredients?.map((ing: { name: string; amount: string }) => `${ing.name}：${ing.amount}`) || [],
        steps: rawRecipeData?.steps?.map((step: { name: string; description: string }) => `${step.name}：${step.description}`) || [],
        coverImage: '',
        cookingTime: rawRecipeData?.cookingTime || '',
        difficulty: rawRecipeData?.difficulty || '',
        servings: rawRecipeData?.servings || '',
        calories: rawRecipeData?.calories || ''
      };

      console.log('解析后的食谱数据:', recipeData);

      const coverImageUrl = await this.generateRicipeCoverImage(
        recipeData.title,
        recipeData.ingredients,
      );

      // 上传图片到阿里云OSS
      try {
        const ossImageUrl =
          await this.aliyunOssService.uploadImageFromUrl(coverImageUrl);
        recipeData.coverImage = ossImageUrl;
        console.log('图片已成功上传到阿里云OSS:', ossImageUrl);
      } catch (error) {
        console.warn('阿里云OSS上传失败，使用原始URL:', error);
        recipeData.coverImage = coverImageUrl;
      }

      // 保存食谱到数据库
      const recipeId = await this.saveRecipeToDatabase(recipeData, userId);

      return recipeId;
    } catch (error) {
      console.error('AI生成食谱失败:', error);

      // 处理不同类型的错误
      if (error.response) {
        // 服务器返回错误
        console.log('AI API response status:', error.response.status);
        console.log(
          'AI API response data:',
          JSON.stringify(error.response.data, null, 2),
        );
          const errorMessage =
            error.response.data?.error?.message ||
            JSON.stringify(error.response.data);
          throw new HttpException(
            `AI服务返回错误: ${errorMessage}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }

      // 其他错误
      throw new HttpException(
        'AI生成食谱失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async callQwenModelForRecipe(
    ingredients?: string,
    imageUrls?: string[],
    taste?: string,
    cuisine?: string,
    cookingMethod?: string,
    difficulty?: string,
    servings?: string,
    cookingTime?: string,
    dietaryRestrictions?: string,
  ) {
    const prompt = generateRecipePrompt(
      ingredients,
      imageUrls || [],
      taste,
      cuisine,
      cookingMethod,
      difficulty,
      servings,
      cookingTime,
      dietaryRestrictions,
    );

    let messages: any[] = [
        {
          role: 'system',
          content: SYSTEM_MESSAGES.recipe,
        },
    ];

    // 构建messages数组，只在有图片时添加图片内容
    if (imageUrls && imageUrls.length > 0) {
      const content: any[] = []
      imageUrls.forEach((url) => {
        content.push({ type: 'image_url', image_url: { url } })
      })
      content.push({ type: 'text', text: prompt })
      messages.push({
        role: 'user',
        content: content,
      });
    }
    else{
      messages.push({
          role: 'user',
          content: prompt,
      })
    }

    // 使用OpenAI SDK调用阿里云百炼的OpenAI兼容接口
    const response = await this.openai.chat.completions.create({
      model: this.QWEN_MODEL,
      messages,
      response_format: {
        type: "json_object"
      },
      enable_thinking: false,
    } as any);

    console.log('Qwen model response:', JSON.stringify(response, null, 2));
    return response;
  }

  private async generateRicipeCoverImage(title: string, ingredients: string[]) {
    const ingredientsList = ingredients
      .map((ing) => ing.split('：')[0])
      .join('、');
    const prompt = generateRecipeImagePrompt(title, ingredientsList);
    return this.generateImage(prompt, '1664*928');
  }

  private async generateImage(prompt: string, size: string) {
    const config = {
      method: 'post',
      url: this.IMAGE_URL,
      data: {
        model: this.QWEN_IMAGE_MODEL,
        input: {
          messages: [
            {
              role: 'user',
              content: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        },
        parameters: {
          negative_prompt:NEGATIVE_PROMPT,
          prompt_extend: true,
          watermark: false,
          size,
        },
      },
      headers: {
        Authorization: `Bearer ${this.API_KEY}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await this.callApiWithRetry(config);

    // 解析Qwen-Image返回的图片URL
    let imageUrl = '';
    if (response.output?.choices?.[0]?.message?.content?.[0]?.image) {
      imageUrl = response.output.choices[0].message.content[0].image;
    } else if (response.output?.images && response.output.images.length > 0) {
      imageUrl = response.output.images[0];
    } else if (response.choices?.[0]?.message?.content) {
      const content = response.choices[0].message.content;
      if (typeof content === 'string') {
        imageUrl = content;
      } else if (
        Array.isArray(content) &&
        content.length > 0 &&
        content[0].url
      ) {
        imageUrl = content[0].url;
      } else if (
        Array.isArray(content) &&
        content.length > 0 &&
        typeof content[0] === 'string'
      ) {
        imageUrl = content[0];
      }
    } else {
      console.warn('Cover image URL format not recognized:', response);
      imageUrl =
        'https://img.freepik.com/free-photo/top-view-delicious-bread-rolls-with-copy-space_23-2148713875.jpg';
    }

    // 清理URL中的多余字符（如空格、反引号等）
    imageUrl = imageUrl.trim().replace(/[`\s]+/g, '');

    return imageUrl;
  }

  private async saveRecipeToDatabase(recipeData: RecipeData, userId: number): Promise<number> {
    const recipe = await this.prisma.recipe.create({
      data: {
        title: recipeData.title,
        description: recipeData.description,
        ingredients: recipeData.ingredients.join('\n'),
        steps: recipeData.steps.join('\n'),
        coverImage: recipeData.coverImage,
        cookTime: Number(recipeData.cookingTime),
        difficulty: recipeData.difficulty,
        servings: Number(recipeData.servings),
        calories: Number(recipeData.calories),
        userId: userId, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return recipe.id;
  }

  async generateArticle(
    userId: number,
    style?: string,
    theme?: string,
    summary?: string,
  ): Promise<number> {
    try {
      const qwenResponse = await this.callQwenModelForArticle(
        style,
        theme,
        summary,
      );

      // 解析QWEN返回的文章数据
      console.log('QWEN返回的原始数据:', qwenResponse.choices[0].message.content);
      let rawArticleData: any = qwenResponse.choices[0].message.content;
      
      // 如果返回的是字符串，解析为JSON
      if (typeof rawArticleData === 'string') {
        try {
          rawArticleData = JSON.parse(rawArticleData);
        } catch (error) {
          console.error('解析JSON失败:', error);
          rawArticleData = {};
        }
      }
      
      // 转换JSON响应为ArticleData格式
      const articleData: ArticleData = {
        title: rawArticleData?.title || '',
        content: rawArticleData?.content || '',
        excerpt: rawArticleData?.excerpt || '',
        coverImage: '',
        category: rawArticleData?.category || '',
        tags: rawArticleData?.tags || []
      };

      console.log('解析后的文章数据:', articleData);

      const coverImageUrl = await this.generateArticleCoverImage(
        articleData.title,
        theme || '',
        articleData.content,
      );

      // 上传图片到阿里云OSS
      try {
        const ossImageUrl = await this.aliyunOssService.uploadImageFromUrl(
          coverImageUrl,
          'articles',
        );
        articleData.coverImage = ossImageUrl;
        console.log('图片已成功上传到阿里云OSS:', ossImageUrl);
      } catch (error) {
        console.warn('阿里云OSS上传失败，使用原始URL:', error);
        articleData.coverImage = coverImageUrl;
      }

      // 保存文章到数据库
      const articleId = await this.saveArticleToDatabase(userId, articleData);

      return articleId;
    } catch (error) {
      console.error('AI生成文章失败:', error);

      // 处理不同类型的错误
      if (error.response) {
        // 服务器返回错误
        console.log('AI API response status:', error.response.status);
        console.log(
          'AI API response data:',
          JSON.stringify(error.response.data, null, 2),
        );

        if (error.response.status === 429) {
          throw new HttpException(
            'API调用过于频繁，请稍后再试',
            HttpStatus.TOO_MANY_REQUESTS,
          );
        } else if (error.response.status === 401) {
          throw new HttpException('API密钥无效', HttpStatus.UNAUTHORIZED);
        } else if (error.response.status === 403) {
          throw new HttpException('API权限不足', HttpStatus.FORBIDDEN);
        } else {
          const errorMessage =
            error.response.data?.error?.message ||
            JSON.stringify(error.response.data);
          throw new HttpException(
            `AI服务返回错误: ${errorMessage}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      } else if (error.request) {
        // 请求已发送但没有收到响应
        throw new HttpException(
          '无法连接到AI服务，请检查网络',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      // 其他错误
      throw new HttpException(
        'AI生成文章失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async callQwenModelForArticle(
    style?: string,
    theme?: string,
    summary?: string,
  ) {
    const prompt = generateArticlePrompt(style, theme, summary);
    const messages = [
      {
        role: "system",
        content: SYSTEM_MESSAGES.article,
      },
      {
        role: "user",
        content: prompt
      }
    ];
    const response = await this.openai.chat.completions.create({
      model: this.QWEN_MODEL,
      messages,
      response_format: {
        type: "json_object"
      },
      enable_thinking: false,
    } as any);

    console.log('Qwen model response:', JSON.stringify(response, null, 2));
    return response;
  }

  private async generateArticleCoverImage(title: string, excerpt: string, theme?: string ) {
    const prompt = generateArticleImagePrompt(title, excerpt, theme);
    const imageUrl = await this.generateImage(prompt, '1024*1024');
    return imageUrl;
  }

  private async saveArticleToDatabase(
    userId: number,
    articleData: ArticleData,
  ): Promise<number> {
    const article = await this.prisma.article.create({
      data: {
        title: articleData.title,
        content: articleData.content,
        excerpt: articleData.excerpt,
        coverImage: articleData.coverImage,
        category: articleData.category,
        tags: articleData.tags.join(','),
        readingTime: articleData.content?.length
          ? Math.ceil(articleData.content.length / 200)
          : 0,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return article.id;
  }
}
