"use client";
import { useState, useEffect } from "react";
import { fetchFeaturedRecipes, fetchPopularArticles } from "./services/api";
import Banner from "./components/home/banner/banner";
import Stats from "./components/home/stats/Stats";
import Feature from "./components/home/feature/feature";
import Comment from "./components/home/comment/comment";

function Home() {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [popularArticles, setPopularArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 在组件挂载时获取数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 并行获取数据
        const [recipes, articles] = await Promise.all([
          fetchFeaturedRecipes(),
          fetchPopularArticles(),
        ]);

        setFeaturedRecipes(recipes);
        setPopularArticles(articles);
      } catch (err) {
        console.error("加载数据失败:", err);
        setError("加载数据失败，请稍后重试");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 加载状态显示
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center h-80">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">正在加载美食内容...</p>
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
    <div className="container mx-auto px-4 py-2 flex flex-col gap-15">
      <Banner />
      <Feature />
      <Stats />
      <Comment />
    </div>
  );
}

export default Home;
