import apiClient from '@/app/request/apiClient';

// 添加开发环境检测标志
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const FORCE_MOCK_DATA = process.env.NEXT_PUBLIC_FORCE_MOCK_DATA === 'true';

/**
 * 获取用户资料
 */
export async function getUserProfile() {
  try {
    // 在开发环境中或强制使用mock数据时，直接返回mock数据
    if (IS_DEVELOPMENT || FORCE_MOCK_DATA) {
      return getMockUserProfile();
    }
    
    // 获取当前用户ID
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('用户未登录');
    }
    
    return await apiClient.get(`/users/${userId}`);
  } catch (error) {
    console.error('获取用户资料失败:', error);
    // 返回mock数据以防止页面加载失败
    return getMockUserProfile();
  }
}

/**
 * 保存用户偏好设置
 */
export async function saveUserPreferences(preferences) {
  try {
    return await apiClient.post('/user/preferences', { preferences });
  } catch (error) {
    console.error('保存偏好设置失败:', error);
    return { success: false };
  }
}

/**
 * 创建用户
 * @param {Object} userData - 用户数据
 * @returns {Promise<Object>} 创建的用户信息
 */
export const register = async (userData) => {
  try {    
    const response = await apiClient.post('/users', userData);
    return response;
  } catch (error) {
    console.error('创建用户失败:', error);
    throw error;
  }
};

/**
 * 获取所有用户
 * @returns {Promise<Array>} 用户列表
 */
export const getAllUsers = async () => {
  try {
    const response = await apiClient.get('/users');
    return response;
  } catch (error) {
    console.error('获取用户列表失败:', error);
    throw error;
  }
};

/**
 * 获取单个用户信息
 * @param {number} userId - 用户ID
 * @returns {Promise<Object>} 用户信息
 */
export const getUserById = async (userId) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response;
  } catch (error) {
    console.error(`获取用户 ${userId} 信息失败:`, error);
    throw error;
  }
};

/**
 * 更新用户信息
 * @param {number} userId - 用户ID
 * @param {Object} userData - 更新的用户数据
 * @returns {Promise<Object>} 更新后的用户信息
 */
export const updateUser = async (userId, userData) => {
  try {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response;
  } catch (error) {
    console.error(`更新用户 ${userId} 信息失败:`, error);
    throw error;
  }
};

/**
 * 删除用户
 * @param {number} userId - 用户ID
 * @returns {Promise<Object>} 删除的用户信息
 */
export const deleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/users/${userId}`);
    return response;
  } catch (error) {
    console.error(`删除用户 ${userId} 失败:`, error);
    throw error;
  }
};

/**
 * 登录功能
 * @param {Object} loginData - 登录数据
 * @returns {Promise<Object>} 登录结果，包含token和用户信息
 */
export const login = async (loginData) => {
  try {
    const response = await apiClient.post('/users/login', loginData);
    
    // 保存token和用户信息到localStorage
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    if (response.user?.id) {
      localStorage.setItem('userId', response.user.id);
      localStorage.setItem('userInfo', JSON.stringify(response.user));
    }
    
    return response;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
};

/**
 * 登出功能
 */
export const logout = () => {
  // 清除localStorage中的token和用户信息
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('userInfo');
};

/**
 * 检查是否已登录
 * @returns {boolean} 是否已登录
 */
export const isLoggedIn = () => {
  return !!localStorage.getItem('token');
};

/**
 * 获取当前用户信息（从localStorage）
 * @returns {Object|null} 当前用户信息
 */
export const getCurrentUserFromStorage = () => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};

/**
 * 保存用户信息到localStorage
 * @param {Object} userInfo - 用户信息
 */
export const saveUserInfoToStorage = (userInfo) => {
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
};

/**
 * 关注用户
 * @param {number} followerId - 关注者ID
 * @param {number} followingId - 被关注者ID
 * @returns {Promise<Object>} 关注记录
 */
export const followUser = async (followerId, followingId) => {
  try {
    const response = await apiClient.post('/follows', { followerId, followingId });
    return response;
  } catch (error) {
    console.error(`关注用户失败:`, error);
    throw error;
  }
};

/**
 * 取消关注用户
 * @param {number} followerId - 关注者ID
 * @param {number} followingId - 被关注者ID
 * @returns {Promise<Object>} 关注记录
 */
export const unfollowUser = async (followerId, followingId) => {
  try {
    const response = await apiClient.delete('/follows', { followerId, followingId });
    return response;
  } catch (error) {
    console.error(`取消关注用户失败:`, error);
    throw error;
  }
};

/**
 * 获取用户关注列表
 * @param {number} userId - 用户ID
 * @returns {Promise<Array>} 关注用户列表
 */
export const getFollowingList = async (userId) => {
  try {
    const response = await apiClient.get(`/follows/followings/${userId}`);
    return response;
  } catch (error) {
    console.error(`获取用户 ${userId} 的关注列表失败:`, error);
    throw error;
  }
};

/**
 * 获取用户粉丝列表
 * @param {number} userId - 用户ID
 * @returns {Promise<Array>} 粉丝用户列表
 */
export const getFollowersList = async (userId) => {
  try {
    const response = await apiClient.get(`/follows/followers/${userId}`);
    return response;
  } catch (error) {
    console.error(`获取用户 ${userId} 的粉丝列表失败:`, error);
    throw error;
  }
};

/**
 * 检查是否已关注
 * @param {number} followerId - 关注者ID
 * @param {number} followingId - 被关注者ID
 * @returns {Promise<Object>} 关注状态 { isFollowing: boolean }
 */
export const checkFollowingStatus = async (followerId, followingId) => {
  try {
    const response = await apiClient.get('/follows/check', { followerId, followingId });
    return response;
  } catch (error) {
    console.error(`检查关注状态失败:`, error);
    return { isFollowing: false };
  }
};

/**
 * 获取用户关注数量
 * @param {number} userId - 用户ID
 * @returns {Promise<number>} 关注数量
 */
export const getFollowingCount = async (userId) => {
  try {
    const followings = await getFollowingList(userId);
    return followings.length;
  } catch (error) {
    console.error(`获取用户 ${userId} 的关注数量失败:`, error);
    return 0;
  }
};

/**
 * 获取用户粉丝数量
 * @param {number} userId - 用户ID
 * @returns {Promise<number>} 粉丝数量
 */
export const getFollowersCount = async (userId) => {
  try {
    const followers = await getFollowersList(userId);
    return followers.length;
  } catch (error) {
    console.error(`获取用户 ${userId} 的粉丝数量失败:`, error);
    return 0;
  }
};

/**
 * 获取用户收藏
 * @param {number} userId - 用户ID
 * @param {Object} [params] - 查询参数
 * @returns {Promise<Array>} 用户收藏列表
 */
export const getUserCollections = async (userId, params = {}) => {
  try {
    const response = await apiClient.get(`/collections/user/${userId}`, params);
    return response;
  } catch (error) {
    console.error(`获取用户 ${userId} 的收藏列表失败:`, error);
    throw error;
  }
};

/**
 * 收藏菜谱
 * @param {number} userId - 用户ID
 * @param {number} recipeId - 菜谱ID
 * @returns {Promise<Object>} 收藏记录
 */
export const collectRecipe = async (userId, recipeId) => {
  try {
    const response = await apiClient.post('/collections/recipe', { userId, recipeId });
    return response;
  } catch (error) {
    console.error(`收藏菜谱 ${recipeId} 失败:`, error);
    throw error;
  }
};

/**
 * 收藏文章
 * @param {number} userId - 用户ID
 * @param {number} articleId - 文章ID
 * @returns {Promise<Object>} 收藏记录
 */
export const collectArticle = async (userId, articleId) => {
  try {
    const response = await apiClient.post('/collections/article', { userId, articleId });
    return response;
  } catch (error) {
    console.error(`收藏文章 ${articleId} 失败:`, error);
    throw error;
  }
};

/**
 * 取消收藏菜谱
 * @param {number} userId - 用户ID
 * @param {number} recipeId - 菜谱ID
 * @returns {Promise<Object>} 收藏记录
 */
export const uncollectRecipe = async (userId, recipeId) => {
  try {
    const response = await apiClient.delete('/collections/recipe', { userId, recipeId });
    return response;
  } catch (error) {
    console.error(`取消收藏菜谱 ${recipeId} 失败:`, error);
    throw error;
  }
};

/**
 * 取消收藏文章
 * @param {number} userId - 用户ID
 * @param {number} articleId - 文章ID
 * @returns {Promise<Object>} 收藏记录
 */
export const uncollectArticle = async (userId, articleId) => {
  try {
    const response = await apiClient.delete('/collections/article', { userId, articleId });
    return response;
  } catch (error) {
    console.error(`取消收藏文章 ${articleId} 失败:`, error);
    throw error;
  }
};

/**
 * 检查是否已收藏菜谱
 * @param {number} userId - 用户ID
 * @param {number} recipeId - 菜谱ID
 * @returns {Promise<boolean>} 是否已收藏
 */
export const isRecipeCollected = async (userId, recipeId) => {
  try {
    const collections = await getUserCollections(userId, { type: 'recipe' });
    return collections.some(collection => collection.recipeId === recipeId);
  } catch (error) {
    console.error(`检查菜谱 ${recipeId} 收藏状态失败:`, error);
    return false;
  }
};

/**
 * 检查是否已收藏文章
 * @param {number} userId - 用户ID
 * @param {number} articleId - 文章ID
 * @returns {Promise<boolean>} 是否已收藏
 */
export const isArticleCollected = async (userId, articleId) => {
  try {
    const collections = await getUserCollections(userId, { type: 'article' });
    return collections.some(collection => collection.articleId === articleId);
  } catch (error) {
    console.error(`检查文章 ${articleId} 收藏状态失败:`, error);
    return false;
  }
};

/**
 * 获取用户资料的mock数据
 */
function getMockUserProfile() {
  return {
    name: '访客用户',
    avatar: '/default-avatar.png',
    preferences: [],
  };
}