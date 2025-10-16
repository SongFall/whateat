"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FoodTestimonialSection = () => {
  // 评价数据
  const testimonials = [
    {
      id: 1,
      content:
        "作为厨房新手，这个网站的菜谱帮我彻底告别了“黑暗料理”！每步都有详细配图，连食材分量都精确到克，上周照着做的红烧肉，全家都夸比饭店还好吃～",
      author: "林晓梅",
      identity: "家庭主妇 | 美食新手",
      avatarAlt: "林晓梅头像",
    },
    {
      id: 2,
      content:
        "最爱的是“食材智能搭配”功能！冰箱里剩了半颗西兰花和一块鸡胸肉，输入后直接推荐了3道快手菜，15分钟就做好了晚餐，再也不用担心食材浪费了。",
      author: "张浩然",
      identity: "上班族 | 健身爱好者",
      avatarAlt: "张浩然头像",
    },
    {
      id: 3,
      content:
        "跟着网站的烘焙教程做了巴斯克蛋糕，第一次就成功了！教程里连烤箱温度偏差的小技巧都提到了，现在每周都会给孩子做不同的甜点，成就感满满～",
      author: "王莉",
      identity: "宝妈 | 烘焙爱好者",
      avatarAlt: "王莉头像",
    },
  ];

  // 轮播状态管理
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 切换到下一个评价
  const nextTestimonial = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  // 切换到上一个评价
  const prevTestimonial = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  // 过渡动画结束后重置状态
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  // 自动轮播
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="">
      <div className="text-center mb-10 sm:mb-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          美食爱好者的真实声音
        </h2>
        <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          来自不同场景的用户反馈，见证每一道美食的诞生
        </p>
      </div>
      <div className="bg-gray-50 dark:bg-gray-900/50 py-10 relative max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="relative testimonial-container">
          <button
            onClick={prevTestimonial}
            aria-label="上一条评价"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:translate-x-0 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 z-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* 轮播导航按钮 - 右 */}
          <button
            onClick={nextTestimonial}
            aria-label="下一条评价"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-0 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 z-10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* 评价内容 */}
          <blockquote
            className={`text-center lg:mx-auto lg:w-3/5 transition-opacity duration-500 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
            aria-label="用户评价"
          >
            {/* 评价文本 */}
            <div className="mt-6 lg:mt-10">
              <p className="relative text-lg sm:text-xl md:text-2xl md:leading-relaxed font-medium text-gray-800 dark:text-gray-200">
                <svg
                  className="absolute top-0 start-0 transform -translate-x-4 -translate-y-2 size-8 sm:size-10 text-orange-100 dark:text-orange-900/30"
                  width="16"
                  height="13"
                  viewBox="0 0 16 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M7.18079 9.25611C7.18079 10.0101 6.93759 10.6211 6.45119 11.0891C5.96479 11.5311 5.35039 11.7521 4.60799 11.7521C3.71199 11.7521 2.96958 11.4531 2.38078 10.8551C1.81758 10.2571 1.53598 9.39911 1.53598 8.28111C1.53598 7.08511 1.86878 5.91511 2.53438 4.77111C3.22559 3.60111 4.18559 2.67811 5.41439 2.00211L6.29759 3.36711C5.63199 3.83511 5.09439 4.35511 4.68479 4.92711C4.30079 5.49911 4.04479 6.16211 3.91679 6.91611C4.14719 6.81211 4.41599 6.76011 4.72319 6.76011C5.43999 6.76011 6.02879 6.99411 6.48959 7.46211C6.95039 7.93011 7.18079 8.52811 7.18079 9.25611ZM14.2464 9.25611C14.2464 10.0101 14.0032 10.6211 13.5168 11.0891C13.0304 11.5311 12.416 11.7521 11.6736 11.7521C10.7776 11.7521 10.0352 11.4531 9.44639 10.8551C8.88319 10.2571 8.60159 9.39911 8.60159 8.28111C8.60159 7.08511 8.93439 5.91511 9.59999 4.77111C10.2912 3.60111 11.2512 2.67811 12.48 2.00211L13.3632 3.36711C12.6976 3.83511 12.16 4.35511 11.7504 4.92711C11.3664 5.49911 11.1104 6.16211 10.9824 6.91611C11.2128 6.81211 11.4816 6.76011 11.7888 6.76011C12.5056 6.76011 13.0944 6.99411 13.5552 7.46211C14.016 7.93011 14.2464 8.52811 14.2464 9.25611Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="relative z-10 italic">{currentTestimonial.content}</span>
              </p>
            </div>

            {/* 评价者信息 */}
            <footer className="mt-8 sm:mt-10">
              {/* 评价者头像（使用占位图） */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-orange-200 dark:border-orange-800">
                  <img
                    src={`https://picsum.photos/seed/${currentTestimonial.id}/200/200`}
                    alt={currentTestimonial.avatarAlt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="font-semibold text-gray-900 dark:text-white text-lg">
                {currentTestimonial.author}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {currentTestimonial.identity}
              </div>
            </footer>
          </blockquote>

          {/* 轮播指示器 */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (index !== currentIndex && !isTransitioning) {
                    setIsTransitioning(true);
                    setCurrentIndex(index);
                  }
                }}
                aria-label={`切换到第 ${index + 1} 条评价`}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "bg-orange-500 w-8"
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-orange-300 dark:hover:bg-orange-700"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoodTestimonialSection;
