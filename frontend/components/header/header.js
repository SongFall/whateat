"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  // 状态管理
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname(); // 获取当前路径

  // 修复核心：确保isActive函数正确定义
  const isActive = (href) => {
    // 处理根路径和子路径的匹配逻辑
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "首页" },
    { href: "/recipe", label: "食谱" },
    { href: "/article", label: "文章" },
    { href: "/my", label: "我的" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 py-1 transition-all duration-300  bg-white/95 backdrop-blur-sm
      "
    >
      <nav className="relative container mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo区域 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center focus:outline-none" aria-label="Home">
              <img src="/logo.svg" alt="ShopHub Logo" className="w-20 h-20" />
              <span className="text-2xl font-bold text-gray-800 font-mono">Whateat</span>
            </Link>
          </div>

          {/* 桌面端导航菜单 */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative  text-lg text-gray-800 transition-colors hover:text-orange-500 ${
                  isActive(link.href) ? "font-bold" : "font-medium"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute -bottom-0 left-0 w-full h-1 bg-orange-400 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* 功能按钮组 */}
          <div className="flex items-center gap-2">
            {/* 搜索按钮 */}
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
              aria-label="Search"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m21 21-4.34-4.34" />
                <circle cx="11" cy="11" r="8" />
              </svg>
            </button>

            {/* 购物车按钮 */}
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 relative"
              aria-label="Cart"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              <span className="absolute top-0 right-0 w-4 h-4 bg-orange-500 text-white text-xs flex items-center justify-center rounded-full">
                3
              </span>
            </button>

            {/* 登录按钮 */}
            <Link
              href="/auth"
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-black bg-orange-400 rounded-lg hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-all"
            >
              登录
            </Link>

            {/* 移动端菜单按钮 */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* 移动端导航菜单 */}
        <div
          id="mobile-menu"
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-60 mt-4 pb-4" : "max-h-0"
          }`}
        >
          <div className="flex flex-col space-y-3 pt-2 pb-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg font-medium ${
                  isActive(link.href)
                    ? "bg-orange-50 text-orange-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/signin"
              className="px-3 py-2 rounded-lg font-medium bg-orange-400 text-black hover:bg-orange-500 text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign in
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
