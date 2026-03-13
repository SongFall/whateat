"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { updateArticle, getArticleById } from "@/app/services/articles/articlesApi";
import { uploadToAliyun } from "@/app/services/upload/upload";

const EditArticlePage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    coverImage: "",
    category: "烹饪技巧",
    tags: "",
    userId: parseInt(localStorage.getItem("userId")) || 1,
  });
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // 文章分类选项
  const categories = ["烹饪技巧", "美食文化", "健康饮食", "食材百科", "厨房小窍门"];

  // 路由守卫：检查用户权限
  useEffect(() => {
    const checkPermission = async () => {
      if (!id) return;
      
      try {
        // 检查用户是否登录
        const token = localStorage.getItem('token');
        const currentUserId = localStorage.getItem('userId');
        
        if (!token || !currentUserId) {
          alert('请先登录');
          window.location.href = '/auth';
          return;
        }
        
        // 获取文章详情
        const article = await getArticleById(id);
        
        // 检查用户是否是作者或管理员
        const isAuthor = parseInt(currentUserId) === parseInt(article.userId);
        const isAdmin = localStorage.getItem('userRole') === 'admin';
        
        if (!isAuthor && !isAdmin) {
          alert('没有权限编辑此文章');
          window.location.href = `/article/${id}`;
          return;
        }
        
        // 处理标签，将数组转换为逗号分隔的字符串
        const tagsString = Array.isArray(article.tags) ? article.tags.join(',') : article.tags || '';
        
        setFormData({
          title: article.title || "",
          content: article.content || "",
          coverImage: article.coverImage || "",
          category: article.category || "烹饪技巧",
          tags: tagsString,
          userId: parseInt(article.userId) || parseInt(currentUserId) || 1,
        });
      } catch (err) {
        console.error("加载文章失败:", err);
        setError("加载文章失败，请重试");
      } finally {
        setLoading(false);
      }
    };

    checkPermission();
  }, [id]);

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理图片上传
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(0);
      
      const result = await uploadToAliyun(file, (progress) => {
        setUploadProgress(progress);
      });

      setFormData(prev => ({
        ...prev,
        coverImage: result.url
      }));
      
      setUploading(false);
    } catch (err) {
      console.error("图片上传失败:", err);
      setError("图片上传失败，请重试");
      setUploading(false);
    }
  };

  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 表单验证
    if (!formData.title.trim()) {
      setError("请输入文章标题");
      return;
    }
    
    if (!formData.content.trim()) {
      setError("请输入文章内容");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // 处理标签，支持中文逗号、英文逗号和空格作为分隔符
      let processedTags = formData.tags;
      if (processedTags) {
        // 统一替换为英文逗号
        processedTags = processedTags
          .replace(/，/g, ',') // 中文逗号替换为英文逗号
          .replace(/\s+/g, ',') // 空格替换为英文逗号
          .replace(/,+/g, ',') // 多个逗号替换为单个逗号
          .trim() // 去除首尾空白
          .replace(/^,|,$/g, ''); // 去除首尾逗号
      }
      
      // 确保userId是数字类型
      const articleData = {
        ...formData,
        userId: parseInt(formData.userId) || 1,
        tags: processedTags
      };
      
      const response = await updateArticle(id, articleData);
      console.log("文章更新成功:", response);
      
      // 跳转到文章详情页
      window.location.href = `/article/${response.id}`;
    } catch (err) {
      console.error("文章更新失败:", err);
      setError("文章更新失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-amber-500 border-solid mx-auto mb-4"></div>
          <p className="text-gray-600">加载文章中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative">
      {/* 顶部标题区域 */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            📝 编辑文章
          </h1>
          <p className="text-xl sm:text-2xl max-w-2xl mx-auto text-amber-100">
            修改你的文章内容，分享更精彩的美食心得
          </p>
        </div>
      </div>

      {/* 表单容器 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        {/* 成功提示 */}
        {success && (
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="text-green-500 mr-3 text-xl">✅</div>
              <div>
                <h3 className="font-semibold text-green-800 text-lg">文章更新成功！</h3>
                <p className="text-green-600">你的文章已经成功更新</p>
              </div>
            </div>
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="text-red-500 mr-3 text-xl">❌</div>
              <div>
                <h3 className="font-semibold text-red-800 text-lg">更新失败</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 表单卡片 */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-10">
            {/* 文章标题 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">文章标题</h2>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="请输入文章标题"
                    className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none shadow-sm"
                    maxLength={100}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    {formData.title.length}/100
                  </p>
                </div>
              </div>
            </div>

            {/* 文章分类和标签 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 文章分类 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">分类</h3>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* 文章标签 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">标签（用逗号分隔）</h3>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="例如：美食,烹饪,技巧"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm"
                />
              </div>
            </div>

            {/* 封面图片 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">封面图片</h2>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 hover:border-amber-300 transition-colors duration-300">
                <div className="flex items-center justify-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    disabled={uploading}
                  />
                  {uploading && (
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className="bg-amber-500 h-2.5 rounded-full" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{uploadProgress}%</span>
                    </div>
                  )}
                </div>
                {formData.coverImage && (
                  <div className="mt-4">
                    <img 
                      src={formData.coverImage} 
                      alt="封面预览" 
                      className="w-full max-w-xs h-40 object-cover rounded-xl mx-auto"
                    />
                  </div>
                )}
                <p className="mt-4 text-sm text-gray-500 text-center">
                  上传一张精美的封面图片，让你的文章更具吸引力
                </p>
              </div>
            </div>

            {/* 文章内容 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">文章内容</h2>
              <div className="space-y-4">
                <div>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="请输入文章内容，分享你的美食心得和经验..."
                    rows={12}
                    className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none shadow-sm"
                  ></textarea>
                  <p className="mt-2 text-sm text-gray-500">
                    {formData.content.length} 字
                  </p>
                </div>
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    更新中...
                  </div>
                ) : (
                  "更新文章"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* 底部提示 */}
        <div className="mt-8 h-4 text-center text-sm text-gray-500">
        </div>
      </div>
    </div>
  );
};

export default EditArticlePage;