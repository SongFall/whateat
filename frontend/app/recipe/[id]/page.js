"use client";
import React, { useState, useEffect, use } from "react";
import { getRecipeById, getPopularRecipes } from "../../services/recipes/recipesApi";
import RecipeCard from "../../../components/recipe/RecipeCard";

const RecipeDetailPage = ({ params }) => {
  const { id } = use(params);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedRecipes, setRelatedRecipes] = useState([]);

  // 获取食谱详情
  useEffect(() => {
    const loadRecipeDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 尝试从API获取数据
        let recipeData;
        try {
          recipeData = await getRecipeById(id);
        } catch (err) {
          // 如果API失败，使用mock数据
          recipeData = getMockRecipeDetail(id);
        }
        
        setRecipe(recipeData);
        
        // 获取相关推荐菜谱
        try {
          const related = await getPopularRecipes(4);
          setRelatedRecipes(related);
        } catch (err) {
          // 如果API失败，使用mock数据
          setRelatedRecipes(getMockRelatedRecipes());
        }
      } catch (err) {
        console.error("加载食谱详情失败:", err);
        setError("加载食谱详情失败，请稍后重试");
      } finally {
        setLoading(false);
      }
    };

    loadRecipeDetail();
  }, [id]);

  // 加载状态显示
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mb-4"></div>
          <p className="text-gray-600 text-lg">正在加载食谱详情...</p>
        </div>
      </div>
    );
  }

  // 错误状态显示
  if (error || !recipe) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-red-500 text-5xl mb-6">⚠️</div>
          <p className="text-gray-600 text-lg mb-6">{error || "食谱不存在"}</p>
          <button
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:shadow-lg transition-all duration-300"
            onClick={() => window.location.href = "/recipe"}
          >
            返回食谱列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 顶部图片区域 */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={recipe.imageUrl || "https://neeko-copilot.bytedance.net/api/text2image?prompt=delicious%20food%20dish%20with%20appetizing%20presentation&size=1920x1080"}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{recipe.title}</h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-3xl mb-6">{recipe.description}</p>
            
            {/* 标签和操作按钮 */}
            <div className="flex flex-wrap items-center gap-4">
              {/* 标签 */}
              <div className="flex flex-wrap gap-2">
                {recipe.tags && recipe.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              
              {/* 操作按钮 */}
              <div className="flex gap-3 ml-auto">
                <button className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full font-medium hover:bg-white/30 transition-all duration-300">
                  ❤️ 收藏
                </button>
                <button className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full font-medium hover:bg-white/30 transition-all duration-300">
                  📤 分享
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* 食材和道具表格 */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">食材与准备</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 食材表格 */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">食材</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">材料</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">用量</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-800">{ingredient.name}</td>
                          <td className="py-3 px-4 text-gray-600">{ingredient.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 道具表格 */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">道具</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">工具</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">用途</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recipe.tools && recipe.tools.map((tool, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-800">{tool.name}</td>
                          <td className="py-3 px-4 text-gray-600">{tool.use}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 耗时信息 */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">耗时信息</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-amber-500 text-2xl mb-2">⏱️</div>
                  <div className="text-sm font-medium text-gray-500">准备时间</div>
                  <div className="text-lg font-semibold text-gray-900">{recipe.prepTime}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-orange-500 text-2xl mb-2">🍳</div>
                  <div className="text-sm font-medium text-gray-500">烹饪时间</div>
                  <div className="text-lg font-semibold text-gray-900">{recipe.cookTime}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-green-500 text-2xl mb-2">🥄</div>
                  <div className="text-sm font-medium text-gray-500">难度</div>
                  <div className="text-lg font-semibold text-gray-900">{recipe.difficulty}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 烹饪步骤时间轴 */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">烹饪步骤</h2>
            
            <div className="relative">
              {/* 时间轴 */}
              <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              {/* 步骤列表 */}
              <div className="space-y-12">
                {recipe.steps && recipe.steps.map((step, index) => (
                  <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    {/* 步骤内容 */}
                    <div className={`w-5/12 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                      <div className="bg-gray-50 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <h3 className="text-lg font-semibold mb-3 text-gray-900">步骤 {index + 1}: {step.title}</h3>
                        <p className="text-gray-700 mb-4">{step.description}</p>
                        {step.image && (
                          <div className="mt-4 rounded-lg overflow-hidden">
                            <img
                              src={step.image}
                              alt={`步骤 ${index + 1}`}
                              className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* 步骤编号 */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-md z-10">
                      {index + 1}
                    </div>
                    
                    {/* 空白占位 */}
                    <div className="w-5/12"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 评论区 */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">评论区</h2>
            
            {/* 评论输入框 */}
            <div className="mb-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0"></div>
                <div className="flex-1">
                  <textarea
                    placeholder="分享你的烹饪经验..."
                    className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                    rows={3}
                  ></textarea>
                  <div className="mt-3 flex justify-end">
                    <button className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300">
                      发表评论
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 评论列表 */}
            <div className="space-y-6">
              {/* 评论1 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">用户1</h4>
                    <span className="text-sm text-gray-500">2小时前</span>
                  </div>
                  <p className="text-gray-700 mb-3">这道菜非常美味，我按照步骤做了，家人都很喜欢！</p>
                  <div className="flex items-center gap-4">
                    <button className="text-sm text-gray-500 hover:text-amber-500 transition-colors duration-300">
                      👍 点赞 (12)
                    </button>
                    <button className="text-sm text-gray-500 hover:text-amber-500 transition-colors duration-300">
                      💬 回复
                    </button>
                  </div>
                </div>
              </div>
              
              {/* 评论2 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">用户2</h4>
                    <span className="text-sm text-gray-500">昨天</span>
                  </div>
                  <p className="text-gray-700 mb-3">步骤很详细，容易跟随，第一次做就成功了！</p>
                  <div className="flex items-center gap-4">
                    <button className="text-sm text-gray-500 hover:text-amber-500 transition-colors duration-300">
                      👍 点赞 (8)
                    </button>
                    <button className="text-sm text-gray-500 hover:text-amber-500 transition-colors duration-300">
                      💬 回复
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 相关推荐 */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">相关推荐</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {relatedRecipes.map((relatedRecipe) => (
                <RecipeCard key={relatedRecipe.id} recipe={relatedRecipe} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock数据 - 食谱详情
function getMockRecipeDetail(id) {
  return {
    id: parseInt(id),
    title: "香浓番茄意大利面",
    description: "简单易做的经典意大利面，酸甜可口，适合家庭日常烹饪",
    imageUrl: "https://neeko-copilot.bytedance.net/api/text2image?prompt=delicious%20tomato%20pasta%20with%20fresh%20herbs&size=1920x1080",
    prepTime: "20分钟",
    cookTime: "15分钟",
    difficulty: "简单",
    tags: ["意大利菜", "快手", "素食"],
    ingredients: [
      { name: "意大利面", amount: "200g" },
      { name: "番茄", amount: "3个" },
      { name: "洋葱", amount: "1个" },
      { name: "大蒜", amount: "2瓣" },
      { name: "橄榄油", amount: "2汤匙" },
      { name: "盐", amount: "适量" },
      { name: "黑胡椒", amount: "适量" },
      { name: "罗勒叶", amount: "适量" }
    ],
    tools: [
      { name: "煮锅", use: "煮面" },
      { name: "平底锅", use: "炒酱汁" },
      { name: "刀", use: "切菜" },
      { name: "砧板", use: "切菜" },
      { name: "漏勺", use: "捞面" }
    ],
    steps: [
      {
        title: "准备食材",
        description: "将番茄切丁，洋葱切碎，大蒜切末，罗勒叶洗净备用。",
        image: "https://neeko-copilot.bytedance.net/api/text2image?prompt=chopping%20tomatoes%20and%20onions%20for%20pasta%20sauce&size=800x600"
      },
      {
        title: "煮意大利面",
        description: "烧一锅沸水，加入盐，放入意大利面煮至八分熟（约8-10分钟）。",
        image: "https://neeko-copilot.bytedance.net/api/text2image?prompt=boiling%20pasta%20in%20a%20pot&size=800x600"
      },
      {
        title: "制作番茄酱汁",
        description: "平底锅中加入橄榄油，加热后放入洋葱和大蒜炒香，然后加入番茄丁翻炒，煮至番茄软烂，加入盐和黑胡椒调味。",
        image: "https://neeko-copilot.bytedance.net/api/text2image?prompt=cooking%20tomato%20sauce%20in%20a%20pan&size=800x600"
      },
      {
        title: "混合面条和酱汁",
        description: "将煮好的意大利面沥干，加入番茄酱汁中，翻炒均匀，让面条充分吸收酱汁。",
        image: "https://neeko-copilot.bytedance.net/api/text2image?prompt=mixing%20pasta%20with%20tomato%20sauce&size=800x600"
      },
      {
        title: "装盘上桌",
        description: "将意大利面盛出，撒上新鲜罗勒叶即可食用。",
        image: "https://neeko-copilot.bytedance.net/api/text2image?prompt=finished%20tomato%20pasta%20dish%20with%20basil&size=800x600"
      }
    ]
  };
}

// Mock数据 - 相关推荐菜谱
function getMockRelatedRecipes() {
  return [
    {
      id: 2,
      title: "泰式青咖喱鸡",
      description: "香辣浓郁的泰式经典，搭配香米饭",
      imageUrl: "https://neeko-copilot.bytedance.net/api/text2image?prompt=thai%20green%20curry%20with%20chicken&size=800x600",
      prepTime: "25分钟",
      cookTime: "30分钟",
      difficulty: "中等",
      tags: ["泰国菜", "咖喱", "鸡肉"]
    },
    {
      id: 3,
      title: "法式洋葱汤",
      description: "温暖醇厚的经典法国汤品",
      imageUrl: "https://neeko-copilot.bytedance.net/api/text2image?prompt=french%20onion%20soup%20with%20croutons&size=800x600",
      prepTime: "15分钟",
      cookTime: "50分钟",
      difficulty: "中等",
      tags: ["法国菜", "汤品", "冬季"]
    },
    {
      id: 4,
      title: "日式拉面",
      description: "浓郁汤底，手工面条，正宗日式风味",
      imageUrl: "https://neeko-copilot.bytedance.net/api/text2image?prompt=japanese%20ramen%20with%20chashu%20pork&size=800x600",
      prepTime: "30分钟",
      cookTime: "4小时",
      difficulty: "复杂",
      tags: ["日本菜", "面食", "高汤"]
    },
    {
      id: 5,
      title: "中式红烧肉",
      description: "肥而不腻，入口即化的经典中式菜肴",
      imageUrl: "https://neeko-copilot.bytedance.net/api/text2image?prompt=chinese%20braised%20pork%20belly&size=800x600",
      prepTime: "20分钟",
      cookTime: "2小时",
      difficulty: "中等",
      tags: ["中餐", "肉类", "传统"]
    }
  ];
}

export default RecipeDetailPage;