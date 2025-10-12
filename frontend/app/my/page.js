"use client";
import React, { useState, useEffect } from "react";
import { getUserProfile } from "../services/api";

const MyPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [preferences, setPreferences] = useState({
    favoriteCuisines: [],
    dietaryRestrictions: [],
    mealTypes: [],
  });
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
          name: userData.name,
          avatar: userData.avatar,
          bio: userData.bio,
          location: userData.location,
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

      // 这里应该调用API保存用户资料
      console.log("保存用户资料:", editData, preferences);

      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 更新本地用户数据
      setUser((prev) => ({
        ...prev,
        ...editData,
        preferences,
      }));

      setIsEditing(false);
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
    <div className="container dark:bg-gray-900 flex flex-col">
      {/* 主内容区域 - 使用flex-1占据剩余高度 */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧用户信息卡片 */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
              <div className="relative h-32 bg-gradient-to-r from-blue-500 to-violet-600">
                {/* 背景图占位 */}
              </div>

              <div className="px-6 py-5 -mt-12">
                <div className="flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-700 border-4 border-white dark:border-gray-800 overflow-hidden">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="text-center mt-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">美食爱好者</p>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                      <svg
                        className="h-5 w-5 text-blue-600 dark:text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.email}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">邮箱</div>
                    </div>
                  </div>

                  {user.location && (
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                        <svg
                          className="h-5 w-5 text-green-600 dark:text-green-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.location}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">所在地</div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg hover:from-blue-700 hover:to-violet-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    {isEditing ? "取消" : "编辑个人资料"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧内容区域 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 个人资料编辑表单 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">基本资料</h3>
              </div>

              <div className="px-6 py-5">
                {isEditing ? (
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          用户名
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={editData.name}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="介绍一下你自己，比如你的烹饪经验或美食偏好..."
                      ></textarea>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={saveUserProfile}
                        disabled={loading}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg hover:from-blue-700 hover:to-violet-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
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
                ) : (
                  <div className="space-y-4">
                    {user.bio && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          个人简介
                        </h4>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">{user.bio}</p>
                      </div>
                    )}

                    {/* 其他基本信息 */}
                    <div className="pt-2">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        账号创建时间
                      </h4>
                      <p className="mt-1 text-gray-600 dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString("zh-CN")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 美食偏好设置 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">美食偏好</h3>
              </div>

              <div className="px-6 py-5">
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
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
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
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
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
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
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

                {/* 保存偏好按钮 */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={saveUserProfile}
                    disabled={loading}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg hover:from-blue-700 hover:to-violet-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        保存中...
                      </div>
                    ) : (
                      "保存偏好"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
