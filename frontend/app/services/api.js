// API服务统一入口文件
// 导入并重新导出各个模块的API函数

// 菜谱相关API
import { fetchFeaturedRecipes } from './recipes/recipesApi';

// 文章相关API
import { fetchPopularArticles } from './articles/articlesApi';

// 用户相关API
import { getUserProfile, saveUserPreferences } from './users/usersApi';

// AI相关API
import { generateRecipe } from './ai/aiApi';

// 上传相关API
import { getUploadToken, uploadToQiniu, uploadService } from './upload/upload';

// 导出所有API函数
export {
  // 菜谱API
  fetchFeaturedRecipes,
  
  // 文章API
  fetchPopularArticles,
  
  // 用户API
  getUserProfile,
  saveUserPreferences,
  
  // AI API
  generateRecipe,
  
  // 上传API
  getUploadToken,
  uploadToQiniu,
};

// 可选：导出各模块的API集合，便于按模块使用
export const recipesApi = {
  fetchFeaturedRecipes,
};

export const articlesApi = {
  fetchPopularArticles,
};

export const usersApi = {
  getUserProfile,
  saveUserPreferences,
};

export const aiApi = {
  generateRecipe,
};

// 上传API集合
export const uploadApi = {
  getUploadToken,
  uploadToQiniu,
};
