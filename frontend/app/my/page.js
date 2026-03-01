"use client";
import React, { useState, useEffect } from "react";
import apiClient from "../request/apiClient";
import { getUserProfile, saveUserPreferences } from "../services/users/usersApi";

const MyPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    favoriteCuisines: [],
    dietaryRestrictions: [],
    mealTypes: [],
  });
  const [activeTab, setActiveTab] = useState('articles'); // articles, recipes, favorites
  const [editData, setEditData] = useState({});

  // 加载用户数据
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const userData = await getUserProfile();
        setUser(userData);
        // 修复：使用默认对象而不是依赖外部preferences变量
        setPreferences(
          userData.preferences || {
            favoriteCuisines: [],
            dietaryRestrictions: [],
            mealTypes: [],
          }
        );
        setEditData({
      username: userData.username,
      avatar: userData.avatar,
      bio: userData.bio,
      location: userData.location,
      email: userData.email,
    });
      } catch (err) {
        setError("加载用户数据失败，请稍后重试");
        console.error("Failed to load user data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // 处理编辑表单变更
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 处理偏好设置变更
  const handlePreferenceChange = (category, value) => {
    setPreferences((prev) => {
      const currentValues = [...prev[category]];
      const index = currentValues.indexOf(value);

      if (index === -1) {
        currentValues.push(value);
      } else {
        currentValues.splice(index, 1);
      }

      return {
        ...prev,
        [category]: currentValues,
      };
    });
  };

  // 保存用户资料
  const saveUserProfile = async () => {
    try {
      setLoading(true);
      
      // 获取当前用户ID
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('用户未登录');
      }

      // 调用API更新用户资料
      await apiClient.put(`/users/${userId}`, editData);
      
      // 保存偏好设置
      await saveUserPreferences(preferences);

      // 更新本地用户数据
      setUser((prev) => ({
        ...prev,
        ...editData,
        preferences,
      }));

      setIsModalOpen(false);
    } catch (err) {
      setError("保存用户资料失败，请稍后重试");
      console.error("Failed to save user profile:", err);
    } finally {
      setLoading(false);
    }
  };

  // 渲染加载状态
  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">加载个人中心...</p>
        </div>
      </div>
    );
  }

  // 渲染错误状态
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-500 mb-4">❌</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  // 渲染用户资料
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 主内容区域 */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 1. 顶部个人信息展示区 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-8">
          
          {/* 用户信息 */}
          <div className="px-6 py-5">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* 头像 */}
              <div className="w-32 h-32 rounded-full bg-white dark:bg-gray-700 border-4 border-white dark:border-gray-800 overflow-hidden shadow-lg">
                <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
              </div>
              
              {/* 基本信息 */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.username}</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">美食爱好者</p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 self-center md:self-auto"
                  >
                    编辑个人资料
                  </button>
                </div>
                
                {/* 个人简介 */}
                {user.bio && (
                  <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-2xl">{user.bio}</p>
                )}
                
                {/* 详细信息 */}
                <div className="flex flex-wrap gap-6 mt-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <svg className="h-5 w-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                    {user.email}
                  </div>
                  {user.location && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <svg className="h-5 w-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      {user.location}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <svg className="h-5 w-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                    </svg>
                    注册于 {new Date(user.createdAt).toLocaleDateString("zh-CN")}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        
        {/* 编辑个人资料Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/20 bg-opacity flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">编辑个人资料</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="px-6 py-6">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        用户名
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={editData.username}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="location"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        所在地
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={editData.location || ""}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="城市，国家"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      个人简介
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={editData.bio || ""}
                      onChange={handleEditChange}
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="介绍一下你自己，比如你的烹饪经验或美食偏好..."
                    ></textarea>
                  </div>
                  
                  {/* 美食偏好设置 */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">美食偏好</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                      设置您的美食偏好，我们会根据这些信息为您推荐更符合口味的食谱
                    </p>

                    <div className="space-y-6">
                      {/* 菜系偏好 */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          喜欢的菜系
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "川菜",
                            "粤菜",
                            "鲁菜",
                            "苏菜",
                            "湘菜",
                            "徽菜",
                            "浙菜",
                            "闽菜",
                            "东北菜",
                            "西餐",
                            "日料",
                            "韩餐",
                            "东南亚菜",
                          ].map((cuisine) => (
                            <label key={cuisine} className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={preferences?.favoriteCuisines?.includes(cuisine) || false}
                                onChange={() => handlePreferenceChange("favoriteCuisines", cuisine)}
                                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                              />
                              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                {cuisine}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* 饮食限制 */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          饮食限制
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "素食",
                            "纯素",
                            "无麸质",
                            "无乳糖",
                            "低碳水",
                            "高蛋白",
                            "无坚果",
                            "无海鲜",
                            "无辣",
                          ].map((restriction) => (
                            <label key={restriction} className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={
                                  preferences?.dietaryRestrictions?.includes(restriction) || false
                                }
                                onChange={() =>
                                  handlePreferenceChange("dietaryRestrictions", restriction)
                                }
                                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                              />
                              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                {restriction}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* 餐别偏好 */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          常用餐别
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {["早餐", "午餐", "晚餐", "下午茶", "宵夜", "小吃", "甜点", "饮品"].map(
                            (mealType) => (
                              <label key={mealType} className="inline-flex items-center">
                                <input
                                  type="checkbox"
                                  checked={preferences?.mealTypes?.includes(mealType) || false}
                                  onChange={() => handlePreferenceChange("mealTypes", mealType)}
                                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                                />
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                  {mealType}
                                </span>
                              </label>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        saveUserProfile();
                        setIsModalOpen(false);
                      }}
                      disabled={loading}
                      className="px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          保存中...
                        </div>
                      ) : (
                        "保存更改"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        
        {/* 2. 中部数据统计区 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* 文章数量 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">我的文章</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">12</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <svg className="h-5 w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* 食谱数量 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">我的食谱</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">28</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                <svg className="h-5 w-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* 收藏数量 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">我的收藏</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">45</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <svg className="h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* 关注/粉丝 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">关注 / 粉丝</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">32 / 156</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <svg className="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* 3. 底部内容列表区 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {/* 标签页导航 */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex overflow-x-auto">
              {[
                { id: 'articles', label: '我的文章', icon: '📝' },
                { id: 'recipes', label: '我的食谱', icon: '🍳' },
                { id: 'favorites', label: '我的收藏', icon: '❤️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-300 ${
                    activeTab === tab.id 
                      ? 'border-orange-500 text-orange-500 dark:text-orange-400' 
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          {/* 内容列表 */}
          <div className="p-6">
            {/* 文章列表 */}
            {activeTab === 'articles' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">我的文章</h3>
                
                {/* 文章列表项 */}
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <div className="w-full md:w-40 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={`https://picsum.photos/seed/article${item}/400/200`} 
                          alt="文章封面" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-medium text-gray-900 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                            10道简单又美味的家常菜做法，让你爱上厨房
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2024-05-15</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          在家也能做出餐厅级别的美味佳肴，这些家常菜做法简单易学，食材常见，让你的餐桌更加丰富多彩。
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"></path>
                            </svg>
                            234
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                            </svg>
                            12
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path>
                            </svg>
                            56
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* 查看更多 */}
                <button className="w-full mt-6 py-2 text-center text-sm text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 transition-colors">
                  查看更多文章 →
                </button>
              </div>
            )}
            
            {/* 食谱列表 */}
            {activeTab === 'recipes' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">我的食谱</h3>
                
                {/* 食谱列表项 */}
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <div className="w-full md:w-40 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={`https://picsum.photos/seed/recipe${item}/400/200`} 
                          alt="食谱封面" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-medium text-gray-900 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                            家常红烧肉的完美做法
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2024-05-20</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          肥而不腻，入口即化的红烧肉，传统做法的完美呈现，让你在家也能做出饭店级别的美味。
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                            </svg>
                            30分钟
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 102 0V3a1 1 0 00-1-1zm4 8a4 4 0 10-8 0 4 4 0 008 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"></path>
                            </svg>
                            中等难度
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            4.8
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* 查看更多 */}
                <button className="w-full mt-6 py-2 text-center text-sm text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 transition-colors">
                  查看更多食谱 →
                </button>
              </div>
            )}
            
            {/* 收藏列表 */}
            {activeTab === 'favorites' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">我的收藏</h3>
                
                {/* 收藏列表项 */}
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <div className="w-full md:w-40 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={`https://picsum.photos/seed/favorite${item}/400/200`} 
                          alt="收藏内容封面" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-medium text-gray-900 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                            夏日清爽沙拉的10种创意做法
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2024-04-15</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          炎炎夏日，来一份清爽的沙拉再好不过了。这里有10种创意沙拉做法，让你的味蕾焕然一新。
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            收藏于 2024-05-01
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"></path>
                            </svg>
                            156
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* 查看更多 */}
                <button className="w-full mt-6 py-2 text-center text-sm text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 transition-colors">
                  查看更多收藏 →
                </button>
              </div>
            )}
          </div>
        </div>
        

      </div>
    </div>
  );
};

export default MyPage;
