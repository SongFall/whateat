// Recipe generation prompts
export function generateRecipePrompt(
  ingredients?: string,
  imageUrls: string[] = [],
  taste?: string,
  cuisine?: string,
  cookingMethod?: string,
  difficulty?: string,
  servings?: string,
  cookingTime?: string,
  dietaryRestrictions?: string,
): string {
  let prompt = `请根据以下信息生成一份详细的食谱：\n`;

  if (ingredients) {
    prompt += `\n【食材】：${ingredients}，按以下要求制作：\n`;
  }

  if (imageUrls && imageUrls.length > 0) {
    prompt += `食材如上传的图片所示，请从中提取出主要的食材，按以下要求制作\n`;
  }

  if (taste) {
    prompt += `\n【口味】：${taste}`;
  }
  
  if (cuisine) {
    prompt += `\n【菜系】：${cuisine}`;
  }

  if (cookingMethod) {
    prompt += `\n【烹饪方式】：${cookingMethod}`;
  }

  if (difficulty) {
    prompt += `\n【难度等级】：${difficulty}`;
  }

  if (servings) {
    prompt += `\n【份量】：${servings}`;
  }

  if (cookingTime) {
    prompt += `\n【烹饪时间】：${cookingTime}`;
  }

  if (dietaryRestrictions) {
    prompt += `\n【饮食限制】：${dietaryRestrictions}`;
  }

  // prompt += `\n\n请严格按照以下格式返回，不要添加任何额外内容：\n\n1. 菜名：[菜品名称]\n2. 简介：[简要介绍菜品的特点、风味和适合场景，控制在100-150字]\n3. 所需食材：\n   - [食材1]：[用量]\n   - [食材2]：[用量]\n   - [食材3]：[用量]\n   - ...\n4. 烹饪步骤：\n   - [步骤名称1]：[步骤1详细描述]\n   - [步骤名称2]：[步骤2详细描述]\n   - [步骤3详细描述]\n   - ...\n5. 烹饪时间：[总烹饪时间，格式为XX分钟]\n6. 难度等级：[简单/中等/复杂]\n7. 份量：[适合的人数，格式为X人份]\n8. 卡路里：[每份的大致卡路里含量，格式为XXX卡路里]`;

  prompt += `\n请按照JSON格式返回，不要添加任何额外内容：\n\n{
    "title": "菜品名称",
    "description": "简要介绍菜品的特点、风味和适合场景，控制在100-150字",
    "ingredients": [
      {"name": "食材1", "amount": "用量"},
      {"name": "食材2", "amount": "用量"},
      {"name": "食材3", "amount": "用量"},
      ...
    ],
    "steps": [
      {"name": "步骤名称1", "description": "步骤1详细描述"},
      {"name": "步骤名称2", "description": "步骤2详细描述"},
      {"name": "步骤3详细描述"},
      ...
    ],
    "cookingTime": "总烹饪时间，数字类型，单位为分钟",
    "difficulty": "简单/中等/复杂",
    "servings": "适合的人数，数字类型，单位为人份",
    "calories": "每份的大致卡路里含量，数字类型，单位为卡路里"
  }`

  return prompt;
}

// Recipe image generation prompt
export function generateRecipeImagePrompt(title: string, ingredients: string): string {
  return `请生成一张美食图片，菜品名称是"${title}"，主要食材包括${ingredients}。图片要求：高质量、真实感强、光线自然、色彩鲜艳、构图美观，适合作为食谱封面图。图片内不要出现文字。`;
}

// Article generation prompt
export function generateArticlePrompt(style?: string, theme?: string, summary?: string): string {
  let prompt = '';
  if (style) {
    prompt += `【文章风格】：${style}、`;
  }
  if (theme) {
    prompt += `【文章主题】：${theme}、`;
  }
  if (summary) {
    prompt += `【文章概括】：${summary}。`;
  }
  return `你是一个专业的美食文章生成助手，需要根据以下要求生成一篇美食文章：
1.${prompt}
2. 生成的文章必须包含以下五个部分,且格式必须严格按照指定的JSON结构:
{
  "title": "文章标题",
  "content": "详细的文章内容，控制在800-1200字，包含多个段落，详细介绍食材选择、功效和烹饪建议",
  "excerpt": "文章简介，控制在100字左右，概括文章主要内容",
  "category": "文章分类，如美食文化、烹饪技巧、食材介绍等",
  "tags": ["标签1", "标签2", "标签3", ...]
};
3. 所有内容必须使用中文，文中的标点符号必须使用中文，确保语言通顺、专业、易懂
4. 每个部分的内容必须具体、详细，避免模糊描述，确保生成的文章结构清晰，逻辑连贯，包含多个段落
5. 对于文章内容，如果存在换行符，请在JSON中用\\n表示，如果存在分级标题，请在JSON中用#表示，如果存在列表项，请在JSON中用-表示
`
}

// Article image generation prompt
export function generateArticleImagePrompt(title: string, excerpt: string, theme?: string): string {
  return `请生成一张与美食文章相关的图片，文章标题是"${title}"，文章内容是"${excerpt}"，主题是"${theme}"。图片要求：高质量、真实感强、光线自然、色彩鲜艳、构图美观，适合作为文章封面图，图片内不要出现文字。`;
}

// System messages
export const SYSTEM_MESSAGES = {
  recipe: '你是一个专业的美食 recipe 生成器，你需要根据用户提供的食材、口味偏好、菜系、烹饪方式、难度等级、份量、烹饪时间、饮食限制和图片生成详细的食谱。',
  article: '你是一个专业的美食文章生成器，你需要根据用户提供的风格、主题和概要生成高质量的美食文章。',
};

export const NEGATIVE_PROMPT = 
'低分辨率，低画质，与食物无关，肢体畸形，手指畸形，画面过饱和，蜡像感，人脸无细节，过度光滑，画面具有AI感。构图混乱。存在文字。'