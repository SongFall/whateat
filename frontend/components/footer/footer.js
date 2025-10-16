"use client";
import React from "react";
import Link from "next/link";

const Footer = () => {
  const navigation = [
    {
      title: "网站导航",
      links: [
        { href: "/", label: "首页" },
        { href: "/pages/recipe", label: "食谱" },
        { href: "/pages/article", label: "文章" },
        { href: "/pages/auth", label: "登录/注册" },
      ],
    },
    {
      title: "食谱分类",
      links: [
        { href: "/pages/recipe?type=breakfast", label: "早餐" },
        { href: "/pages/recipe?type=lunch", label: "午餐" },
        { href: "/pages/recipe?type=dinner", label: "晚餐" },
        { href: "/pages/recipe?type=dessert", label: "甜点" },
      ],
    },
    {
      title: "关于我们",
      links: [
        { href: "/about", label: "团队介绍" },
        { href: "/contact", label: "联系我们" },
        { href: "/privacy", label: "隐私政策" },
        { href: "/terms", label: "使用条款" },
      ],
    },
  ];

  const socialLinks = [
    { href: "#", icon: "facebook", label: "Facebook" },
    { href: "#", icon: "instagram", label: "Instagram" },
    { href: "#", icon: "twitter", label: "Twitter" },
    { href: "#", icon: "youtube", label: "YouTube" },
  ];

  return (
    <footer className="container dark:bg-gray-900 pb-4 dark:border-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-5">
        <div>
          <Link href="/" className="flex items-center focus:outline-none" aria-label="Home">
            <img src="/logo.svg" alt="ShopHub Logo" className="w-20 h-20" />
            <span className="text-2xl font-bold text-gray-800 font-mono">Whateat</span>
          </Link>
        </div>

        <ul className="text-center">
          <li className="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-gray-300">
            <a
              className="inline-flex gap-x-2 text-gray-500 hover:text-gray-800 focus:outline-hidden focus:text-gray-800"
              href="#"
            >
              关于我们
            </a>
          </li>
          <li className="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-gray-300">
            <a
              className="inline-flex gap-x-2  text-gray-500 hover:text-gray-800 focus:outline-hidden focus:text-gray-800"
              href="#"
            >
              使用条款
            </a>
          </li>
          <li className="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-gray-300">
            <a
              className="inline-flex gap-x-2  text-gray-500 hover:text-gray-800 focus:outline-hidden focus:text-gray-800"
              href="#"
            >
              隐私政策
            </a>
          </li>
        </ul>

        <div className="flex w-full justify-end space-x-4">
          {socialLinks.map((link) => (
            <a
              key={link.icon}
              href={link.href}
              className="text-gray-400 hover:text-orange-400 dark:hover:text-orange-400 transition-colors"
              aria-label={link.label}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                {link.icon === "facebook" && (
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                )}
                {link.icon === "instagram" && (
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                )}
                {link.icon === "twitter" && (
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                )}
                {link.icon === "youtube" && (
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                )}
              </svg>
            </a>
          ))}
        </div>
      </div>
      {/* End Grid */}
      {/* <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Link href="/" className="flex items-center focus:outline-none" aria-label="Home">
                <img src="/logo.svg" alt="ShopHub Logo" className="w-20 h-20" />
                <span className="text-2xl font-bold text-gray-800 font-mono">Whateat</span>
              </Link>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              发现美食，分享烹饪乐趣。WhatEat为您提供丰富的食谱、烹饪技巧和美食资讯。
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.icon}
                  href={link.href}
                  className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  aria-label={link.label}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    {link.icon === "facebook" && (
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    )}
                    {link.icon === "instagram" && (
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    )}
                    {link.icon === "twitter" && (
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    )}
                    {link.icon === "youtube" && (
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    )}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {navigation.map((column, index) => (
            <div key={index}>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 dark:text-gray-400">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-base text-gray-600 hover:text-blue-600 transition-colors dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} WhatEat. 保留所有权利。
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link
              href="/privacy"
              className="text-gray-500 hover:text-blue-600 text-sm transition-colors dark:text-gray-400 dark:hover:text-blue-400"
            >
              隐私政策
            </Link>
            <Link
              href="/terms"
              className="text-gray-500 hover:text-blue-600 text-sm transition-colors dark:text-gray-400 dark:hover:text-blue-400"
            >
              使用条款
            </Link>
            <Link
              href="/cookies"
              className="text-gray-500 hover:text-blue-600 text-sm transition-colors dark:text-gray-400 dark:hover:text-blue-400"
            >
              Cookie政策
            </Link>
          </div>
        </div>
      </div> */}
    </footer>
  );
};

export default Footer;
