import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { AliyunOssService } from '../upload/aliyun-oss.service';

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
  private readonly API_KEY = '676f14182fd94cd1aedc05d9e2f3b503.eVom96OQcOCCyTd6';
  private readonly GLM_MODEL = 'glm-4.6v-flash';
  private readonly COGVIEW_MODEL = 'cogview-3-flash';
  private readonly API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

  constructor(private prisma: PrismaService, private aliyunOssService: AliyunOssService) {}

  private async callApiWithRetry(config: any, maxRetries: number = 3, baseDelay: number = 1000): Promise<any> {
    let retries = 0;
    while (retries < maxRetries) {
      try {
        const response = await axios(config);
        return response.data;
      } catch (error: any) {
        if (error.response && error.response.status === 429 && retries < maxRetries - 1) {
          // 遇到429错误，等待后重试
          const delay = baseDelay * Math.pow(2, retries); // 指数退避策略
          console.log(`遇到429错误，${delay}ms后重试 (${retries + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          retries++;
        } else {
          throw error;
        }
      }
    }
    throw new Error('达到最大重试次数');
  }

  async generateRecipe(ingredients: string, imageUrls: string[], taste: string): Promise<number> {
    try {
      // 构建GLM-4.6V-Flash的请求
      const glmResponse = await this.callGlmModel(ingredients, imageUrls, taste);
      
      // 解析GLM返回的食谱数据
      const recipeData = this.parseGlmResponse(glmResponse);
      
      // 使用Cogview-3-Flash生成食谱封面图
      const coverImageUrl = await this.generateCoverImage(recipeData.title, recipeData.ingredients);
      
      // 上传图片到阿里云OSS
      try {
        const ossImageUrl = await this.aliyunOssService.uploadImageFromUrl(coverImageUrl);
        recipeData.coverImage = ossImageUrl;
        console.log('图片已成功上传到阿里云OSS:', ossImageUrl);
      } catch (error) {
        console.warn('阿里云OSS上传失败，使用原始URL:', error);
        recipeData.coverImage = coverImageUrl;
      }
      
      // 保存食谱到数据库
      const recipeId = await this.saveRecipeToDatabase(recipeData);
      
      return recipeId;
    } catch (error) {
      console.error('AI生成食谱失败:', error);
      
      // 处理不同类型的错误
      if (error.response) {
        // 服务器返回错误
        console.log('AI API response status:', error.response.status);
        console.log('AI API response data:', JSON.stringify(error.response.data, null, 2));
        
        if (error.response.status === 429) {
          throw new HttpException('API调用过于频繁，请稍后再试', HttpStatus.TOO_MANY_REQUESTS);
        } else if (error.response.status === 401) {
          throw new HttpException('API密钥无效', HttpStatus.UNAUTHORIZED);
        } else if (error.response.status === 403) {
          throw new HttpException('API权限不足', HttpStatus.FORBIDDEN);
        } else {
          const errorMessage = error.response.data?.error?.message || JSON.stringify(error.response.data);
          throw new HttpException(`AI服务返回错误: ${errorMessage}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      } else if (error.request) {
        // 请求已发送但没有收到响应
        throw new HttpException('无法连接到AI服务，请检查网络', HttpStatus.SERVICE_UNAVAILABLE);
      }
      
      // 其他错误
      throw new HttpException('AI生成食谱失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async callGlmModel(ingredients: string, imageUrls: string[], taste: string) {
    const messages = [
      {
        role: 'system',
        content: `你是一个专业的美食食谱生成助手，需要根据用户提供的食材、口味偏好和图片，生成详细、准确、标准化的食谱。请严格按照以下要求执行：

1. 分析用户提供的食材和图片，确保食谱完全基于这些食材，不要添加用户未提及的主要食材
2. 考虑用户的口味偏好，调整食谱的调味和烹饪方式
3. 生成的食谱必须包含以下六个部分，且格式必须严格按照指定结构
4. 所有内容必须使用中文，确保语言通顺、专业、易懂
5. 每个部分的内容必须具体、详细，避免模糊描述
6. 确保生成的食谱可操作性强，步骤清晰明了
7. 保持输出格式的一致性，确保每次返回的结构完全相同
8. 不要在输出中添加任何额外的说明或解释，只返回食谱内容`
      },
      {
        role: 'user',
        content: [
          ...imageUrls.map(url => ({
            type: 'image_url',
            image_url: { url }
          })),
          {
            type: 'text',
            text: `请根据以下信息生成一份详细的食谱：\n\n【食材】：${ingredients}\n【口味偏好】：${taste}\n\n请严格按照以下格式返回，不要添加任何额外内容：\n\n1. 菜名：[菜品名称]\n2. 简介：[简要介绍菜品的特点、风味和适合场景，控制在100-150字]\n3. 所需食材：\n   - [食材1]：[用量]\n   - [食材2]：[用量]\n   - [食材3]：[用量]\n   - ...\n4. 烹饪步骤：\n   - [步骤名称1]：[步骤1详细描述]\n   - [步骤名称2]：[步骤2详细描述]\n   - [步骤名称3]：[步骤3详细描述]\n   - ...\n5. 烹饪时间：[总烹饪时间，格式为"XX分钟"]\n6. 难度等级：[简单/中等/复杂]\n7. 份量：[适合的人数，格式为"X人份"]\n8. 卡路里：[每份的大致卡路里含量，格式为"XXX卡路里"]`
          }
        ]
      }
    ];

    console.log('Sending request to GLM model with ingredients:', ingredients, 'taste:', taste);
    
    const config = {
      method: 'post',
      url: this.API_URL,
      data: {
        model: this.GLM_MODEL,
        messages,
        thinking: { type: 'disabled' },
        temperature: 0.3, // 降低随机性，提高一致性
        max_tokens: 1500 // 确保有足够的 token 生成完整食谱
      },
      headers: {
        'Authorization': `Bearer ${this.API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const response = await this.callApiWithRetry(config);
    console.log('GLM model response:', JSON.stringify(response, null, 2));
    return response;
  }

  private parseGlmResponse(response: any): RecipeData {
    const content = response.choices[0].message.content;
    
    // 解析内容，提取食谱信息
    const lines = content.split('\n');
    let title = '';
    let description = '';
    const ingredients: string[] = [];
    const steps: string[] = [];
    let cookingTime = '';
    let difficulty = '';
    let servings = '';
    let calories = '';
    
    let section = '';
    for (const line of lines) {
      if (line.startsWith('1. 菜名：')) {
        title = line.replace('1. 菜名：', '').trim();
      } else if (line.startsWith('2. 简介：')) {
        description = line.replace('2. 简介：', '').trim();
      } else if (line.startsWith('3. 所需食材：')) {
        section = 'ingredients';
      } else if (line.startsWith('4. 烹饪步骤：')) {
        section = 'steps';
      } else if (line.startsWith('5. 烹饪时间：')) {
        cookingTime = line.replace('5. 烹饪时间：', '').trim();
        section = '';
      } else if (line.startsWith('6. 难度等级：')) {
        difficulty = line.replace('6. 难度等级：', '').trim();
        section = '';
      } else if (line.startsWith('7. 份量：')) {
        servings = line.replace('7. 份量：', '').trim();
        section = '';
      } else if (line.startsWith('8. 卡路里：')) {
        calories = line.replace('8. 卡路里：', '').trim();
        section = '';
      } else if (section === 'ingredients' && line.trim()) {
        // 处理食材行，格式为"   - [食材]：[用量]"
        const ingredientMatch = line.match(/^\s*-\s*(.+?)\s*：\s*(.+)$/);
        if (ingredientMatch) {
          ingredients.push(`${ingredientMatch[1]}：${ingredientMatch[2]}`);
        } else {
          ingredients.push(line.trim());
        }
      } else if (section === 'steps' && line.trim()) {
        // 处理步骤行，格式为"   - [步骤名称]：[步骤描述]"
        const stepMatch = line.match(/^\s*-\s*(.+?)\s*：\s*(.+)$/);
        if (stepMatch) {
          // 提取步骤名称和描述，将它们组合成一个字符串
          // 格式："步骤名称 步骤描述"
          const stepName = stepMatch[1].trim();
          const stepDescription = stepMatch[2].trim();
          steps.push(`${stepName} ${stepDescription}`);
        } else {
          // 处理旧格式，格式为"   1. [步骤描述]"
          const oldStepMatch = line.match(/^\s*\d+\.\s*(.+)$/);
          if (oldStepMatch) {
            let stepDescription = oldStepMatch[1].trim();
            // 移除可能存在的"步骤 X"前缀，避免重复
            stepDescription = stepDescription.replace(/^步骤\s*\d+\s*/, '');
            steps.push(stepDescription);
          } else {
            steps.push(line.trim());
          }
        }
      }
    }
    
    return {
      title,
      description,
      ingredients,
      steps,
      coverImage: '', // 稍后由Cogview生成
      cookingTime,
      difficulty,
      servings,
      calories
    };
  }

  private async generateCoverImage(title: string, ingredients: string[]) {
    const ingredientsList = ingredients.map(ing => ing.split('：')[0]).join('、');
    
    const messages = [
      {
        role: 'system',
        content: '',
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `为一道名为"${title}"的菜品生成一张精美的封面图片，主要食材包括${ingredients.join('、')}，图片风格应该专业、诱人，适合作为食谱封面。`
          }
        ]
      }
    ];
    
    const config = {
      method: 'post',
      url: this.API_URL,
      data: {
        model: this.COGVIEW_MODEL,
        messages,
        max_tokens: 500 // 确保有足够的 token 生成图片URL
      },
      headers: {
        'Authorization': `Bearer ${this.API_KEY}`,
        'Content-Type': 'application/json'
      }
    };
    
    const response = await this.callApiWithRetry(config);
    
    // 解析Cogview返回的图片URL
    let imageUrl = '';
    const content = response.choices[0].message.content;
    
    if (typeof content === 'string') {
      imageUrl = content;
    } else if (Array.isArray(content) && content.length > 0 && content[0].url) {
      // 处理数组格式的返回值
      imageUrl = content[0].url;
    } else if (Array.isArray(content) && content.length > 0 && typeof content[0] === 'string') {
      // 处理字符串数组格式的返回值
      imageUrl = content[0];
    } else {
      console.warn('Cover image URL format not recognized:', content);
      imageUrl = 'https://example.com/default-recipe.jpg';
    }
    
    // 清理URL中的多余字符（如空格、反引号等）
    imageUrl = imageUrl.trim().replace(/[`\s]+/g, '');
    
    return imageUrl;
  }

  private parseCookingTime(cookingTime: string): number {
    // 从字符串中提取数字，例如 "30分钟" -> 30
    const match = cookingTime.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  private parseServings(servings: string): number {
    // 从字符串中提取数字，例如 "2人份" -> 2
    const match = servings.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  private parseCalories(calories: string): number {
    // 从字符串中提取数字，例如 "350卡路里" -> 350
    const match = calories.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  private async saveRecipeToDatabase(recipeData: RecipeData): Promise<number> {
    const recipe = await this.prisma.recipe.create({
      data: {
        title: recipeData.title,
        description: recipeData.description,
        ingredients: recipeData.ingredients.join('\n'),
        steps: recipeData.steps.join('\n'),
        coverImage: recipeData.coverImage,
        cookTime: this.parseCookingTime(recipeData.cookingTime),
        difficulty: recipeData.difficulty,
        servings: this.parseServings(recipeData.servings),
        calories: this.parseCalories(recipeData.calories),
        userId: 1, // 暂时默认为用户ID 1，实际应该从请求中获取
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    
    return recipe.id;
  }

  async generateArticle(style: string, theme: string, summary: string): Promise<number> {
    try {
      // 构建GLM-4.6V-Flash的请求
      const glmResponse = await this.callGlmModelForArticle(style, theme, summary);
      
      // 解析GLM返回的文章数据
      const articleData = this.parseGlmResponseForArticle(glmResponse);
      console.log(articleData);
      
      // 使用Cogview-3-Flash生成文章封面图
      const coverImageUrl = await this.generateArticleCoverImage(articleData.title, articleData.content);
      
      // 上传图片到阿里云OSS
      try {
        const ossImageUrl = await this.aliyunOssService.uploadImageFromUrl(coverImageUrl, 'articles');
        articleData.coverImage = ossImageUrl;
        console.log('图片已成功上传到阿里云OSS:', ossImageUrl);
      } catch (error) {
        console.warn('阿里云OSS上传失败，使用原始URL:', error);
        articleData.coverImage = coverImageUrl;
      }
      
      // 保存文章到数据库
      const articleId = await this.saveArticleToDatabase(articleData);
      
      return articleId;
    } catch (error) {
      console.error('AI生成文章失败:', error);
      
      // 处理不同类型的错误
      if (error.response) {
        // 服务器返回错误
        console.log('AI API response status:', error.response.status);
        console.log('AI API response data:', JSON.stringify(error.response.data, null, 2));
        
        if (error.response.status === 429) {
          throw new HttpException('API调用过于频繁，请稍后再试', HttpStatus.TOO_MANY_REQUESTS);
        } else if (error.response.status === 401) {
          throw new HttpException('API密钥无效', HttpStatus.UNAUTHORIZED);
        } else if (error.response.status === 403) {
          throw new HttpException('API权限不足', HttpStatus.FORBIDDEN);
        } else {
          const errorMessage = error.response.data?.error?.message || JSON.stringify(error.response.data);
          throw new HttpException(`AI服务返回错误: ${errorMessage}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      } else if (error.request) {
        // 请求已发送但没有收到响应
        throw new HttpException('无法连接到AI服务，请检查网络', HttpStatus.SERVICE_UNAVAILABLE);
      }
      
      // 其他错误
      throw new HttpException('AI生成文章失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async callGlmModelForArticle(style: string, theme: string, summary: string) {
    const messages = [
      {
        role: 'system',
        content: `你是一个专业的美食文章生成助手，需要根据用户提供的风格、主题和概括，生成详细、准确、生动的美食文章。请严格按照以下要求执行：

1. 分析用户提供的风格、主题和概括，确保文章内容符合这些要求
2. 生成的文章必须包含以下五个部分，且格式必须严格按照指定的JSON结构
3. 所有内容必须使用中文，确保语言通顺、专业、易懂
4. 每个部分的内容必须具体、详细，避免模糊描述
5. 确保生成的文章结构清晰，逻辑连贯，包含多个段落
6. 保持输出格式的一致性，确保每次返回的结构完全相同
7. 不要在输出中添加任何额外的说明或解释，只返回JSON格式的文章内容
8. 确保返回的内容是一个有效的JSON对象，包含以下字段：
   - title: 文章标题
   - content: 详细的文章内容，控制在800-1200字，包含多个段落，详细介绍食材选择、功效和烹饪建议
   - excerpt: 文章简介，控制在100字左右，概括文章主要内容
   - category: 文章分类，如美食文化、烹饪技巧、食材介绍等
   - tags: 标签数组，包含至少3个相关标签`
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `请根据以下信息生成一篇详细的美食文章：\n\n【文章风格】：${style}\n【文章主题】：${theme}\n【文章概括】：${summary}\n\n请严格按照以下JSON格式返回，不要添加任何额外内容：\n\n{\n  "title": "文章标题",\n  "content": "详细的文章内容，控制在800-1200字，包含多个段落，详细介绍食材选择、功效和烹饪建议",\n  "excerpt": "文章简介，控制在100字左右，概括文章主要内容",\n  "category": "文章分类，如美食文化、烹饪技巧、食材介绍等",\n  "tags": ["标签1", "标签2", "标签3", ...]\n}`
          }
        ]
      }
    ];

    console.log('Sending request to GLM model for article with style:', style, 'theme:', theme, 'summary:', summary);
    
    const config = {
      method: 'post',
      url: this.API_URL,
      data: {
        model: this.GLM_MODEL,
        messages,
        thinking: { type: 'disabled' },
        temperature: 0.3, // 降低随机性，提高一致性
        max_tokens: 3000 // 确保有足够的 token 生成完整文章
      },
      headers: {
        'Authorization': `Bearer ${this.API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const response = await this.callApiWithRetry(config);
    console.log('GLM model response for article:', JSON.stringify(response, null, 2));
    return response;
  }

  private parseGlmResponseForArticle(response: any): ArticleData {
    // 只取message里的content
    const messageContent = response.choices[0].message.content;
    console.log('messageContent', messageContent);
    
    
    // 尝试解析JSON格式
    try {
      // 清理content中的代码块标记
      let cleanedContent = messageContent.trim().replace(/^```json|```$/g, '').trim();
      console.log('cleanedContent', cleanedContent);
      function rebuildArticleJson(rawStr: string): any {
        try {
          // 1. 提取标题（匹配 "title": "xxx" 格式）
          const titleMatch = rawStr.match(/"title":\s*"([^"]+)"/);
          const title = titleMatch ? titleMatch[1] : '';

          // 2. 提取分类（匹配 "category": "xxx" 格式）
          const categoryMatch = rawStr.match(/"category":\s*"([^"]+)"/);
          const category = categoryMatch ? categoryMatch[1] : '';

          // 3. 提取摘要（匹配 "excerpt": "xxx" 格式）
          const excerptMatch = rawStr.match(/"excerpt":\s*"([^"]+)"/);
          const excerpt = excerptMatch ? excerptMatch[1] : '';

          // 4. 提取标签（匹配 "tags": [xxx] 格式）
          const tagsMatch = rawStr.match(/"tags":\s*\[(.*?)\]/);
          const tags = tagsMatch 
            ? tagsMatch[1].replace(/"/g, '').split(',').map(tag => tag.trim()) 
            : [];

          // 5. 提取内容（匹配 "content": "xxx" 到下一个 ", "key"" 之间的内容）
          const contentMatch = rawStr.match(/"content":\s*"(.*?)"(?=,\s*"excerpt")/s);
          const content = contentMatch ? contentMatch[1].replace(/\\n/g, '\n') : '';

          // 6. 组装合法的JSON对象（直接返回对象，无需JSON.parse）
          const article = {
            title,
            content,
            excerpt,
            category,
            tags
          };

          console.log('✅ 重构JSON成功！');
          return article;
        } catch (err) {
          console.error('❌ 重构JSON失败：', (err as Error).message);
          throw err;
        }
      }
      
      // 尝试直接解析
      try {
        const articleJson = rebuildArticleJson(cleanedContent);
        return {
          title: articleJson.title || '默认标题',
          content: articleJson.content || '内容生成失败',
          excerpt: articleJson.excerpt || '内容生成失败',
          coverImage: '', // 稍后由Cogview生成
          category: articleJson.category || '默认分类',
          tags: articleJson.tags || ['默认标签']
        };
      } catch (firstError) {
        console.log('第一次解析失败，尝试处理控制字符:', firstError);
        
        // 处理JSON字符串中的未转义控制字符
        // 保留转义的换行符（\n），只处理实际的换行符
        cleanedContent = cleanedContent.replace(/\r\n|\r|\n/g, '\\n');
        cleanedContent = cleanedContent.replace(/\t/g, '\\t');
        
        // 再次尝试解析
        const articleJson = JSON.parse(cleanedContent);
        return {
          title: articleJson.title || '默认标题',
          content: articleJson.content || '内容生成失败',
          excerpt: articleJson.excerpt || '内容生成失败',
          coverImage: '', // 稍后由Cogview生成
          category: articleJson.category || '默认分类',
          tags: articleJson.tags || ['默认标签']
        };
      }
    } catch (error) {
      console.log('解析JSON失败', error);
      // JSON解析失败，返回默认值
      return {
        title: '默认标题',
        content: '内容生成失败',
        excerpt: '内容生成失败',
        coverImage: '',
        category: '默认分类',
        tags: ['默认标签']
      };
    }
  }

  private async generateArticleCoverImage(title: string, excerpt: string) {
    // 从内容中提取关键信息，用于生成封面图
    const contentPreview = excerpt;
    
    const messages = [
      {
        role: 'system',
        content: '',
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `为一篇名为"${title}"的美食文章生成一张精美的封面图片，文章内容概括为：${contentPreview}，图片风格应该专业、美观，适合作为文章封面。`
          }
        ]
      }
    ];
    
    const config = {
      method: 'post',
      url: this.API_URL,
      data: {
        model: this.COGVIEW_MODEL,
        messages,
        max_tokens: 500 // 确保有足够的 token 生成图片URL
      },
      headers: {
        'Authorization': `Bearer ${this.API_KEY}`,
        'Content-Type': 'application/json'
      }
    };
    
    const response = await this.callApiWithRetry(config);
    
    // 解析Cogview返回的图片URL
    let imageUrl = '';
    const responseContent = response.choices[0].message.content;
    
    if (typeof responseContent === 'string') {
      imageUrl = responseContent;
    } else if (Array.isArray(responseContent) && responseContent.length > 0 && responseContent[0].url) {
      // 处理数组格式的返回值
      imageUrl = responseContent[0].url;
    } else if (Array.isArray(responseContent) && responseContent.length > 0 && typeof responseContent[0] === 'string') {
      // 处理字符串数组格式的返回值
      imageUrl = responseContent[0];
    } else {
      console.warn('Cover image URL format not recognized:', responseContent);
      imageUrl = 'https://example.com/default-article.jpg';
    }
    
    // 清理URL中的多余字符（如空格、反引号等）
    imageUrl = imageUrl.trim().replace(/[`\s]+/g, '');
    
    return imageUrl;
  }

  private async saveArticleToDatabase(articleData: ArticleData): Promise<number> {
    const article = await this.prisma.article.create({
      data: {
        title: articleData.title,
        content: articleData.content,
        excerpt: articleData.excerpt,
        coverImage: articleData.coverImage,
        category: articleData.category,
        tags: articleData.tags.join(','),
        readingTime: articleData.content?.length ? Math.ceil(articleData.content.length / 200) : 0,
        userId: 1, // 暂时默认为用户ID 1，实际应该从请求中获取
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    
    return article.id;
  }
}
