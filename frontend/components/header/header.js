"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  // 状态管理
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const pathname = usePathname(); // 获取当前路径

  // 检查用户登录状态
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('userInfo');
      
      if (token && user) {
        setIsLoggedIn(true);
        setUserInfo(JSON.parse(user));
      } else {
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    };
    
    // 初始检查
    checkLoginStatus();
    
    // 监听存储变化（用于其他页面登录/登出时更新状态）
    window.addEventListener('storage', checkLoginStatus);
    
    // 定期检查登录状态，确保在同一个标签页中登录后能及时更新
    const intervalId = setInterval(checkLoginStatus, 1000);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      clearInterval(intervalId);
    };
  }, []);

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
          <div className="flex items-center gap-2 relative">
            {/* 搜索框 - 绝对定位，不影响菜单栏 */}
            <div className={`absolute right-full top-1/2 -translate-y-1/2 mr-3 transition-all duration-300 ease-in-out transform ${isSearchOpen ? 'translate-x-0 opacity-100 w-64' : 'translate-x-10 opacity-0 w-0 overflow-hidden'}`}>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  // 跳转到搜索结果页
                  window.location.href = `/result?q=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}>
                <input
                  type="text"
                  placeholder="搜索食谱、文章..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }
                  }}
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 text-sm"
                  autoFocus
                />
              </form>
            </div>
            
            {/* 搜索/取消按钮 */}
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
              aria-label={isSearchOpen ? "Cancel search" : "Search"}
              onClick={() => {
                if (isSearchOpen) {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                } else {
                  setIsSearchOpen(true);
                }
              }}
            >
              {isSearchOpen ? (
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
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              ) : (
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
              )}
            </button>

            {/* 管理员按钮 - 仅对管理员角色显示 */}
            {isLoggedIn && userInfo?.role === 'admin' && (
              <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 relative"
                aria-label="Admin"
                onClick={() => {
                  window.location.href = '/admin';
                }}
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
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <span className="absolute top-0 right-0 w-4 h-4 bg-orange-500 text-white text-xs flex items-center justify-center rounded-full">
                  3
                </span>
              </button>
            )}

            {/* 登录/用户头像 */}
            {isLoggedIn ? (
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-2 border-orange-300 hover:border-orange-500 transition-all focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                  aria-label="User menu"
                >
                  <img
                    src={userInfo?.avatar || '/default-avatar.png'}
                    alt={userInfo?.username || 'User'}
                    className="w-full h-full object-cover"
                  />
                </button>
                {/* 用户菜单下拉 */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right">
                  <Link
                    href="/my"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                  >
                    我的主页
                  </Link>
                  <Link
                    href="/my/recipes"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                  >
                    我的食谱
                  </Link>
                  <Link
                    href="/my/articles"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                  >
                    我的文章
                  </Link>
                  <Link
                    href="/my/collections"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                  >
                    我的收藏
                  </Link>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    type="button"
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    onClick={() => {
                      // 登出逻辑
                      localStorage.removeItem('token');
                      localStorage.removeItem('userId');
                      localStorage.removeItem('userInfo');
                      setIsLoggedIn(false);
                      setUserInfo(null);
                      // 触发存储事件，通知其他页面
                      window.dispatchEvent(new Event('storage'));
                      // 跳转到登录页面
                      window.location.href = '/auth';
                    }}
                  >
                    退出登录
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth"
                className="hidden sm:inline-flex items-center text-white px-4 py-2 text-sm font-mediums bg-orange-400 rounded-lg hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-all"
              >
                登录
              </Link>
            )}

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
            {isLoggedIn ? (
              <div className="px-3 py-2 rounded-lg font-medium bg-orange-50 text-orange-700">
                <div className="flex items-center gap-2">
                  <img
                    src={userInfo?.avatar || '/default-avatar.png'}
                    alt={userInfo?.username || 'User'}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>{userInfo?.username || 'User'}</span>
                </div>
              </div>
            ) : (
              <Link
                href="/auth"
                className="px-3 py-2 rounded-lg font-medium bg-orange-400 text-white hover:bg-orange-500 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                登录
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
