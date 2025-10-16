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
    if (IS_DEVELOPMENT || FORCE_MOCK_DATA) {
      return getMockPopularArticles();
    }
    return await apiClient.get('/articles/popular');
  } catch (error) {
    console.error('获取热门文章失败:', error);
    // 返回mock数据以防止页面加载失败
    return getMockPopularArticles();
  }
}

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