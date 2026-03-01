import React from "react";

/**
 * 文章卡片组件
 * @param {Object} props
 * @param {Object} props.article - 文章数据
 * @param {number} props.article.id - 文章ID
 * @param {string} props.article.title - 文章标题
 * @param {string} props.article.excerpt - 文章摘要
 * @param {string} props.article.coverImage - 封面图片URL
 * @param {string} props.article.author - 作者
 * @param {string} props.article.publishDate - 发布日期
 * @param {string} props.article.readTime - 阅读时间
 */
const ArticleCard = ({ article }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100" onClick={() => window.location.href = `/article/${article.id}`}>
      {/* 文章封面图 */}
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={article.coverImage || "/default-article.jpg"}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* 文章内容 */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{article.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.excerpt}</p>

        {/* 文章元信息 */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center text-gray-500 text-xs">
            <span className="mr-3">👤 {article.author}</span>
            <span className="mr-3">📅 {article.publishDate}</span>
            <span>👀 {article.viewCount || "0"} 次</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
