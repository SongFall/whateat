"use client";
import React, { useState, useEffect } from "react";
import { fetchPopularArticles } from "../services/api";
import ArticleCard from "../../components/article/ArticleCard";
import PopArticle from "../../components/article/poplist/PopList"

const ArticlePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("全部");
  const [sortBy, setSortBy] = useState("latest");

  // 文章分类
  const categories = ["全部", "烹饪技巧", "美食文化", "健康饮食", "食材百科", "厨房小窍门"];

  // 在组件挂载时获取数据
  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        // 获取热门文章数据
        const articlesData = await fetchPopularArticles();
        // 为了展示效果，复制并修改一些数据以增加数量
        const expandedArticles = [
          ...articlesData,
          {
            ...articlesData[0],
            id: 4,
            title: "夏季清凉食谱：5款消暑开胃菜",
            excerpt: "炎炎夏日，来几道清爽开胃的菜品，让你胃口大开",
            coverImage: "/summer-food.jpg",
            author: "夏季美食家",
            publishDate: "2023-07-20",
            readTime: "7分钟",
          },
          {
            ...articlesData[1],
            id: 5,
            title: "如何挑选新鲜食材：厨师不会告诉你的秘密",
            excerpt: "掌握这些挑选食材的技巧，让你的料理更上一层楼",
            coverImage: "/fresh-ingredients.jpg",
            author: "食材专家",
            publishDate: "2023-08-05",
            readTime: "9分钟",
          },
          {
            ...articlesData[2],
            id: 6,
            title: "家常菜谱进阶：提升厨艺的调味秘诀",
            excerpt: "了解这些调味技巧，让你的家常菜瞬间变餐厅级美食",
            coverImage: "/seasoning.jpg",
            author: "调味大师",
            publishDate: "2023-08-15",
            readTime: "6分钟",
          },
        ];
        setArticles(expandedArticles);
      } catch (err) {
        console.error("加载文章失败:", err);
        setError("加载文章失败，请稍后重试");
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  // 根据搜索词和分类筛选文章
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      category === "全部" || article.title.includes(category) || article.excerpt.includes(category);

    return matchesSearch && matchesCategory;
  });

  // 排序文章
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.publishDate) - new Date(a.publishDate);
    } else if (sortBy === "oldest") {
      return new Date(a.publishDate) - new Date(b.publishDate);
    }
    return 0;
  });

  // 加载状态显示
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center h-80">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">正在加载文章...</p>
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
      <PopArticle />

      {/* 搜索框和排序选项 */}
      <div className="mx-auto mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="搜索文章..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

        <div className="flex-shrink-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="latest">最新发布</option>
            <option value="oldest">最早发布</option>
          </select>
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="mx-auto mb-8">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">文章分类</h3>
        <div className="flex overflow-x-auto pb-2 space-x-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                category === cat
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 特色文章 */}
      {category === "全部" && sortedArticles.length > 0 && (
        <div className="mx-auto mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">特色推荐</h2>
          <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
            <div className="md:flex">
              <div className="md:w-1/2 h-64 md:h-auto overflow-hidden">
                <img
                  src={sortedArticles[0].coverImage || "/default-article.jpg"}
                  alt={sortedArticles[0].title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6 md:w-1/2">
                <h3 className="text-2xl font-bold mb-2 line-clamp-2">{sortedArticles[0].title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{sortedArticles[0].excerpt}</p>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <span className="mr-3">👤 {sortedArticles[0].author}</span>
                  <span className="mr-3">📅 {sortedArticles[0].publishDate}</span>
                  <span>⏱️ {sortedArticles[0].readTime}</span>
                </div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  阅读全文
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 文章列表 */}
      <div className="mx-auto mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            {category === "全部" ? "最新文章" : `${category}`}
          </h2>
          <span className="text-sm text-gray-500">共 {sortedArticles.length} 篇文章</span>
        </div>

        {sortedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {(category === "全部" ? sortedArticles.slice(1) : sortedArticles).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-10 rounded-lg text-center text-gray-500">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-xl font-medium mb-2">暂无符合条件的文章</h3>
            <p>尝试调整筛选条件或搜索不同的关键词</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlePage;
