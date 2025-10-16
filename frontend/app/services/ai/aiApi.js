import apiClient from '@/app/request/apiClient';

// 添加开发环境检测标志
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const FORCE_MOCK_DATA = process.env.NEXT_PUBLIC_FORCE_MOCK_DATA === 'true';

/**
 * 生成AI菜谱
 */
export async function generateRecipe(prompt, options = {}) {
  try {
    // 在开发环境中或强制使用mock数据时，直接返回mock数据
    if (IS_DEVELOPMENT || FORCE_MOCK_DATA) {
      return getMockGeneratedRecipe();
    }
    return await apiClient.post('/ai/generate-recipe', { prompt, options });
  } catch (error) {
    console.error('生成菜谱失败:', error);
    // 返回mock数据以防止页面加载失败
    return getMockGeneratedRecipe();
  }
}

/**
 * 获取AI生成菜谱的mock数据
 */
function getMockGeneratedRecipe() {
  return {
    title: 'AI生成菜谱示例',
    ingredients: ['示例食材1', '示例食材2', '示例食材3'],
    instructions: ['步骤1: 准备食材', '步骤2: 烹饪处理', '步骤3: 调味上桌'],
    tips: ['这是示例提示', '仅供参考'],
  };
}