"use client";
import React, { useState, useEffect } from "react";
import apiClient from "../request/apiClient";
import { getUserProfile, uploadUserAvatar, updateUser, getUserArticles, getUserRecipes, getUserCollections, getUserComments, createUserComment, deleteUserComment, getFollowingCount, getFollowersCount } from "../services/users/usersApi";
import { updateArticle, deleteArticle } from "../services/articles/articlesApi";
import { formatTime } from "../utils/timeUtils";
import FollowModal from "../../components/modal/FollowModal";

// 点赞按钮发光效果样式
const LikeButtonStyle = () => (
  <style jsx global>{`
    .like-button-glow {
      position: relative;
      overflow: hidden;
      box-shadow: 0 0 5px rgba(239, 68, 68, 0.3);
      transition: all 0.3s ease;
    }
    .like-button-glow:hover {
      box-shadow: 0 0 15px rgba(239, 68, 68, 0.5);
    }
    .like-button-glow::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%);
      transform: scale(0);
      animation: pulse 2s infinite;
      pointer-events: none;
    }
    @keyframes pulse {
      0% {
        transform: scale(0);
        opacity: 0.5;
      }
      100% {
        transform: scale(1);
        opacity: 0;
      }
    }
  `}</style>
);

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
  const [articles, setArticles] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarProgress, setAvatarProgress] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [followingCount, setFollowingCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);

  // 加载用户数据
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const userData = await getUserProfile();
        
        // 如果返回null，表示用户未登录，重定向到登录页面
        if (!userData) {
          window.location.href = '/auth';
          return;
        }
        
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
          nickname: userData.nickname,
          avatar: userData.avatar,
          bio: userData.bio,
          location: userData.location,
          email: userData.email,
        });
        
        // 加载用户内容数据
        await loadUserContent(userData.id);
      } catch (err) {
        setError("加载用户数据失败，请稍后重试");
        console.error("Failed to load user data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // 加载用户内容数据
  const loadUserContent = async (userId) => {
    try {
      setContentLoading(true);
      
      // 并行加载文章、食谱、收藏、留言、关注和粉丝数据
      const [articlesData, recipesData, favoritesData, commentsData, following, followers] = await Promise.all([
        getUserArticles(userId),
        getUserRecipes(userId),
        getUserCollections(userId),
        getUserComments(userId),
        getFollowingCount(userId),
        getFollowersCount(userId)
      ]);

      console.log('articlesData:', articlesData);
      console.log('recipesData:', recipesData);
      
      setArticles(articlesData.data);
      setRecipes(recipesData.data || []);
      setFavorites(favoritesData);
      setComments(commentsData);
      setFollowingCount(following);
      setFollowerCount(followers);
    } catch (err) {
      console.error("Failed to load user content:", err);
    } finally {
      setContentLoading(false);
    }
  };

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
      // 确保currentValues是一个数组
      const currentValues = Array.isArray(prev[category]) ? [...prev[category]] : [];
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

  // 打开关注/粉丝modal
  const openFollowModal = () => {
    setIsFollowModalOpen(true);
  };

  // 处理留言提交
  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    
    try {
      setIsCommenting(true);
      // 调用API提交留言
      const userId = localStorage.getItem('userId');
      const newComment = await createUserComment(userId, commentText);
      // 检查newComment是否存在
      if (newComment) {
        // 成功后更新留言列表，确保prev是数组
        setComments(prev => [newComment, ...(Array.isArray(prev) ? prev : [])]);
        setCommentText('');
      }
    } catch (err) {
      console.error("Failed to submit comment:", err);
    } finally {
      setIsCommenting(false);
    }
  };

  // 处理留言删除
  const handleDeleteComment = async (commentId) => {
    try {
      // 调用API删除留言
      await deleteUserComment(commentId);
      // 成功后更新留言列表，过滤掉被删除的留言
      setComments(prev => (Array.isArray(prev) ? prev.filter(comment => comment.id !== commentId) : []));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  // 处理文章删除
  const handleDeleteArticle = async (articleId) => {
    try {
      // 调用API删除文章
      await deleteArticle(articleId);
      // 成功后更新文章列表，过滤掉被删除的文章
      setArticles(prev => (Array.isArray(prev) ? prev.filter(article => article.id !== articleId) : []));
    } catch (err) {
      console.error("Failed to delete article:", err);
      alert('删除文章失败，请稍后重试');
    }
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

      // 准备更新数据
      const updateData = { ...editData };

      // 调用API更新用户资料，包含偏好设置
      await updateUser(userId, {
        ...updateData,
        preferences: JSON.stringify(preferences)
      });

      // 更新本地用户数据
      const updatedUser = {
        ...user,
        ...updateData,
        preferences,
      };
      setUser(updatedUser);

      // 更新localStorage中的用户信息，确保header组件的头像同步更新
      const existingUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const updatedUserInfo = {
        ...existingUserInfo,
        avatar: updatedUser.avatar,
        username: updatedUser.username || existingUserInfo.username,
        nickname: updatedUser.nickname || existingUserInfo.nickname,
      };
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

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
  if (!user) {
    // 如果user为null，不渲染任何内容，等待重定向
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <LikeButtonStyle />
      
      {/* 关注/粉丝modal */}
      <FollowModal 
        isOpen={isFollowModalOpen} 
        onClose={() => setIsFollowModalOpen(false)}
        followingCount={followingCount}
        followerCount={followerCount}
      />
      {/* 主内容区域 */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 1. 顶部个人信息展示区 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-8">
          
          {/* 用户信息 */}
          <div className="px-6 py-5">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* 头像 */}
              <div className="w-32 h-32 rounded-full bg-white dark:bg-gray-700 border-4 border-white dark:border-gray-800 overflow-hidden shadow-lg">
                <img src={user.avatar} alt={user.nickname} className="w-full h-full object-cover" />
              </div>
              
              {/* 基本信息 */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.nickname}</h1>
                  </div>
                  <div className="flex gap-3 self-center md:self-auto">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    >
                      编辑个人资料
                    </button>
                    <button
                      className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 self-center md:self-auto like-button-glow"
                    >
                      <div className="flex items-center gap-1">
                        <svg className="h-4 w-4 text-red-500" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{user.likeCount || 0}</span>
                      </div>
                    </button>
                  </div>
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
                  {/* 头像上传 */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-24 h-24 rounded-full bg-white dark:bg-gray-700 border-4 border-white dark:border-gray-800 overflow-hidden shadow-lg mb-4">
                      <img 
                        src={editData.avatar} 
                        alt={editData.nickname} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <label className="text-white text-sm font-medium cursor-pointer">
                          更换头像
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden"
                            onChange={async (e) => {
                              if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                
                                // 显示上传中状态
                                setAvatarUploading(true);
                                setAvatarProgress(0);
                                
                                try {
                                  const formData = new FormData();
                                  formData.append('file', file);
                                  
                                  // 直接上传到阿里云
                                  const response = await apiClient.upload('/upload/file', formData, {
                                    onUploadProgress: (progressEvent) => {
                                      const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                                      setAvatarProgress(percent);
                                    }
                                  });
                                  
                                  // 上传成功
                                  if (response.success) {
                                    setEditData((prev) => ({
                                      ...prev,
                                      avatar: response.data.url
                                    }));
                                  }
                                } catch (error) {
                                  console.error('上传头像失败:', error);
                                  // 可以添加错误提示
                                } finally {
                                  setAvatarUploading(false);
                                }
                              }
                            }}
                          />
                        </label>
                      </div>
                      
                      {/* 上传中遮罩 */}
                      {avatarUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                          <div className="relative w-20 h-20">
                            {/* 圆形进度条 */}
                            <svg className="w-full h-full transform -rotate-90">
                              <circle
                                cx="40"
                                cy="40"
                                r="36"
                                stroke="rgba(255,255,255,0.3)"
                                strokeWidth="8"
                                fill="none"
                              />
                              <circle
                                cx="40"
                                cy="40"
                                r="36"
                                stroke="white"
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 36}`}
                                strokeDashoffset={`${2 * Math.PI * 36 * (1 - avatarProgress / 100)}`}
                                strokeLinecap="round"
                                className="transition-all duration-300"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-white font-medium">
                              {avatarProgress}%
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      点击头像上传新头像
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label
                        htmlFor="nickname"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        昵称
                      </label>
                      <input
                        type="text"
                        id="nickname"
                        name="nickname"
                        value={editData.nickname || ""}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="您的昵称"
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
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{articles.length}</h3>
              </div>
              <div className="flex items-center gap-2">
                
                <a href="/article/add" className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center hover:bg-orange-200 dark:hover:bg-orange-800/30 transition-colors">
                  <svg className="h-5 w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* 食谱数量 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">我的食谱</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{recipes.length || '0'}</h3>
              </div>
              <a href="/uploadpage" className="hover:bg-pink-200 dark:hover:bg-pink-800/30 w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                <svg className="h-5 w-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* 收藏数量 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">我的收藏</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{favorites.length}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <svg className="h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* 关注/粉丝 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={openFollowModal}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">关注 / 粉丝</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{followingCount} / {followerCount}</h3>
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
                { id: 'favorites', label: '我的收藏', icon: '❤️' },
                { id: 'comments', label: '我的留言', icon: '💬' }
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
                  {contentLoading ? (
                    <div className="flex justify-center py-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 border-solid"></div>
                    </div>
                  ) : articles.length > 0 ? (
                    articles.map((article) => (
                      <div key={article.id} className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                        <div className="w-full md:w-40 h-24 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => window.open(`/article/${article.id}`, '_blank')}>
                          <img 
                            src={article.coverImage} 
                            alt={article.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between">
                            <h4 className="text-base font-medium text-gray-900 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors cursor-pointer" onClick={() => window.open(`/article/${article.id}`, '_blank')}>
                              {article.title}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1 cursor-pointer" onClick={() => window.open(`/article/${article.id}`, '_blank')}>
                            {article.excerpt}
                          </p>
                          </div>
                          <div className="flex justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"></path>
                              </svg>
                              {article.viewCount || 0}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                              </svg>
                              {article.commentCount || 0}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path>
                              </svg>
                              {article.shareCount || 0}
                            </span>
                          </div>
                            <div className="flex items-center gap-4">
                              <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(article.createdAt).toLocaleDateString("zh-CN")}</span>
                              <div className="flex items-center gap-2">
                                <button 
                                  className="text-xs text-gray-500 hover:text-blue-500 transition-colors flex items-center gap-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`/article/edit/${article.id}`, '_blank');
                                  }}
                                >
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                  编辑
                                </button>
                                <button 
                                  className="text-xs text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm('确定要删除这篇文章吗？')) {
                                      handleDeleteArticle(article.id);
                                    }
                                  }}
                                >
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  删除
                                </button>
                              </div>
                            </div>
                          </div>
                        
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500 dark:text-gray-400">暂无文章</p>
                    </div>
                  )}
                </div>
                
                {/* 去创作 */}
                <div className="flex justify-center">
                  <a href="/article/add" className="w-full mt-6 py-2 text-center text-sm text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 transition-colors">
                  去创作 →
                </a>
                </div>
              </div>
            )}
            
            {/* 食谱列表 */}
            {activeTab === 'recipes' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">我的食谱</h3>
                
                {/* 食谱列表项 */}
                <div className="space-y-4">
                  {contentLoading ? (
                    <div className="flex justify-center py-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 border-solid"></div>
                    </div>
                  ) : recipes.length > 0 ? (
                    recipes.map((recipe) => (
                      <div key={recipe.id} className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors" onClick={() => window.open(`/recipe/${recipe.id}`, '_blank')}>
                        <div className="w-full md:w-40 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={recipe.coverImage} 
                            alt={recipe.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-base font-medium text-gray-900 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                              {recipe.title}
                            </h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(recipe.createdAt).toLocaleDateString("zh-CN")}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {recipe.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                              </svg>
                              {recipe.cookTime}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 102 0V3a1 1 0 00-1-1zm4 8a4 4 0 10-8 0 4 4 0 008 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"></path>
                              </svg>
                              {recipe.difficulty}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                              </svg>
                              {recipe.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500 dark:text-gray-400">暂无食谱</p>
                    </div>
                  )}
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
                  {contentLoading ? (
                    <div className="flex justify-center py-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 border-solid"></div>
                    </div>
                  ) : favorites.length > 0 ? (
                    favorites.map((favorite) => (
                      <div key={favorite.id} className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors" onClick={() => window.open(`/article/${favorite.article?.id || favorite.recipe?.id}`, '_blank')}>
                        <div className="w-full md:w-40 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={favorite.recipe?.coverImage || favorite.article?.coverImage || 'https://picsum.photos/seed/default/400/200'} 
                            alt={favorite.recipe?.title || favorite.article?.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-base font-medium text-gray-900 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                              {favorite.recipe?.title || favorite.article?.title}
                            </h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(favorite.recipe?.createdAt || favorite.article?.createdAt).toLocaleDateString("zh-CN")}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {favorite.recipe?.description || favorite.article?.content}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                              </svg>
                              收藏于 {new Date(favorite.createdAt).toLocaleDateString("zh-CN")}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"></path>
                              </svg>
                              {favorite.recipe?.viewCount || favorite.article?.viewCount || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500 dark:text-gray-400">暂无收藏</p>
                    </div>
                  )}
                </div>
                
                {/* 查看更多 */}
                <button className="w-full mt-6 py-2 text-center text-sm text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 transition-colors">
                  查看更多收藏 →
                </button>
              </div>
            )}
            
            {/* 留言列表 */}
            {activeTab === 'comments' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">我的留言</h3>
                
                {/* 留言输入框 */}
                <div className="mb-6">
                  <textarea 
                    className="w-full min-h-[120px] px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-colors"
                    placeholder="留下你的留言..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  ></textarea>
                  <div className="mt-3 flex justify-end">
                    <button 
                      onClick={handleCommentSubmit}
                      disabled={isCommenting || !commentText.trim()}
                      className="px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCommenting ? '提交中...' : '发表留言'}
                    </button>
                  </div>
                </div>
                
                {/* 留言列表 */}
                <div>
                  {contentLoading ? (
                    <div className="flex justify-center py-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 border-solid"></div>
                    </div>
                  ) : comments.length > 0 ? (
                                      comments.map((comment) => (
                                        <div key={comment.id} className="flex gap-4 py-6 border-b border-gray-200 dark:border-gray-700">
                                          <div className="flex flex-row justify-between">
                                              <div className="relative shrink-0 w-10 h-10 rounded-full overflow-hidden">
                                            <img 
                                              src={comment.user.avatar} 
                                              alt={comment.user.nickname}
                                              className="w-full h-full object-cover"
                                            />
                                          </div>
                                          </div>
                                          
                                          <div className="flex-1">
                                              <div className="flex justify-between">
                                                  <div className="flex justify-start gap-2 items-center">
                                                      <h5 className="font-medium text-gray-900 dark:text-gray-100">{comment.user.nickname}</h5>
                                                      <span className="text-gray-500 dark:text-gray-400">{formatTime(comment.createdAt)}</span>
                                                  </div>
                                                  <div>
                                                      <button 
                                                          className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
                                                          onClick={() => handleDeleteComment(comment.id)}
                                                      >
                                                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                          </svg>
                                                          <span>删除</span>
                                                      </button>
                                                  </div>
                                              </div>
                                            <p className="mt-2 text-gray-700 dark:text-gray-300">
                                              {comment.content}
                                            </p>
                                            
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-center py-10">
                                        <p className="text-gray-500 dark:text-gray-400">暂无留言，快来成为第一个留言的人吧！</p>
                                      </div>
                                    )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MyPage;
