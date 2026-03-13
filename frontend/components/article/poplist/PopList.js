"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";


// 热门文章列表组件
const PopArticle = ({ articles = [] }) => {
  // 使用外部传入的文章数据
  // 确保 articles 是数组
  const foodPosts = Array.isArray(articles) ? articles.slice(-4, -1) : [];
  foodPosts[2].isFeatured = true;

  return (
    <section className="pb-10">
      {/* 标题区域 */}
      <div className="mx-auto text-left mb-10 lg:mb-6">
        <h2 className="text-2xl font-bold md:text-2xl md:leading-tight text-gray-900 dark:text-white">
          美食灵感
        </h2>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          探索厨师推荐的食谱、烹饪技巧和食材知识
        </p>
      </div>
      {/* 结束标题区域 */}

      {/* 文章网格 */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {foodPosts.map((post) => {
          // 添加默认值，确保即使数据中缺少某些字段也能正常渲染
          const id = post.id || post._id;
          const title = post.title || '无标题';
          const excerpt = post.excerpt || '暂无描述';
          const imageUrl = post.imageUrl || post.coverImage || 'https://picsum.photos/seed/default/600/400';
          const imageAlt = post.imageAlt || title;
          const category = post.category || '美食';
          const isSponsored = post.isSponsored || false;
          const isFeatured = post.isFeatured || false;
          const readTime = post.readTime || 5;
          
          return (
            <Link 
              key={id}
              href={`/article/${id}`}
              className="group flex flex-col h-full focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-xl overflow-hidden"
              aria-label={`阅读文章: ${title}`}
            >
              {/* 特色文章样式不同 */}
              {isFeatured ? (
                <div className="relative flex flex-col h-full bg-gradient-to-b from-transparent to-black/70 bg-center bg-cover rounded-xl overflow-hidden"
                  style={{ backgroundImage: `url(${imageUrl})` }}>
                  <div className="absolute top-4 left-4">
                    <span className="inline-block text-xs font-medium bg-orange-500 text-white py-1 px-2.5 rounded-full">
                      {category}
                    </span>
                  </div>
                  
                  <div className="mt-auto p-6 text-white">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-orange-200 transition-colors">
                      {title}
                    </h3>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {readTime} 分钟阅读
                      </span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ) : (
                // 普通文章卡片
                <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative pt-[65%] overflow-hidden">
                    {/* 使用Next.js的Image组件优化图片加载 */}
                    <Image 
                      src={imageUrl} 
                      alt={imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                      priority={isSponsored} // 优先加载赞助内容
                    />
                    
                    {/* 标签 */}
                    <div className="absolute top-3 left-3">
                      <span className={`inline-block text-xs font-medium py-1 px-2.5 rounded-full ${
                        isSponsored 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {isSponsored ? '推荐' : category}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {title}
                    </h3>
                    <p className="mt-3 text-gray-600 dark:text-gray-300 line-clamp-2">
                      {excerpt}
                    </p>
                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {readTime} 分钟阅读
                      </span>
                      <span className="inline-flex items-center text-sm font-medium text-orange-600 dark:text-orange-400 group-hover:underline">
                        阅读全文
                        <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </div>
      {/* 结束文章网格 */}

      {/* 查看更多按钮 */}
      <div className="mt-10 text-center">
        <Link
          href="/article/add"
          className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300 dark:focus:ring-orange-900 transition-colors"
        >
          创作文章
          <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};

export default PopArticle;
