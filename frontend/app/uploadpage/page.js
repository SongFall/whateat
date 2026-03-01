"use client";

import ImageUploader from "@/components/uploader/uploader";
import { useState } from "react";
import apiClient from "@/app/request/apiClient";

export default function CookingPage() {
  const [formData, setFormData] = useState({
    ingredients: "",
    cuisine: "",
    taste: "",
    cookingMethod: "",
    difficulty: "",
    prepTime: "",
    cookTime: "",
    servings: "",
    notes: ""
  });
  const [recipeImages, setRecipeImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // 菜系选项
  const cuisineOptions = [
    "中餐", "西餐", "日料", "韩料", "泰料", "意料", "法料", "其他"
  ];

  // 口味选项
  const tasteOptions = [
    "甜", "咸", "酸", "辣", "苦", "鲜", "麻", "香"
  ];

  // 做法选项
  const cookingMethodOptions = [
    "炒", "煮", "蒸", "炸", "烤", "炖", "煎", "拌", "烧"
  ];

  // 难度选项
  const difficultyOptions = [
    "简单", "中等", "复杂"
  ];

  const handleImageUpload = async (imageInfo) => {
    setRecipeImages(prev => [...prev, imageInfo]);
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 发送到后端API
      const response = await apiClient.post("/ai/generate-recipe", {
        ingredients: formData.ingredients,
        imageUrls: recipeImages.map(img => img.url),
        taste: formData.taste
      });
      console.log("食谱生成成功:", response);
      setSuccess(true);
      
      // 跳转到食谱详情页
      setTimeout(() => {
        console.log("Attempting to redirect...");
        if (response.recipeId) {
          console.log("Redirecting to:", `/recipe/${response.recipeId}`);
          window.location.href = `/recipe/${response.recipeId}`;
        } else if (response.data && response.data.recipeId) {
          console.log("Redirecting to:", `/recipe/${response.data.recipeId}`);
          window.location.href = `/recipe/${response.data.recipeId}`;
        } else {
          console.log("No recipeId found in response");
        }
      }, 1500);
      
      // 重置表单
      setTimeout(() => {
        setSuccess(false);
        setFormData({
          ingredients: "",
          cuisine: "",
          taste: "",
          cookingMethod: "",
          difficulty: "",
          prepTime: "",
          cookTime: "",
          servings: "",
          notes: ""
        });
        setRecipeImages([]);
      }, 3000);
    } catch (error) {
      console.error("食谱生成失败:", error);
      alert("食谱生成失败，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* 顶部标题区域 */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            🍳 美食实验室
          </h1>
          <p className="text-xl sm:text-2xl max-w-2xl mx-auto text-amber-100">
            上传图片，输入食材，让AI为你生成专属美食创意
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
                <h3 className="font-semibold text-green-800 text-lg">食谱生成成功！</h3>
                <p className="text-green-600">正在为你跳转到食谱详情页...</p>
              </div>
            </div>
          </div>
        )}

        {/* 表单卡片 */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-10">
            {/* 图片上传 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">上传美食参考图片</h2>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-amber-300 transition-colors duration-300">
                <ImageUploader onUploadComplete={handleImageUpload} />
              </div>
            </div>

            {/* 食材输入 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">食材清单</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    输入食材（用逗号分隔）
                  </label>
                  <textarea
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleChange}
                    placeholder="例如：鸡蛋, 面粉, 牛奶, 糖, 黄油"
                    rows={4}
                    className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none shadow-sm"
                  ></textarea>
                  <p className="mt-2 text-sm text-gray-500">
                    请尽可能详细地列出你想使用的食材，这将帮助AI生成更准确的食谱
                  </p>
                </div>
              </div>
            </div>

            {/* 菜系、烹饪方式、口味偏好 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 菜系 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">菜系</h3>
                <select
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm"
                >
                  <option value="">请选择</option>
                  {cuisineOptions.map(cuisine => (
                    <option key={cuisine} value={cuisine}>{cuisine}</option>
                  ))}
                </select>
              </div>
              
              {/* 烹饪方法 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">烹饪方式</h3>
                <select
                  name="cookingMethod"
                  value={formData.cookingMethod}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm"
                >
                  <option value="">请选择</option>
                  {cookingMethodOptions.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>
              
              {/* 口味偏好 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">口味偏好</h3>
                <select
                  name="taste"
                  value={formData.taste}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm"
                >
                  <option value="">请选择</option>
                  {tasteOptions.map(taste => (
                    <option key={taste} value={taste}>{taste}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 烹饪信息 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">难度</h3>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm"
                >
                  <option value="">请选择</option>
                  {difficultyOptions.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">准备时间</h3>
                <input
                  type="text"
                  name="prepTime"
                  value={formData.prepTime}
                  onChange={handleChange}
                  placeholder="例如：15分钟"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm"
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">烹饪时间</h3>
                <input
                  type="text"
                  name="cookTime"
                  value={formData.cookTime}
                  onChange={handleChange}
                  placeholder="例如：20分钟"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm"
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">份量</h3>
                <input
                  type="text"
                  name="servings"
                  value={formData.servings}
                  onChange={handleChange}
                  placeholder="例如：2人份"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm"
                />
              </div>
            </div>

            {/* 备注 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">特殊要求</h3>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="添加其他烹饪要求或偏好，例如：不要辣、少盐、素食等..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none shadow-sm"
              ></textarea>
            </div>

            {/* 提交按钮 */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting || !formData.ingredients.trim()}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>生成中...</span>
                  </div>
                ) : (
                  "生成专属食谱"
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
}
