import apiClient from '@/app/request/apiClient';

// 添加开发环境检测标志
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const FORCE_MOCK_DATA = process.env.NEXT_PUBLIC_FORCE_MOCK_DATA === 'true';

/**
 * 获取用户资料
 */
export async function getUserProfile(userId) {
  try {
    // 在开发环境中或强制使用mock数据时，直接返回mock数据
    // if (IS_DEVELOPMENT || FORCE_MOCK_DATA) {
    //   return getMockUserProfile();
    // }
    
    if (!userId) {
      // 如果没有传入userId，尝试从localStorage获取当前用户ID
      userId = localStorage.getItem('userId');
      if (!userId) {
        // 返回null表示用户未登录，而不是抛出错误
        return null;
      }
    }
    
    return await apiClient.get(`/users/${userId}`);
  } catch (error) {
    console.error('获取用户资料失败:', error);
    // 其他错误返回mock数据以防止页面加载失败
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
    console.error('创建用户失败:', error);
    throw error;
  }
};

// 导出 createUser 作为 register 的别名，以兼容 admin 页面的导入
export const createUser = register;

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
 * 上传用户头像
 * @param {number} userId - 用户ID
 * @param {File} file - 头像文件
 * @returns {Promise<Object>} 上传结果，包含头像URL
 */
export const uploadUserAvatar = async (userId, file) => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await apiClient.upload(`/users/${userId}/avatar`, formData);
    return response;
  } catch (error) {
    console.error(`上传用户 ${userId} 头像失败:`, error);
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
 * 获取用户文章列表
 * @param {number} userId - 用户ID
 * @param {Object} [params] - 查询参数
 * @returns {Promise<Array>} 用户文章列表
 */
export const getUserArticles = async (userId, params = {}) => {
  try {
    // if (IS_DEVELOPMENT || FORCE_MOCK_DATA) {
    //   return getMockUserArticles();
    // }
    const response = await apiClient.get(`/articles/user/${userId}`, params);
    return response;
  } catch (error) {
    console.error(`获取用户 ${userId} 的文章列表失败:`, error);
    // return getMockUserArticles();
  }
};

/**
 * 获取用户食谱列表
 * @param {number} userId - 用户ID
 * @param {Object} [params] - 查询参数
 * @returns {Promise<Array>} 用户食谱列表
 */
export const getUserRecipes = async (userId, params = {}) => {
  try {
    // if (IS_DEVELOPMENT || FORCE_MOCK_DATA) {
    //   return getMockUserRecipes();
    // }
    const response = await apiClient.get(`/recipes/user/${userId}`, params);
    return response;
  } catch (error) {
    console.error(`获取用户 ${userId} 的食谱列表失败:`, error);
    // return getMockUserRecipes();
  }
};

/**
 * 获取用户文章的mock数据
 */
function getMockUserArticles() {
  return [
    {
      id: 1,
      title: '10道简单又美味的家常菜做法，让你爱上厨房',
      content: '在家也能做出餐厅级别的美味佳肴，这些家常菜做法简单易学，食材常见，让你的餐桌更加丰富多彩。',
      coverImage: 'https://picsum.photos/seed/article1/400/200',
      viewCount: 234,
      commentCount: 12,
      shareCount: 56,
      createdAt: '2024-05-15T08:00:00Z'
    },
    {
      id: 2,
      title: '夏日清爽沙拉的10种创意做法',
      content: '炎炎夏日，来一份清爽的沙拉再好不过了。这里有10种创意沙拉做法，让你的味蕾焕然一新。',
      coverImage: 'https://picsum.photos/seed/article2/400/200',
      viewCount: 189,
      commentCount: 8,
      shareCount: 34,
      createdAt: '2024-05-10T10:00:00Z'
    },
    {
      id: 3,
      title: '如何挑选新鲜食材，让你的料理更美味',
      content: '食材的新鲜度直接影响料理的口感和营养，学会挑选新鲜食材是每个烹饪爱好者的必备技能。',
      coverImage: 'https://picsum.photos/seed/article3/400/200',
      viewCount: 156,
      commentCount: 15,
      shareCount: 42,
      createdAt: '2024-05-05T14:00:00Z'
    }
  ];
}

/**
 * 获取用户食谱的mock数据
 */
function getMockUserRecipes() {
  return [
    {
      id: 1,
      title: '家常红烧肉的完美做法',
      description: '肥而不腻，入口即化的红烧肉，传统做法的完美呈现，让你在家也能做出饭店级别的美味。',
      coverImage: 'https://picsum.photos/seed/recipe1/400/200',
      cookTime: 30,
      difficulty: '中等难度',
      rating: 4.8,
      createdAt: '2024-05-20T09:00:00Z'
    },
    {
      id: 2,
      title: '清爽开胃的凉拌黄瓜',
      description: '夏日必备的凉拌黄瓜，做法简单，口感清爽，是夏季餐桌上的一道亮丽风景线。',
      coverImage: 'https://picsum.photos/seed/recipe2/400/200',
      cookTime: 10,
      difficulty: '简单',
      rating: 4.5,
      createdAt: '2024-05-18T11:00:00Z'
    },
    {
      id: 3,
      title: '营养丰富的番茄鸡蛋面',
      description: '经典的番茄鸡蛋面，营养丰富，口感鲜美，是家庭餐桌上的常客。',
      coverImage: 'https://picsum.photos/seed/recipe3/400/200',
      cookTime: 15,
      difficulty: '简单',
      rating: 4.6,
      createdAt: '2024-05-15T12:00:00Z'
    }
  ];
}

/**
 * 获取用户资料的mock数据
 */
function getMockUserProfile() {
  return {
    id: 1,
    username: '小厨',
    email: 'user@example.com',
    avatar: '/default-avatar.png',
    bio: '热爱美食，喜欢分享烹饪经验',
    location: '北京',
    preferences: {
      favoriteCuisines: ['川菜', '粤菜'],
      dietaryRestrictions: [],
      mealTypes: ['早餐', '午餐', '晚餐']
    },
    createdAt: new Date().toISOString()
  };
}

/**
 * 获取用户留言列表
 * @param {number} userId - 用户ID
 * @returns {Promise<Array>} 用户留言列表
 */
export const getUserComments = async (userId) => {
  try {
    const response = await apiClient.get(`/user-content/${userId}/comments`);
    return response.data;
  } catch (error) {
    console.error(`获取用户 ${userId} 的留言列表失败:`, error);
    throw error;
  }
};

/**
 * 创建用户留言
 * @param {number} targetUserId - 被留言者ID
 * @param {string} content - 留言内容
 * @param {number} [parentId] - 父留言ID（用于回复）
 * @returns {Promise<Object>} 创建的留言信息
 */
export const createUserComment = async (targetUserId, content, parentId) => {
  try {
    const response = await apiClient.post(`/user-content/${targetUserId}/comments`, { content, parentId });
    return response.data;
  } catch (error) {
    console.error(`创建用户留言失败:`, error);
    throw error;
  }
};

/**
 * 删除用户留言
 * @param {number} commentId - 留言ID
 * @returns {Promise<Object>} 删除结果
 */
export const deleteUserComment = async (commentId) => {
  try {
    const response = await apiClient.delete(`/user-content/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error(`删除用户留言失败:`, error);
    throw error;
  }
};

/**
 * 点赞用户
 * @param {number} targetUserId - 被点赞者ID
 * @returns {Promise<Object>} 点赞结果
 */
export const likeUser = async (targetUserId) => {
  try {
    const response = await apiClient.post(`/user-content/${targetUserId}/like`);
    return response;
  } catch (error) {
    console.error(`点赞用户失败:`, error);
    throw error;
  }
};

/**
 * 取消点赞用户
 * @param {number} targetUserId - 被点赞者ID
 * @returns {Promise<Object>} 取消点赞结果
 */
export const unlikeUser = async (targetUserId) => {
  try {
    const response = await apiClient.post(`/user-content/${targetUserId}/unlike`);
    return response;
  } catch (error) {
    console.error(`取消点赞用户失败:`, error);
    throw error;
  }
};