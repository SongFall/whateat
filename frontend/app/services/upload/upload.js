import apiClient from "@/app/request/apiClient";

// 获取上传凭证
export const getUploadToken = async (fileName, expireSeconds) => {
  try {
    const params = {};
    if (fileName) params.key = fileName;
    if (expireSeconds) params.expires = expireSeconds;

    const response = await apiClient.get("/upload/token", params);
    return response;
  } catch (error) {
    console.error("获取上传凭证失败:", error);
    throw new Error(error.message || "获取上传凭证失败");
  }
};

// 使用后端接口实现带进度监听的上传
export const uploadToAliyun = async (file, onProgress) => {
  try {
    // 1. 准备FormData
    const formData = new FormData();
    formData.append("file", file);

    // 2. 使用XMLHttpRequest实现带进度监听的上传到后端
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // 监听上传进度
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.round((event.loaded * 100) / event.total);
          onProgress(percent);
        }
      });

      // 监听完成事件
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              resolve(response.data);
            } else {
              reject(new Error(response.message || "上传失败"));
            }
          } catch (parseError) {
            reject(new Error("解析上传响应失败"));
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            reject(new Error(errorData.message || `上传失败: ${xhr.status}`));
          } catch (e) {
            reject(new Error(`上传失败: ${xhr.status}`));
          }
        }
      });

      // 监听错误事件
      xhr.addEventListener("error", () => {
        reject(new Error("网络错误，上传失败"));
      });

      // 监听超时事件
      xhr.addEventListener("timeout", () => {
        reject(new Error("上传超时"));
      });

      // 发送请求到后端上传接口
      xhr.open("POST", "http://localhost:3001/upload/file");
      xhr.send(formData);
    });
  } catch (error) {
    console.error("文件上传失败:", error);
    throw new Error(error.message || "文件上传失败");
  }
};

// 导出上传服务对象
export const uploadService = {
  getUploadToken,
  uploadToAliyun,
};
