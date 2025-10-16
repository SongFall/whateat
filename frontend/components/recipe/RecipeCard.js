import React from "react";

/**
 * 菜谱卡片组件
 * @param {Object} props
 * @param {Object} props.recipe - 菜谱数据
 * @param {number} props.recipe.id - 菜谱ID
 * @param {string} props.recipe.title - 菜谱标题
 * @param {string} props.recipe.description - 菜谱描述
 * @param {string} props.recipe.imageUrl - 菜谱图片URL
 * @param {string} props.recipe.prepTime - 准备时间
 * @param {string} props.recipe.cookTime - 烹饪时间
 * @param {string} props.recipe.difficulty - 难度级别
 * @param {Array} props.recipe.tags - 标签数组
 */
const RecipeCard = ({ recipe }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
      {/* 菜谱图片 */}
      <div className="h-48 overflow-hidden bg-gray-200">
        <img
          src={recipe.imageUrl || "/default-recipe.jpg"}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* 菜谱信息 */}
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 line-clamp-1">{recipe.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>

        {/* 元信息标签 */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
            ⏱️ {recipe.prepTime}
          </span>
          <span className="px-2 py-1 bg-orange-50 text-orange-600 text-xs rounded-full">
            🍳 {recipe.cookTime}
          </span>
          <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full">
            🥄 {recipe.difficulty}
          </span>
        </div>

        {/* 菜谱标签 */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {recipe.tags.map((tag, index) => (
              <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
