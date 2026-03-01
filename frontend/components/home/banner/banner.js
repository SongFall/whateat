"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { fetchPopularArticles } from "@/app/services/articles/articlesApi";

const Banner = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // 从后端获取热门文章
  useEffect(() => {
    const loadPopularArticles = async () => {
      try {
        const data = await fetchPopularArticles();
        // 取前3篇文章作为幻灯片
        setArticles(data.slice(0, 3));
      } catch (error) {
        console.error('获取热门文章失败:', error);
        // 失败时使用默认数据
        setArticles([
          {
            id: 1,
            title: "如何做好家常菜",
            excerpt: "掌握这些基础技巧，让你的烹饪之路更加顺畅",
            coverImage: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
          {
            id: 2,
            title: "全球十大美食城市探秘",
            excerpt: "跟随我们的脚步，探索世界各地的美食文化",
            coverImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
          {
            id: 3,
            title: "健康饮食指南",
            excerpt: "科学饮食，吃出健康好身体",
            coverImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadPopularArticles();
  }, []);

  if (loading) {
    return (
      <div className="h-[400px] sm:h-[500px] md:h-[700px] w-full rounded-2xl bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 3000,
        }),
      ]}
    >
      <CarouselContent>
        {articles.map((article, index) => (
          <CarouselItem key={article.id || index} className="w-full">
            <div className="relative h-[400px] sm:h-[500px] md:h-[700px] w-full overflow-hidden rounded-2xl">
              <img
                src={article.coverImage || article.imageUrl || "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 sm:p-8">
                <div className="max-w-xl">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                    {article.title}
                  </h2>
                  <p className="text-white/90 text-sm sm:text-base mb-4">{article.excerpt || article.description}</p>
                  <Link
                    href={`/article/${article.id}`}
                    className="inline-flex items-center justify-center px-4 py-2 bg-white text-black font-medium rounded-md hover:bg-white/90 transition-colors w-auto"
                  >
                    阅读全文
                  </Link>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default Banner;
