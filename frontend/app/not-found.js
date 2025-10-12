"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NotFoundPage = () => {
  return (
    <div className="pt-30 flex flex-col  dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* 核心 404 内容区：居中展示 + 视觉优化 */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
        <div className="max-w-3xl w-full mx-auto text-center">
          {/* 404 数字：大尺寸 + 渐变效果 */}
          <div className="relative mb-6">
            <h1 className="block text-8xl sm:text-9xl font-extrabold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent dark:from-orange-400 dark:to-indigo-400">
              404
            </h1>
            {/* 装饰性小圆点 */}
            <div className="absolute -top-4 -right-4 sm:-right-8 w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full"></div>
            <div className="absolute -bottom-2 -left-2 sm:-left-6 w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full"></div>
          </div>

          {/* 提示文本：分层次展示 */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3">
            页面找不到啦
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            抱歉，您访问的页面不存在。
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-x-2 px-6 py-3 text-base font-medium text-white bg-orange-500 dark:bg-orange-500 rounded-lg hover:bg-orange-600 dark:hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all shadow-md hover:shadow-lg"
            aria-label="返回首页"
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
            返回首页
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotFoundPage;
