"use client";
import React, { useState, useEffect } from "react";
import { fetchFeaturedRecipes } from "../services/api";
import RecipeCard from "../components/recipe/RecipeCard";

const RecipePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("全部");
  const [filterTags, setFilterTags] = useState([]);
  const [activeTag, setActiveTag] = useState("全部");

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
        // 为了展示效果，复制一些数据以增加数量
        const expandedRecipes = [...recipesData, ...recipesData];
        setRecipes(expandedRecipes);
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

  // 根据搜索词和分类筛选食谱
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      category === "全部" || (recipe.tags && recipe.tags.some((tag) => tag.includes(category)));

    const matchesTag = activeTag === "全部" || (recipe.tags && recipe.tags.includes(activeTag));

    return matchesSearch && matchesCategory && matchesTag;
  });

  // 加载状态显示
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center h-80">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">正在加载食谱...</p>
        </div>
      </div>
    );
  }

  // 错误状态显示
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center h-80">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 搜索框 */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索食谱..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* 分类和标签筛选 */}
      <div className="mb-8 space-y-6">
        {/* 分类筛选 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">按餐别分类</h3>
          <div className="flex overflow-x-auto pb-2 space-x-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  category === cat
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 标签筛选 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">按菜系/特色标签</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag("全部")}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                activeTag === "全部"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              全部
            </button>
            {filterTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  activeTag === tag
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 食谱列表 */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            {category === "全部" && activeTag === "全部"
              ? "所有食谱"
              : `${activeTag === "全部" ? category : activeTag}食谱`}
          </h2>
          <span className="text-sm text-gray-500">共 {filteredRecipes.length} 个食谱</span>
        </div>

        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-10 rounded-lg text-center text-gray-500">
            <div className="text-5xl mb-4">🍳</div>
            <h3 className="text-xl font-medium mb-2">暂无符合条件的食谱</h3>
            <p>尝试调整筛选条件或搜索不同的关键词</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipePage;
