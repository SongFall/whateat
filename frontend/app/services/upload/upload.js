import apiClient from "@/app/request/apiClient";

// 获取上传凭证
export const getUploadToken = async (fileName, expireSeconds) => {
  try {
    const params = {};
    if (fileName) params.fileName = fileName;
    if (expireSeconds) params.expireSeconds = expireSeconds;

    const response = await apiClient.get("/upload/token", params);
    return response;
  } catch (error) {
    console.error("获取上传凭证失败:", error);
    throw new Error(error.data?.message || "获取上传凭证失败");
  }
};

// 使用XMLHttpRequest实现带进度监听的上传
export const uploadToQiniu = async (file, onProgress) => {
  try {
    // 1. 获取上传凭证
    const tokenResponse = await getUploadToken(file.name);
    const { token, domain } = tokenResponse.data;
    // 使用华南区域(z2)的上传地址，根据错误提示，存储桶whateat-oss位于华南区域
    const uploadUrl = process.env.NEXT_PUBLIC_QINIU_UPLOAD_URL || `https://up-z2.qiniup.com`;

    // 2. 准备FormData
    const formData = new FormData();
    formData.append("file", file);
    formData.append("token", token);
    formData.append("key", `uploads/${Date.now()}-${file.name}`); // 自定义文件路径

    // 3. 使用XMLHttpRequest实现带进度监听的上传
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
            const responseData = JSON.parse(xhr.responseText);
            resolve({
              key: responseData.key,
              url: `http://${domain}/${responseData.key}`, // 使用从token接口获取的domain
            });
          } catch (parseError) {
            reject(new Error("解析上传响应失败"));
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            reject(new Error(errorData.error || `上传失败: ${xhr.status}`));
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

      // 发送请求
      xhr.open("POST", uploadUrl);
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
  uploadToQiniu,
};
