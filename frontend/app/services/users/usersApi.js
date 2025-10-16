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
    return await apiClient.get('/user/profile');
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
 * 获取用户资料的mock数据
 */
function getMockUserProfile() {
  return {
    name: '访客用户',
    avatar: '/default-avatar.png',
    preferences: [],
  };
}