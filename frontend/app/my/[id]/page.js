"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getUserProfile, getUserArticles, getUserRecipes, getUserComments, createUserComment, deleteUserComment, getFollowingCount, getFollowersCount, followUser, unfollowUser, checkFollowingStatus, likeUser, unlikeUser } from "../../services/users/usersApi";
import { formatTime } from "../../utils/timeUtils";

// 点赞动画样式
const LikeAnimationStyle = () => (
  <style jsx global>{`
    .like-button {
      position: relative;
      overflow: hidden;
    }
    .like-animation {
      animation: like-pop 0.6s ease-in-out;
    }
    @keyframes like-pop {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.2);
      }
      100% {
        transform: scale(1);
      }
    }
    .like-animation svg {
      animation: like-color 0.6s ease-in-out;
    }
    @keyframes like-color {
      0% {
        filter: brightness(1);
      }
      50% {
        filter: brightness(1.5) saturate(1.5);
      }
      100% {
        filter: brightness(1);
      }
    }
  `}</style>
);

const UserDetailPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('articles'); // articles, recipes, comments
  const [articles, setArticles] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [comments, setComments] = useState([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  // 加载用户数据
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const userData = await getUserProfile(id);
        
        // 如果返回null，表示用户不存在
        if (!userData) {
          setError("用户不存在");
          return;
        }
        
        // 获取关注和粉丝数量
        const [followingCount, followersCount] = await Promise.all([
          getFollowingCount(id),
          getFollowersCount(id)
        ]);
        
        // 检查当前用户是否已关注该用户
        const currentUserId = localStorage.getItem('userId');
        let followingStatus = false;
        if (currentUserId && currentUserId !== id) {
          const status = await checkFollowingStatus(currentUserId, id);
          followingStatus = status.isFollowing || false;
        }
        
        // 更新用户数据，添加关注和粉丝数量
        const updatedUserData = {
          ...userData,
          followingCount,
          followerCount: followersCount
        };
        
        setUser(updatedUserData);
        setLikeCount(userData.likeCount || 0);
        setIsFollowing(followingStatus);
        
        // 加载用户内容数据
        await loadUserContent(id);
      } catch (err) {
        setError("加载用户数据失败，请稍后重试");
        console.error("Failed to load user data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [id]);

  // 加载用户内容数据
  const loadUserContent = async (userId) => {
    try {
      setContentLoading(true);
      
      // 并行加载文章、食谱和评论数据
      const [articlesData, recipesData, commentsData] = await Promise.all([
        getUserArticles(userId),
        getUserRecipes(userId),
        getUserComments(userId)
      ]);

      setArticles(articlesData.data || []);
      setRecipes(recipesData.data || []);
      setComments(commentsData || []);
    } catch (err) {
      console.error("Failed to load user content:", err);
    } finally {
      setContentLoading(false);
    }
  };

  // 处理关注/取消关注
  const handleFollow = async () => {
    const currentUserId = localStorage.getItem('userId');
    if (!currentUserId) {
      // 未登录，跳转到登录页
      window.location.href = '/auth';
      return;
    }

    try {
      setIsFollowingLoading(true);
      if (isFollowing) {
        // 取消关注
        await unfollowUser(currentUserId, id);
        // 更新关注数量
        setUser(prev => ({
          ...prev,
          followerCount: Math.max(0, prev.followerCount - 1)
        }));
      } else {
        // 关注
        await followUser(currentUserId, id);
        // 更新关注数量
        setUser(prev => ({
          ...prev,
          followerCount: prev.followerCount + 1
        }));
      }
      // 更新关注状态
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('关注操作失败:', error);
      // 操作失败，恢复原状态
      setIsFollowing(isFollowing);
    } finally {
      setIsFollowingLoading(false);
    }
  };

  // 处理点赞
  const handleLike = async () => {
    const currentUserId = localStorage.getItem('userId');
    if (!currentUserId) {
      // 未登录，跳转到登录页
      window.location.href = '/auth';
      return;
    }

    try {
      setIsLikeLoading(true);
      // 点赞
      await likeUser(id);
      // 更新点赞数量
      setLikeCount(prev => prev + 1);
      // 添加点赞动画效果
      const likeButton = document.querySelector('.like-button');
      if (likeButton) {
        likeButton.classList.add('like-animation');
        setTimeout(() => {
          likeButton.classList.remove('like-animation');
        }, 600);
      }
    } catch (error) {
      console.error('点赞操作失败:', error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  // 处理留言提交
  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    
    try {
      setIsCommenting(true);
      // 调用API提交留言
      const newComment = await createUserComment(id, commentText);
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

  // 渲染加载状态
  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">加载用户信息...</p>
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
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <LikeAnimationStyle />
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
                      onClick={handleFollow}
                      disabled={isFollowingLoading}
                      className={`px-4 py-1 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed ${
                        isFollowing 
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          : 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 focus:ring-orange-500'
                      }`}
                    >
                      {isFollowingLoading ? '处理中...' : (isFollowing ? '已关注' : '关注')}
                    </button>
                    <button
                      onClick={handleLike}
                      disabled={isLikeLoading}
                      className="like-button px-4 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center gap-1">
                        {isLikeLoading ? (
                          <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500"></div>
                        ) : (
                          <svg className="h-4 w-4 text-red-500" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        )}
                        <span>{likeCount}</span>
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
        
        {/* 2. 中部数据统计区 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* 文章数量 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">文章数量</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{articles.length}</h3>
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
                <p className="text-sm text-gray-500 dark:text-gray-400">食谱数量</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{recipes.length || '0'}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                <svg className="h-5 w-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* 关注数量 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">关注</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{user.followingCount || 0}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <svg className="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* 粉丝数量 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">粉丝</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{user.followerCount || 0}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* 3. 底部内容列表区 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-8">
          {/* 标签页导航 */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex overflow-x-auto">
              {
                [
                  { id: 'articles', label: '文章', icon: '📝' },
                  { id: 'recipes', label: '食谱', icon: '🍳' },
                  { id: 'comments', label: '留言板', icon: '💬' }
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
                ))
              }
            </div>
          </div>
          
          {/* 内容列表 */}
          <div className="p-6">
            {/* 文章列表 */}
            {activeTab === 'articles' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{user.nickname}的文章</h3>
                
                {/* 文章列表项 */}
                <div className="space-y-4">
                  {contentLoading ? (
                    <div className="flex justify-center py-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 border-solid"></div>
                    </div>
                  ) : articles.length > 0 ? (
                    articles.map((article) => (
                      <div key={article.id} className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors" onClick={() => window.open(`/article/${article.id}`, '_blank')}>
                        <div className="w-full md:w-40 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={article.coverImage} 
                            alt={article.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-base font-medium text-gray-900 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                              {article.title}
                            </h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(article.createdAt).toLocaleDateString("zh-CN")}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
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
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500 dark:text-gray-400">暂无文章</p>
                    </div>
                  )}
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{user.nickname}的食谱</h3>
                
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
            
            {/* 留言板 */}
            {activeTab === 'comments' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">留言板</h3>
                
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
                  {comments.length > 0 ? (
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
                                    {localStorage.getItem('userId') == comment.user.id && (
                                    <button 
                                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
                                        onClick={() => handleDeleteComment(comment.id)}
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        <span>删除</span>
                                    </button>
                                )}
                                </div>
                            </div>
                          <p className="mt-3 text-gray-700 dark:text-gray-300">
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

export default UserDetailPage;