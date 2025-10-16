"use client";

import ImageUploader from "@/components/uploader/uploader";
import { useState } from "react";
import apiClient from "@/app/request/apiClient";

export default function RecipeUploadPage() {
  const [recipeImage, setRecipeImage] = useState(null);

  const handleImageUpload = async (imageInfo) => {
    // 保存图片信息到状态
    setRecipeImage(imageInfo);

    // 可选：将图片信息保存到后端数据库
    try {
      await apiClient.post("/recipes/images", {
        imageUrl: imageInfo.url,
        imageKey: imageInfo.key,
        // 可以添加其他相关信息
      });
    } catch (error) {
      console.error("保存图片信息失败:", error);
      alert("图片上传成功，但保存信息失败");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">上传食谱图片</h1>
      <ImageUploader onUploadComplete={handleImageUpload} />

      {recipeImage && (
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-medium text-green-800">图片信息</h3>
          <p>URL: {recipeImage.url}</p>
          <p>Key: {recipeImage.key}</p>
        </div>
      )}
    </div>
  );
}
