"use client";
import React, { useState } from "react";
import { ChefHat, BookOpen, UtensilsCrossed, ArrowRight } from "lucide-react"; // 美食场景图标

const FoodFeaturesSection = () => {
  // 1. 受控状态管理 Tab 切换（替代原 HS 框架的 data 属性）
  const [activeTab, setActiveTab] = useState("tools");

  // 2. 美食场景化内容配置（抽离数据，便于维护）
  const tabData = [
    {
      id: "tools",
      title: "专业烹饪工具",
      desc: "提供精准食材秤、温度计时等工具，帮你把控每一步烹饪细节，新手也能做出专业级美食。",
      icon: <ChefHat className="shrink-0 mt-1.5 size-6 md:size-7" />,
      image:
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=560&h=720&q=80",
      alt: "专业烹饪工具展示",
    },
    {
      id: "guides",
      title: "分步美食指南",
      desc: "每道菜谱拆解为 3-5 步，搭配高清步骤图和视频，复杂菜式也能轻松跟着做，零失败率。",
      icon: <BookOpen className="shrink-0 mt-1.5 size-6 md:size-7" />,
      image:
        "https://images.unsplash.com/photo-1623547367710-87283d883465?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=560&h=720&q=80",
      alt: "分步美食指南展示",
    },
    {
      id: "ingredients",
      title: "食材智能搭配",
      desc: "输入家中现有食材，自动推荐可做菜谱；支持食材替换建议，解决“缺料”难题，不浪费每一份食材。",
      icon: <UtensilsCrossed className="shrink-0 mt-1.5 size-6 md:size-7" />,
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=560&h=720&q=80",
      alt: "食材智能搭配展示",
    },
  ];

  // 当前激活的 Tab 数据
  const currentTab = tabData.find((item) => item.id === activeTab) || tabData[0];

  return (
    <section className="">
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          让烹饪变得简单又有趣
        </h2>
        <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          从工具到指南，从食材到搭配，我们提供全方位支持，帮你轻松做出美味佳肴
        </p>
      </div>
      <div className="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto">
        {/* 模块标题：美食场景化引导 */}

        <div className="relative p-6 md:p-10 lg:p-16">
          {/* 背景色块：优化层次与响应式 */}
          <div className="absolute inset-0 grid grid-cols-12 size-full -z-10">
            <div className="col-span-full lg:col-span-7 lg:col-start-6 bg-gray-50 dark:bg-gray-800/50 w-full h-5/6 rounded-xl sm:h-3/4 lg:h-full"></div>
          </div>

          {/* 主内容 Grid：适配移动端与桌面端布局 */}
          <div className="relative z-10 lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">
            {/* 1. 左侧：Tab 内容区（移动端在上，桌面端在左） */}
            <div className="lg:col-span-6 lg:col-start-1 order-2 lg:order-1">
              <div className="relative">
                {/* Tab 图片：添加过渡动画与加载优化 */}
                <div className="overflow-hidden rounded-xl shadow-xl shadow-orange-100 dark:shadow-gray-700/20 transition-all duration-500 hover:shadow-2xl">
                  <img
                    src={currentTab.image}
                    alt={currentTab.alt}
                    className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy" // 懒加载优化
                  />
                </div>

                {/* 装饰 SVG：调整位置与颜色，贴合美食主题 */}
                <div className="hidden absolute top-0 end-0 -translate-x-4 md:translate-x-8 -translate-y-4 md:translate-y-0 text-orange-500 md:block">
                  <svg
                    className="w-14 h-auto"
                    width="121"
                    height="135"
                    viewBox="0 0 121 135"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 16.4754C11.7688 27.4499 21.2452 57.3224 5 89.0164"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M33.6761 112.104C44.6984 98.1239 74.2618 57.6776 83.4821 5"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M50.5525 130C68.2064 127.495 110.731 117.541 116 78.0874"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* 2. 右侧：Tab 导航区（移动端在下，桌面端在右） */}
            <div className="mb-10 lg:mb-0 lg:col-span-6 lg:col-start-7 order-1 lg:order-2">
              {/* Tab 标题：当前激活 Tab 的标题 */}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl mb-2">
                {currentTab.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">{currentTab.desc}</p>

              {/* 查看详情按钮：增强转化引导 */}
              <a
                href="/features"
                className="inline-flex items-center gap-x-2 px-5 py-2.5 text-sm font-medium text-white bg-orange-500 dark:bg-orange-600 rounded-lg hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
              >
                查看详情
                <ArrowRight className="w-4 h-4" />
              </a>

              {/* Tab 导航列表：受控状态切换 */}
              <nav
                className="grid gap-3 mt-8 md:mt-12"
                aria-label="功能选项卡"
                role="tablist"
                aria-orientation="vertical"
              >
                {tabData.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    // Tab 激活状态样式控制
                    className={`hs-tab-active:bg-white hs-tab-active:shadow-md hs-tab-active:hover:border-transparent text-start p-4 md:p-5 rounded-xl transition-all duration-300 focus:outline-none ${
                      activeTab === tab.id
                        ? "bg-white shadow-md text-orange-600 dark:bg-gray-800 dark:text-orange-400"
                        : "hover:bg-orange-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                    id={`food-tabs-item-${tab.id}`}
                    aria-selected={activeTab === tab.id}
                    aria-controls={`food-tabs-${tab.id}`}
                    role="tab"
                    onClick={() => setActiveTab(tab.id)} // 点击切换 Tab
                  >
                    <span className="flex gap-x-4 items-start">
                      {/* Tab 图标：激活时变色 */}
                      <span
                        className={`${activeTab === tab.id ? "text-orange-600 dark:text-orange-400" : "text-gray-700 dark:text-gray-400"}`}
                      >
                        {tab.icon}
                      </span>
                      <span className="grow">
                        <span className="block text-lg font-semibold">{tab.title}</span>
                        <span className="block mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {tab.desc.slice(0, 40)}...
                        </span>
                      </span>
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoodFeaturesSection;
