"use client";
import React, { useState, useEffect } from "react";
import { fetchFeaturedRecipes } from "../services/recipes/recipesApi";
import RecipeCard from "../../components/recipe/RecipeCard";

// 添加平滑滚动行为
if (typeof window !== 'undefined') {
  window.scrollTo({ behavior: 'smooth' });
}

const RecipePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("全部");
  const [filterTags, setFilterTags] = useState([]);
  const [activeTag, setActiveTag] = useState("全部");
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  // 筛选食谱
  useEffect(() => {
    const filtered = recipes.filter((recipe) => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) || recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === "全部" || (recipe.tags && recipe.tags.some((tag) => tag.includes(category)));
      const matchesTag = activeTag === "全部" || (recipe.tags && recipe.tags.includes(activeTag));
      return matchesSearch && matchesCategory && matchesTag;
    });
    setFilteredRecipes(filtered);
  }, [recipes, searchTerm, category, activeTag]);

  // 食谱分类
  const categories = ["全部", "早餐", "午餐", "晚餐", "甜点", "素食", "快手菜"];

  // 所有标签
  const allTags = [
    "意大利菜",
    "泰国菜",
    "法国菜",
    "日本菜",
    "中餐",
    "快手",
    "素食",
    "咖喱",
    "面食",
    "汤品",
    "冬季",
    "夏季",
  ];

  // 在组件挂载时获取数据
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setLoading(true);
        setError(null);

        // 获取推荐菜谱数据
        const recipesData = await fetchFeaturedRecipes();
        setRecipes(recipesData);
        setFilterTags(allTags); // 设置所有可用标签
      } catch (err) {
        console.error("加载食谱失败:", err);
        setError("加载食谱失败，请稍后重试");
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, []);

  // 加载状态显示
  if (loading) {
    return (
      <>
        {/* 顶部英雄区域 */}
        <div className="relative bg-gradient-to-r from-amber-500 to-orange-600 text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('https://neeko-copilot.bytedance.net/api/text2image?prompt=delicious%20food%20background%20with%20blurred%20effect&size=1920x1080')] bg-cover bg-center"></div>
          </div>
          <div className="relative max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
              发现美味食谱
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mb-8 text-amber-100">
              探索各种菜系的精美食谱，从简单快手到高级料理，满足你的味蕾需求
            </p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mb-4"></div>
            <p className="text-gray-600 text-lg">正在加载食谱...</p>
          </div>
        </div>
      </>
    );
  }

  // 错误状态显示
  if (error) {
    return (
      <>
        {/* 顶部英雄区域 */}
        <div className="relative bg-gradient-to-r from-amber-500 to-orange-600 text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('https://neeko-copilot.bytedance.net/api/text2image?prompt=delicious%20food%20background%20with%20blurred%20effect&size=1920x1080')] bg-cover bg-center"></div>
          </div>
          <div className="relative max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
              发现美味食谱
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mb-8 text-amber-100">
              探索各种菜系的精美食谱，从简单快手到高级料理，满足你的味蕾需求
            </p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-red-500 text-5xl mb-6">⚠️</div>
            <p className="text-gray-600 text-lg mb-6">{error}</p>
            <button
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:shadow-lg transition-all duration-300"
              onClick={() => window.location.reload()}
            >
              重试
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* 顶部英雄区域 */}
      <div className="relative bg-gradient-to-r from-amber-500 to-orange-600 text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://neeko-copilot.bytedance.net/api/text2image?prompt=delicious%20food%20background%20with%20blurred%20effect&size=1920x1080')] bg-cover bg-center"></div>
        </div>
        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            发现美味食谱
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mb-8 text-amber-100">
            探索各种菜系的精美食谱，从简单快手到高级料理，满足你的味蕾需求
          </p>
          
          {/* 去做饭按钮 */}
          <div className="flex gap-4">
            <button 
              className="px-10 py-4 bg-white text-amber-600 rounded-full font-bold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              onClick={() => window.location.href = "/uploadpage"}
            >
              🍳 去做菜
            </button>
            {/* <button 
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300"
              onClick={() => window.location.href = "/recipe"}
            >
              浏览食谱
            </button> */}
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* 分类和标签筛选 */}
        {/* <div className="mb-16 space-y-10">
          <div>
            <h3 className="text-lg font-semibold mb-5 text-gray-900">按餐别分类</h3>
            <div className="flex overflow-x-auto pb-4 space-x-4 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-6 py-3 rounded-full whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${
                    category === cat
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-50 shadow-md border border-gray-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-5 text-gray-900">按菜系/特色标签</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTag("全部")}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 transform hover:scale-105 ${
                  activeTag === "全部"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-100"
                }`}
              >
                全部
              </button>
              {filterTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 transform hover:scale-105 ${
                    activeTag === tag
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-100"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div> */}

        {/* 食谱列表 */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-0 leading-tight">
              {category === "全部" && activeTag === "全部"
                ? "所有食谱"
                : `${activeTag === "全部" ? category : activeTag}食谱`}
            </h2>
            <span className="text-sm text-gray-500 font-medium">共 {filteredRecipes.length} 个食谱</span>
          </div>

          {filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredRecipes.map((recipe) => (
                <div key={recipe.id} className="animate-fadeIn">
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-16 rounded-xl text-center text-gray-500 shadow-sm">
              <div className="text-7xl mb-8">🍳</div>
              <h3 className="text-2xl font-medium mb-4">暂无符合条件的食谱</h3>
              <p className="text-gray-600 max-w-md mx-auto">尝试调整筛选条件或搜索不同的关键词</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RecipePage;
