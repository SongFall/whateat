import React, { useState, useEffect } from 'react';
import { getFollowingList, getFollowersList } from '../../app/services/users/usersApi';

const FollowModal = ({ isOpen, onClose, followingCount, followerCount }) => {
  const [activeTab, setActiveTab] = useState('following');
  const [followingList, setFollowingList] = useState([]);
  const [followersList, setFollowersList] = useState([]);
  const [loading, setLoading] = useState(false);

  // 加载关注列表
  const loadFollowingList = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      const data = await getFollowingList(userId);
      setFollowingList(data);
    } catch (error) {
      console.error('加载关注列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 加载粉丝列表
  const loadFollowersList = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      const data = await getFollowersList(userId);
      setFollowersList(data);
    } catch (error) {
      console.error('加载粉丝列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 切换tab
  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    if (tab === 'following') {
      await loadFollowingList();
    } else {
      await loadFollowersList();
    }
  };

  // 当modal打开时，加载默认tab的数据
  useEffect(() => {
    if (isOpen) {
      loadFollowingList();
    }
  }, [isOpen]);

  // 点击用户项，跳转到他人页面
  const handleUserClick = (userId) => {
    onClose();
    window.location.href = `/my/${userId}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 shadow-lg">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">关注与粉丝</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            <button
              onClick={() => handleTabChange('following')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${activeTab === 'following' ? 'border-b-2 border-orange-500 text-orange-500 dark:text-orange-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            >
              关注 ({followingCount})
            </button>
            <button
              onClick={() => handleTabChange('followers')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${activeTab === 'followers' ? 'border-b-2 border-orange-500 text-orange-500 dark:text-orange-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            >
              粉丝 ({followerCount})
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500 border-solid"></div>
            </div>
          ) : activeTab === 'following' ? (
            <div className="space-y-4">
              {followingList.length > 0 ? (
                followingList.map((item) => {
                  const user = item.following;
                  return (
                    <div 
                      key={user.id} 
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                      onClick={() => handleUserClick(user.id)}
                    >
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.nickname} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            {user.nickname?.charAt(0) || '?'}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.nickname}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.bio || user.email}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400">暂无关注</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {followersList.length > 0 ? (
                followersList.map((item) => {
                  const user = item.follower;
                  return (
                    <div 
                      key={user.id} 
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                      onClick={() => handleUserClick(user.id)}
                    >
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.nickname} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            {user.nickname?.charAt(0) || '?'}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.nickname}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.bio || user.email}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400">暂无粉丝</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowModal;