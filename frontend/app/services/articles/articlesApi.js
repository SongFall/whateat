import apiClient from '@/app/request/apiClient';

// 添加开发环境检测标志
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const FORCE_MOCK_DATA = process.env.NEXT_PUBLIC_FORCE_MOCK_DATA === 'true';

/**
 * 获取热门美食文章
 */
export async function fetchPopularArticles() {
  try {
    // 在开发环境中或强制使用mock数据时，直接返回mock数据
    // if (IS_DEVELOPMENT || FORCE_MOCK_DATA) {
    //   return getMockPopularArticles();
    // }
    return await apiClient.get('/articles/popular');
  } catch (error) {
    console.error('获取热门文章失败:', error);
    // 返回mock数据以防止页面加载失败
    return getMockPopularArticles();
  }
}

/**
 * 创建文章
 * @param {Object} articleData - 文章数据
 * @returns {Promise<Object>} 创建的文章信息
 */
export const createArticle = async (articleData) => {
  try {
    const response = await apiClient.post('/articles', articleData);
    return response;
  } catch (error) {
    console.error('创建文章失败:', error);
    throw error;
  }
};

/**
 * 获取所有文章
 * @param {Object} [params] - 查询参数
 * @returns {Promise<Array>} 文章列表
 */
export const getAllArticles = async (params = {}) => {
  try {
    const response = await apiClient.get('/articles', params);
    // 处理后端返回的新数据结构
    return response;
  } catch (error) {
    console.error('获取文章列表失败:', error);
    throw error;
  }
};

/**
 * 获取单个文章
 * @param {number} articleId - 文章ID
 * @returns {Promise<Object>} 文章详情
 */
export const getArticleById = async (articleId) => {
  try {
    const response = await apiClient.get(`/articles/${articleId}`);
    return response;
  } catch (error) {
    console.error(`获取文章 ${articleId} 详情失败:`, error);
    throw error;
  }
};

/**
 * 更新文章
 * @param {number} articleId - 文章ID
 * @param {Object} articleData - 更新的文章数据
 * @returns {Promise<Object>} 更新后的文章详情
 */
export const updateArticle = async (articleId, articleData) => {
  try {
    const response = await apiClient.put(`/articles/${articleId}`, articleData);
    return response;
  } catch (error) {
    console.error(`更新文章 ${articleId} 失败:`, error);
    throw error;
  }
};

/**
 * 删除文章
 * @param {number} articleId - 文章ID
 * @returns {Promise<Object>} 删除的文章详情
 */
export const deleteArticle = async (articleId) => {
  try {
    const response = await apiClient.delete(`/articles/${articleId}`);
    return response;
  } catch (error) {
    console.error(`删除文章 ${articleId} 失败:`, error);
    throw error;
  }
};

/**
 * 点赞文章
 * @param {number} articleId - 文章ID
 * @param {number} userId - 用户ID
 * @returns {Promise<Object>} 点赞记录
 */
export const likeArticle = async (articleId, userId) => {
  try {
    const response = await apiClient.post(`/articles/${articleId}/like`, { userId });
    return response;
  } catch (error) {
    console.error(`点赞文章 ${articleId} 失败:`, error);
    throw error;
  }
};

/**
 * 取消点赞文章
 * @param {number} articleId - 文章ID
 * @param {number} userId - 用户ID
 * @returns {Promise<Object>} 点赞记录
 */
export const unlikeArticle = async (articleId, userId) => {
  try {
    const response = await apiClient.delete(`/articles/${articleId}/like`, { userId });
    return response;
  } catch (error) {
    console.error(`取消点赞文章 ${articleId} 失败:`, error);
    throw error;
  }
};

/**
 * 评论文章
 * @param {number} articleId - 文章ID
 * @param {Object} commentData - 评论数据
 * @returns {Promise<Object>} 评论记录
 */
export const commentArticle = async (articleId, commentData) => {
  try {
    const response = await apiClient.post(`/articles/${articleId}/comment`, commentData);
    return response;
  } catch (error) {
    console.error(`评论文章 ${articleId} 失败:`, error);
    throw error;
  }
};

/**
 * 收藏文章
 * @param {number} articleId - 文章ID
 * @param {number} userId - 用户ID
 * @returns {Promise<Object>} 收藏记录
 */
export const collectArticle = async (articleId, userId) => {
  try {
    const response = await apiClient.post(`/articles/${articleId}/collect`, { userId });
    return response;
  } catch (error) {
    console.error(`收藏文章 ${articleId} 失败:`, error);
    throw error;
  }
};

/**
 * 取消收藏文章
 * @param {number} articleId - 文章ID
 * @param {number} userId - 用户ID
 * @returns {Promise<Object>} 收藏记录
 */
export const uncollectArticle = async (articleId, userId) => {
  try {
    const response = await apiClient.delete(`/articles/${articleId}/collect`, { userId });
    return response;
  } catch (error) {
    console.error(`取消收藏文章 ${articleId} 失败:`, error);
    throw error;
  }
};

/**
 * 获取热门文章
 * @param {number} [limit=5] - 返回数量
 * @returns {Promise<Array>} 热门文章列表
 */
export const getPopularArticles = async (limit = 5) => {
  try {
    // 假设后端支持通过参数获取热门文章
    const response = await apiClient.get('/articles', { limit, sort: 'popular' });
    return response;
  } catch (error) {
    console.error('获取热门文章失败:', error);
    throw error;
  }
};

/**
 * 获取用户创建的文章
 * @param {number} userId - 用户ID
 * @param {Object} [params] - 查询参数
 * @returns {Promise<Array>} 用户文章列表
 */
export const getUserArticles = async (userId, params = {}) => {
  try {
    // 假设后端支持通过userId筛选文章
    const response = await apiClient.get('/articles', { ...params, userId });
    return response;
  } catch (error) {
    console.error(`获取用户 ${userId} 的文章失败:`, error);
    throw error;
  }
};

/**
 * 获取热门文章的mock数据
 */
function getMockPopularArticles() {
  return [
    {
      id: 1,
      title: '厨房新手必学的10个技巧',
      excerpt: '掌握这些基础技巧，让你的烹饪之路更加顺畅',
      coverImage: '/cooking-tips.jpg',
      author: '美食达人',
      publishDate: '2023-11-15',
      readTime: '5分钟',
    },
    {
      id: 2,
      title: '全球十大美食城市探秘',
      excerpt: '跟随我们的脚步，探索世界各地的美食文化',
      coverImage: '/food-cities.jpg',
      author: '环球旅行者',
      publishDate: '2023-11-10',
      readTime: '8分钟',
    },
    {
      id: 3,
      title: '健康饮食指南：如何平衡营养摄入',
      excerpt: '科学饮食，吃出健康好身体',
      coverImage: '/healthy-eating.jpg',
      author: '营养师小李',
      publishDate: '2023-11-05',
      readTime: '6分钟',
    },
  ];
}