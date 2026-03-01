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
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-50 hover:border-gray-200" onClick={() => window.location.href = `/recipe/${recipe.id}`}>
      {/* 菜谱图片 */}
      <div className="relative h-56 overflow-hidden bg-gray-100">
        <img
          src={recipe.coverImage || "https://neeko-copilot.bytedance.net/api/text2image?prompt=delicious%20food%20dish%20with%20appetizing%20presentation&size=800x600"}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <div className="text-white">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
              查看详情
            </span>
          </div>
        </div>
      </div>

      {/* 菜谱信息 */}
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2 line-clamp-1 text-gray-900 group-hover:text-amber-600 transition-colors duration-300">{recipe.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{recipe.description}</p>

        {/* 元信息标签 */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
            ⏱️ {recipe.prepTime}
          </span>
          <span className="px-3 py-1.5 bg-orange-50 text-orange-700 text-xs font-medium rounded-full">
            🍳 {recipe.cookTime}
          </span>
          <span className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">
            🥄 {recipe.difficulty}
          </span>
        </div>

        {/* 菜谱标签 */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {recipe.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-full border border-gray-100">
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
