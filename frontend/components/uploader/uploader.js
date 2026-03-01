"use client";

import { useState } from "react";
import apiClient from "@/app/request/apiClient";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ImageUploader({ onUploadComplete }) {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  const MAX_IMAGES = 3;

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const remainingSlots = MAX_IMAGES - images.length;
    const filesToAdd = selectedFiles.slice(0, remainingSlots);

    if (filesToAdd.length === 0) {
      setError(`最多只能上传 ${MAX_IMAGES} 张图片`);
      return;
    }

    setError(null);

    // 处理每个文件
    filesToAdd.forEach((file) => {
      const imageItem = {
        id: Date.now() + Math.random(), // 生成唯一ID
        file,
        previewUrl: URL.createObjectURL(file),
        isUploading: true,
        progress: 0,
        url: null
      };

      // 添加到图片列表
      setImages(prev => [...prev, imageItem]);

      // 直接上传
      uploadImage(imageItem);
    });
  };

  const uploadImage = async (imageItem) => {
    try {
      const formData = new FormData();
      formData.append('file', imageItem.file);

      // 使用 apiClient.upload 方法上传文件
      const response = await apiClient.upload('/upload/file', formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setImages(prev => prev.map(img => 
            img.id === imageItem.id 
              ? { ...img, progress: percent }
              : img
          ));
        }
      });

      // 上传成功
      if (response.success) {
        const uploadedImage = {
          ...imageItem,
          isUploading: false,
          url: response.data.url
        };

        setImages(prev => prev.map(img => 
          img.id === imageItem.id 
            ? uploadedImage
            : img
        ));

        // 调用回调函数
        if (onUploadComplete) {
          onUploadComplete(uploadedImage);
        }
      }
    } catch (err) {
      setError('上传失败，请重试');
      setImages(prev => prev.filter(img => img.id !== imageItem.id));
    }
  };

  const handleDeleteImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* 图片预览和上传进度 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 已上传的图片 */}
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={image.previewUrl} 
                alt={`预览 ${index + 1}`} 
                className="w-full h-full object-cover"
              />
              
              {/* 上传中遮罩 */}
              {image.isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
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
                        strokeDashoffset={`${2 * Math.PI * 36 * (1 - image.progress / 100)}`}
                        strokeLinecap="round"
                        className="transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-white font-medium">
                      {image.progress}%
                    </div>
                  </div>
                </div>
              )}
              
              {/* 删除按钮 */}
              <button
                onClick={() => handleDeleteImage(index)}
                className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          </div>
        ))}
        
        {/* 上传按钮 */}
        {images.length < MAX_IMAGES && (
          <div className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center hover:border-amber-300 hover:bg-gray-50 transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center justify-center p-4"
            >
              <div className="p-3 bg-amber-50 rounded-full mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600 text-center">
                点击上传<br />({images.length}/{MAX_IMAGES})
              </p>
            </label>
          </div>
        )}
      </div>

      {/* 错误提示 */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
