import { client } from "@/lib/Clientapi";

// 添加开发环境检测标志
const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
const FORCE_MOCK_DATA = process.env.NEXT_PUBLIC_FORCE_MOCK_DATA === "true";

/**
 * 获取推荐菜谱
 */
export async function fetchFeaturedRecipes() {
  try {
    // 在开发环境中或强制使用mock数据时，直接返回mock数据
    if (IS_DEVELOPMENT || FORCE_MOCK_DATA) {
      return getMockFeaturedRecipes();
    }
    return await client.get("/recipes/featured");
  } catch (error) {
    console.error("获取推荐菜谱失败:", error);
    // 返回mock数据以防止页面加载失败
    return getMockFeaturedRecipes();
  }
}

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
