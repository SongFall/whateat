"use client";

import { useState } from "react";
import { uploadToQiniu } from "@/app/services/upload/upload";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ImageUploader({ onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      const result = await uploadToQiniu(file, (percent) => {
        setProgress(percent);
      });

      // 上传完成后调用回调函数，传递文件信息
      if (onUploadComplete) {
        onUploadComplete(result);
      }

      // 可以在这里重置状态或显示成功消息
      alert("上传成功！");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 文件选择区域 */}
      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center justify-center"
        >
          <div className="p-4 bg-blue-50 rounded-full mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-blue-600"
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
          <p className="text-sm text-gray-600">点击上传图片或拖放文件到此处</p>
        </label>
      </div>

      {/* 预览区域 */}
      {previewUrl && (
        <div className="flex justify-center">
          <img src={previewUrl} alt="预览" className="max-h-48 object-contain rounded" />
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 上传进度 */}
      {isUploading && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-500 text-center">正在上传: {progress}%</p>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex justify-center">
        <Button onClick={handleUpload} disabled={!file || isUploading} className="px-6">
          {isUploading ? "上传中..." : "开始上传"}
        </Button>
      </div>
    </div>
  );
}
