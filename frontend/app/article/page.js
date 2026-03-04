"use client";
import React, { useState, useEffect } from "react";
import { fetchPopularArticles, getAllArticles } from "../services/articles/articlesApi";
import ArticleCard from "../../components/article/ArticleCard";
import PopArticle from "../../components/article/poplist/PopList"

const ArticlePage = () => {
  const [articles, setArticles] = useState([]);
  const [count, setCount] = useState(0);
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
        const response = await getAllArticles();
        const articlesData = response.data || [];
        const totalCount = response.count || 0;
        console.log('文章数据:', articlesData);
        console.log('文章总数:', totalCount);
        setCount(totalCount);
        setArticles(articlesData);
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

      {/* 文章列表 */}
      <div className="mx-auto mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            {category === "全部" ? "最新文章" : `${category}`}
          </h2>
          <span className="text-sm text-gray-500">共 {count} 篇文章</span>
        </div>

        {sortedArticles.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
            {(category === "全部" ? sortedArticles.slice(0) : sortedArticles).map((article) => (
              <div key={article.id} className="break-inside-avoid mb-6">
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        ) :
          <div className="bg-gray-50 p-10 rounded-lg text-center text-gray-500">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-xl font-medium mb-2">暂无符合条件的文章</h3>
            <p>尝试调整筛选条件或搜索不同的关键词</p>
          </div>
        }
      </div>
    </div>
  );
};

export default ArticlePage;
