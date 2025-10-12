// API服务文件，包含前端与后端交互的所有API调用

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
// 添加开发环境检测标志
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const FORCE_MOCK_DATA = process.env.NEXT_PUBLIC_FORCE_MOCK_DATA === 'true';

/**
 * 通用fetch函数封装
 */
async function fetchAPI(endpoint, options = {}) {
  // 在开发环境中或强制使用mock数据时，直接返回mock数据
  if (IS_DEVELOPMENT || FORCE_MOCK_DATA) {
    return getMockData(endpoint);
  }
  
  // 确保URL包含/api前缀
  const url = `${API_BASE_URL}/api${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`请求${endpoint}时发生错误:`, error);
    // 返回mock数据以防止页面加载失败
    return getMockData(endpoint);
  }
}

/**
 * 获取推荐菜谱
 */
export async function fetchFeaturedRecipes() {
  try {
    return await fetchAPI("/recipes/featured");
  } catch (error) {
    // 提供mock数据
    return [
      {
        id: 1,
        title: "香浓番茄意大利面",
        description: "简单易做的经典意大利面，酸甜可口",
        // imageUrl: "/pasta.jpg",
        prepTime: "20分钟",
        cookTime: "15分钟",
        difficulty: "简单",
        tags: ["意大利菜", "快手", "素食"],
      },
      {
        id: 2,
        title: "泰式青咖喱鸡",
        description: "香辣浓郁的泰式经典，搭配香米饭",
        // imageUrl: "/curry.jpg",
        prepTime: "25分钟",
        cookTime: "30分钟",
        difficulty: "中等",
        tags: ["泰国菜", "咖喱", "鸡肉"],
      },
      {
        id: 3,
        title: "法式洋葱汤",
        description: "温暖醇厚的经典法国汤品",
        // imageUrl: "/onion-soup.jpg",
        prepTime: "15分钟",
        cookTime: "50分钟",
        difficulty: "中等",
        tags: ["法国菜", "汤品", "冬季"],
      },
      {
        id: 4,
        title: "日式拉面",
        description: "浓郁汤底，手工面条，正宗日式风味",
        // imageUrl: "/ramen.jpg",
        prepTime: "30分钟",
        cookTime: "4小时",
        difficulty: "复杂",
        tags: ["日本菜", "面食", "高汤"],
      },
    ];
  }
}

/**
 * 获取热门美食文章
 */
export async function fetchPopularArticles() {
  try {
    return await fetchAPI("/articles/popular");
  } catch (error) {
    // 提供mock数据
    return [
      {
        id: 1,
        title: "厨房新手必学的10个技巧",
        excerpt: "掌握这些基础技巧，让你的烹饪之路更加顺畅",
        // coverImage: "/cooking-tips.jpg",
        author: "美食达人",
        publishDate: "2023-11-15",
        readTime: "5分钟",
      },
      {
        id: 2,
        title: "全球十大美食城市探秘",
        excerpt: "跟随我们的脚步，探索世界各地的美食文化",
        // coverImage: "/food-cities.jpg",
        author: "环球旅行者",
        publishDate: "2023-11-10",
        readTime: "8分钟",
      },
      {
        id: 3,
        title: "健康饮食指南：如何平衡营养摄入",
        excerpt: "科学饮食，吃出健康好身体",
        // coverImage: "/healthy-eating.jpg",
        author: "营养师小李",
        publishDate: "2023-11-05",
        readTime: "6分钟",
      },
    ];
  }
}

/**
 * 生成AI菜谱
 */
export async function generateRecipe(prompt, options = {}) {
  try {
    return await fetchAPI("/ai/generate-recipe", {
      method: "POST",
      body: JSON.stringify({ prompt, options }),
    });
  } catch (error) {
    console.error("生成菜谱失败:", error);
    return {
      title: "AI生成菜谱示例",
      ingredients: ["示例食材1", "示例食材2", "示例食材3"],
      instructions: ["步骤1: 准备食材", "步骤2: 烹饪处理", "步骤3: 调味上桌"],
      tips: ["这是示例提示", "仅供参考"],
    };
  }
}

/**
 * 获取mock数据的辅助函数
 */
function getMockData(endpoint) {
  // 根据不同的endpoint返回不同的mock数据
  if (endpoint.includes("/recipes/featured")) {
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
  } else if (endpoint.includes("/articles/popular")) {
    return [
      {
        id: 1,
        title: "厨房新手必学的10个技巧",
        excerpt: "掌握这些基础技巧，让你的烹饪之路更加顺畅",
        coverImage: "/cooking-tips.jpg",
        author: "美食达人",
        publishDate: "2023-11-15",
        readTime: "5分钟",
      },
      {
        id: 2,
        title: "全球十大美食城市探秘",
        excerpt: "跟随我们的脚步，探索世界各地的美食文化",
        coverImage: "/food-cities.jpg",
        author: "环球旅行者",
        publishDate: "2023-11-10",
        readTime: "8分钟",
      },
      {
        id: 3,
        title: "健康饮食指南：如何平衡营养摄入",
        excerpt: "科学饮食，吃出健康好身体",
        coverImage: "/healthy-eating.jpg",
        author: "营养师小李",
        publishDate: "2023-11-05",
        readTime: "6分钟",
      },
    ];
  } else if (endpoint.includes("/user/profile")) {
    return {
      name: "访客用户",
      avatar: "/default-avatar.png",
      preferences: [],
    };
  } else if (endpoint.includes("/ai/generate-recipe")) {
    return {
      title: "AI生成菜谱示例",
      ingredients: ["示例食材1", "示例食材2", "示例食材3"],
      instructions: ["步骤1: 准备食材", "步骤2: 烹饪处理", "步骤3: 调味上桌"],
      tips: ["这是示例提示", "仅供参考"],
    };
  }
  return [];
}

/**
 * 用户相关API
 */
export async function getUserProfile() {
  // 在开发环境中直接返回mock数据
  if (IS_DEVELOPMENT || FORCE_MOCK_DATA) {
    return {
      name: "访客用户",
      avatar: "/default-avatar.png",
      preferences: [],
    };
  }
  
  try {
    return await fetchAPI("/user/profile");
  } catch (error) {
    console.error("获取用户资料失败:", error);
    return {
      name: "访客用户",
      avatar: "/default-avatar.png",
      preferences: [],
    };
  }
}

export async function saveUserPreferences(preferences) {
  try {
    return await fetchAPI("/user/preferences", {
      method: "POST",
      body: JSON.stringify({ preferences }),
    });
  } catch (error) {
    console.error("保存偏好设置失败:", error);
    return { success: false };
  }
}
