"use client";
import React, { useEffect, useRef, useState } from "react";
import { Users, Utensils, FileText } from "lucide-react";
import apiClient from '@/app/request/apiClient';

const FoodStatsSection = () => {
  // 1. 用 React ref 替代 DOM ID，监听整个统计模块的滚动状态
  const statsContainerRef = useRef(null);
  // 2. 状态管理：标记动画是否已执行（避免重复触发）
  const [animationTriggered, setAnimationTriggered] = useState(false);
  // 3. 状态管理：存储统计数据
  const [statsData, setStatsData] = useState({
    users: 0,
    recipes: 0,
    articles: 0
  });

  // 数字动画引用（保持不变）
  const statsRefs = {
    users: useRef(null),
    recipes: useRef(null),
    articles: useRef(null),
  };

  // 数字滚动动画（核心逻辑不变）
  const animateValue = (ref, start, end, duration = 1800) => {
    if (!ref.current) return;
    const element = ref.current;
    const suffix = element.dataset.suffix || "";
    let startTimestamp = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);

      // 格式化数字（千位分隔符）
      element.textContent = `${new Intl.NumberFormat().format(value)}${suffix}`;

      if (progress < 1) window.requestAnimationFrame(step);
    };

    window.requestAnimationFrame(step);
  };

  // 获取统计数据
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/stats');
        setStatsData({
          users: response.users || 0,
          recipes: response.recipes || 0,
          articles: response.articles || 0
        });
      } catch (error) {
        console.error('获取统计数据失败:', error);
        // 失败时使用默认值
        setStatsData({
          users: 156000,
          recipes: 8900,
          articles: 3200
        });
      }
    };

    fetchStats();
  }, []);

  // 3. 重构滚动监听：用 ref + IntersectionObserver，不依赖 document
  useEffect(() => {
    // 确保在客户端环境执行（Next.js 服务端无 window）
    if (typeof window === "undefined" || animationTriggered) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 模块进入视图 + 动画未执行时，触发动画
          if (entry.isIntersecting && !animationTriggered) {
            animateValue(statsRefs.users, 0, statsData.users, 2000); // 注册人数
            animateValue(statsRefs.recipes, 0, statsData.recipes, 1800); // 菜谱数
            animateValue(statsRefs.articles, 0, statsData.articles, 1600); // 文章数
            setAnimationTriggered(true); // 标记动画已执行，避免重复
            observer.unobserve(entry.target); // 停止监听
          }
        });
      },
      { threshold: 0.2 } // 模块 20% 进入视图时触发
    );

    // 监听 statsContainerRef 对应的 DOM 元素（替代 document.getElementById）
    if (statsContainerRef.current) {
      observer.observe(statsContainerRef.current);
    }

    // 清理函数：组件卸载时停止监听
    return () => {
      if (statsContainerRef.current) {
        observer.unobserve(statsContainerRef.current);
      }
    };
  }, [animationTriggered, statsData]); // 依赖 animationTriggered 和 statsData

  // 美食网站统计数据（使用真实数据）
  const foodStatsData = [
    {
      title: "注册美食家",
      icon: <Users className="h-8 w-8 text-orange-500 dark:text-orange-400" />,
      value: statsData.users,
      suffix: "+",
      desc: "来自全国各地的美食爱好者共同交流",
      ref: statsRefs.users,
    },
    {
      title: "精选菜谱",
      icon: <Utensils className="h-8 w-8 text-orange-500 dark:text-orange-400" />,
      value: statsData.recipes,
      suffix: "+",
      desc: "覆盖家常菜、烘焙、西餐等20+品类",
      ref: statsRefs.recipes,
    },
    {
      title: "美食攻略",
      icon: <FileText className="h-8 w-8 text-orange-500 dark:text-orange-400" />,
      value: statsData.articles,
      suffix: "+",
      desc: "食材选购、烹饪技巧、探店指南全涵盖",
      ref: statsRefs.articles,
    },
  ];

  return (
    <section className="">
      {/* 模块标题：贴合美食场景 */}
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          美食社区，有你更精彩
        </h2>
        <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          每一组数据，都来自千万美食爱好者的共同创造
        </p>
      </div>

      {/* 4. 用 ref 绑定容器，替代 ID（关键修改） */}
      <div
        ref={statsContainerRef} // 绑定 ref，用于滚动监听
        className="bg-orange-50 dark:bg-gray-900/60 py-12 sm:py-16 px-6 sm:px-8 lg:px-12 mx-auto rounded-xl"
      >
        <div className="grid gap-6 sm:gap-8 lg:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {foodStatsData.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-orange-100 dark:border-gray-700/50 hover:border-orange-200 dark:hover:border-orange-900/30"
            >
              <div className="mb-4 sm:mb-5 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg inline-block">
                {stat.icon}
              </div>

              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {stat.title}
              </h3>

              <p
                ref={stat.ref} // 绑定数字元素的 ref
                data-suffix={stat.suffix}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-orange-500 dark:text-orange-400 mb-1"
              >
                0{stat.suffix}
              </p>

              <p className="text-gray-600 dark:text-gray-400">{stat.desc}</p>
            </div>
          ))}
        </div>

        {/* 行动引导：引导用户参与 */}
        <div className="text-center mt-12 sm:mt-16">
          <a
            href="/register"
            className="inline-flex items-center gap-x-2 px-5 py-2.5 text-sm font-medium text-white bg-orange-500 dark:bg-orange-600 rounded-lg hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
          >
            加入美食社区，分享你的拿手菜
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FoodStatsSection;
