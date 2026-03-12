import apiClient from '@/app/request/apiClient';

/**
 * 获取推荐菜谱
 */
export async function fetchFeaturedRecipes() {
  try {
    const response = await apiClient.get("/recipes");
    return response.data || response;
  } catch (error) {
    console.error("获取推荐菜谱失败:", error);
    // 返回mock数据以防止页面加载失败
    return getMockFeaturedRecipes();
  }
}

/**
 * 创建菜谱
 * @param {Object} recipeData - 菜谱数据
 * @returns {Promise<Object>} 创建的菜谱信息
 */
export const createRecipe = async (recipeData) => {
  try {
    const response = await apiClient.post('/recipes', recipeData);
    return response;
  } catch (error) {
    console.error('创建菜谱失败:', error);
    throw error;
  }
};

/**
 * 获取所有菜谱
 * @param {Object} [params] - 查询参数
 * @returns {Promise<Array>} 菜谱列表
 */
export const getAllRecipes = async (params = {}) => {
  try {
    const response = await apiClient.get('/recipes', params);
    return response.data || response;
  } catch (error) {
    console.error('获取菜谱列表失败:', error);
    throw error;
  }
};

/**
 * 获取单个菜谱
 * @param {number} recipeId - 菜谱ID
 * @returns {Promise<Object>} 菜谱详情
 */
export const getRecipeById = async (recipeId) => {
  try {
    const response = await apiClient.get(`/recipes/${recipeId}`);
    return response;
  } catch (error) {
    console.error(`获取菜谱 ${recipeId} 详情失败:`, error);
    throw error;
  }
};

/**
 * 更新菜谱
 * @param {number} recipeId - 菜谱ID
 * @param {Object} recipeData - 更新的菜谱数据
 * @returns {Promise<Object>} 更新后的菜谱详情
 */
export const updateRecipe = async (recipeId, recipeData) => {
  try {
    const response = await apiClient.put(`/recipes/${recipeId}`, recipeData);
    return response;
  } catch (error) {
    console.error(`更新菜谱 ${recipeId} 失败:`, error);
    throw error;
  }
};

/**
 * 删除菜谱
 * @param {number} recipeId - 菜谱ID
 * @returns {Promise<Object>} 删除的菜谱详情
 */
export const deleteRecipe = async (recipeId) => {
  try {
    const response = await apiClient.delete(`/recipes/${recipeId}`);
    return response;
  } catch (error) {
    console.error(`删除菜谱 ${recipeId} 失败:`, error);
    throw error;
  }
};

/**
 * 点赞菜谱
 * @param {number} recipeId - 菜谱ID
 * @param {number} userId - 用户ID
 * @returns {Promise<Object>} 点赞记录
 */
export const likeRecipe = async (recipeId, userId) => {
  try {
    const response = await apiClient.post(`/recipes/${recipeId}/like`, { userId });
    return response;
  } catch (error) {
    console.error(`点赞菜谱 ${recipeId} 失败:`, error);
    throw error;
  }
};

/**
 * 取消点赞菜谱
 * @param {number} recipeId - 菜谱ID
 * @param {number} userId - 用户ID
 * @returns {Promise<Object>} 点赞记录
 */
export const unlikeRecipe = async (recipeId, userId) => {
  try {
    const response = await apiClient.delete(`/recipes/${recipeId}/like`, { userId });
    return response;
  } catch (error) {
    console.error(`取消点赞菜谱 ${recipeId} 失败:`, error);
    throw error;
  }
};

/**
 * 评论菜谱
 * @param {number} recipeId - 菜谱ID
 * @param {Object} commentData - 评论数据
 * @returns {Promise<Object>} 评论记录
 */
export const commentRecipe = async (recipeId, commentData) => {
  try {
    const response = await apiClient.post(`/recipes/${recipeId}/comment`, commentData);
    return response;
  } catch (error) {
    console.error(`评论菜谱 ${recipeId} 失败:`, error);
    throw error;
  }
};

/**
 * 获取热门菜谱
 * @param {number} [limit=5] - 返回数量
 * @returns {Promise<Array>} 热门菜谱列表
 */
export const getPopularRecipes = async (limit = 5) => {
  try {
    const response = await apiClient.get('/recipes', { limit, sort: 'popular' });
    return response.data || response;
  } catch (error) {
    console.error('获取热门菜谱失败:', error);
    throw error;
  }
};

/**
 * 获取用户创建的菜谱
 * @param {number} userId - 用户ID
 * @param {Object} [params] - 查询参数
 * @returns {Promise<Array>} 用户菜谱列表
 */
export const getUserRecipes = async (userId, params = {}) => {
  try {
    const response = await apiClient.get('/recipes', { ...params, userId });
    return response.data || response;
  } catch (error) {
    console.error(`获取用户 ${userId} 的菜谱失败:`, error);
    throw error;
  }
};

/**
 * 搜索菜谱
 * @param {string} keyword - 搜索关键词
 * @param {Object} [params] - 查询参数
 * @returns {Promise<Array>} 搜索结果
 */
export const searchRecipes = async (keyword, params = {}) => {
  try {
    const response = await apiClient.get('/recipes/search', { ...params, keyword });
    return response.data || response;
  } catch (error) {
    console.error(`搜索菜谱失败:`, error);
    throw error;
  }
};

/**
 * 根据标签获取菜谱
 * @param {string} tag - 标签名称
 * @param {Object} [params] - 查询参数
 * @returns {Promise<Array>} 菜谱列表
 */
export const getRecipesByTag = async (tag, params = {}) => {
  try {
    const response = await apiClient.get(`/recipes/tag/${tag}`, params);
    return response.data || response;
  } catch (error) {
    console.error(`根据标签 ${tag} 获取菜谱失败:`, error);
    throw error;
  }
};

/**
 * 获取推荐菜谱的mock数据
 */
function getMockFeaturedRecipes() {
  return [
    {
      id: 1,
      title: "香浓番茄意大利面",
      description: "简单易做的经典意大利面，酸甜可口",
      imageUrl: "/pasta.jpg",
      prepTime: "20分钟",
      cookTime: "15分钟",
      difficulty: "简单",
      tags: ["意大利菜", "快手", "素食"],
    },
    {
      id: 2,
      title: "泰式青咖喱鸡",
      description: "香辣浓郁的泰式经典，搭配香米饭",
      imageUrl: "/curry.jpg",
      prepTime: "25分钟",
      cookTime: "30分钟",
      difficulty: "中等",
      tags: ["泰国菜", "咖喱", "鸡肉"],
    },
    {
      id: 3,
      title: "法式洋葱汤",
      description: "温暖醇厚的经典法国汤品",
      imageUrl: "/onion-soup.jpg",
      prepTime: "15分钟",
      cookTime: "50分钟",
      difficulty: "中等",
      tags: ["法国菜", "汤品", "冬季"],
    },
    {
      id: 4,
      title: "日式拉面",
      description: "浓郁汤底，手工面条，正宗日式风味",
      imageUrl: "/ramen.jpg",
      prepTime: "30分钟",
      cookTime: "4小时",
      difficulty: "复杂",
      tags: ["日本菜", "面食", "高汤"],
    },
  ];
}
