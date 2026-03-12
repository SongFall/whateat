/**
 * API请求客户端封装
 * 使用原生fetch实现，包含请求拦截和响应拦截功能
 */

class ApiClient {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  /**
   * 添加请求拦截器
   * @param {Function} interceptor - 请求拦截器函数
   */
  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
    return this;
  }

  /**
   * 添加响应拦截器
   * @param {Function} interceptor - 响应拦截器函数
   */
  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
    return this;
  }

  /**
   * 执行请求拦截器
   * @param {Object} config - 请求配置
   * @returns {Promise<Object>} - 处理后的请求配置
   */
  async executeRequestInterceptors(config) {
    let processedConfig = { ...config };
    
    for (const interceptor of this.requestInterceptors) {
      processedConfig = await interceptor(processedConfig);
    }
    
    return processedConfig;
  }

  /**
   * 执行响应拦截器
   * @param {Response} response - fetch响应对象
   * @returns {Promise<Response>} - 处理后的响应对象
   */
  async executeResponseInterceptors(response) {
    let processedResponse = response;
    
    for (const interceptor of this.responseInterceptors) {
      processedResponse = await interceptor(processedResponse);
    }
    
    return processedResponse;
  }

  /**
   * 构建请求URL
   * @param {string} url - 请求URL
   * @returns {string} - 完整URL
   */
  buildUrl(url) {
    // 如果是完整URL，直接返回
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // 拼接baseURL和相对路径
    const baseURL = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;
    const relativeURL = url.startsWith('/') ? url : `/${url}`;
    
    return `${baseURL}${relativeURL}`;
  }

  /**
   * 通用请求方法
   * @param {string} url - 请求URL
   * @param {Object} options - 请求选项
   * @returns {Promise<any>} - 请求结果
   */
  async request(url, options = {}) {
    try {
      // 构建默认配置
      const defaultOptions = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // 合并配置
      let config = {
        ...defaultOptions,
        ...options,
        headers: {
          ...defaultOptions.headers,
          ...options.headers,
        },
      };

      // 执行请求拦截器
      config = await this.executeRequestInterceptors(config);

      // 构建完整URL
      const fullUrl = this.buildUrl(url);
      
      // 将URL添加到config中，以便拦截器可以访问
      config.url = url;

      // 发送请求
      let response = await fetch(fullUrl, config);

      // 执行响应拦截器
      response = await this.executeResponseInterceptors(response);

      // 检查响应状态
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 解析响应数据
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  /**
   * GET请求
   * @param {string} url - 请求URL
   * @param {Object} params - URL参数
   * @param {Object} options - 其他请求选项
   * @returns {Promise<any>} - 请求结果
   */
  async get(url, params = {}, options = {}) {
    // 构建查询字符串
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');

    // 构建带查询参数的URL
    let urlWithParams = url;
    if (queryString) {
      // 检查URL是否已经包含查询参数
      const hasQuery = url.includes('?');
      urlWithParams = `${url}${hasQuery ? '&' : '?'}${queryString}`;
    }

    return this.request(urlWithParams, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * POST请求
   * @param {string} url - 请求URL
   * @param {Object} data - 请求数据
   * @param {Object} options - 其他请求选项
   * @returns {Promise<any>} - 请求结果
   */
  async post(url, data = {}, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT请求
   * @param {string} url - 请求URL
   * @param {Object} data - 请求数据
   * @param {Object} options - 其他请求选项
   * @returns {Promise<any>} - 请求结果
   */
  async put(url, data = {}, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE请求
   * @param {string} url - 请求URL
   * @param {Object} data - 请求数据
   * @param {Object} options - 其他请求选项
   * @returns {Promise<any>} - 请求结果
   */
  async delete(url, data = {}, options = {}) {
    return this.request(url, {
      ...options,
      method: 'DELETE',
      body: JSON.stringify(data),
    });
  }

  /**
   * 文件上传
   * @param {string} url - 上传URL
   * @param {FormData} formData - 表单数据
   * @param {Object} options - 上传选项
   * @returns {Promise<any>} - 上传结果
   */
  async upload(url, formData, options = {}) {
    // 文件上传时不设置Content-Type，让浏览器自动设置
    const uploadOptions = {
      ...options,
      method: 'POST',
      body: formData,
      headers: {
        ...options.headers,
      },
    };
    
    // 删除Content-Type，让浏览器自动设置
    delete uploadOptions.headers['Content-Type'];

    // 处理上传进度
    if (options.onUploadProgress && typeof options.onUploadProgress === 'function') {
      // 创建上传进度监控
      const xhr = new XMLHttpRequest();
      return new Promise((resolve, reject) => {
        xhr.open('POST', this.buildUrl(url));
        
        // 设置请求头
        Object.keys(uploadOptions.headers).forEach(key => {
          xhr.setRequestHeader(key, uploadOptions.headers[key]);
        });
        
        // 监控上传进度
        xhr.upload.addEventListener('progress', (event) => {
          options.onUploadProgress(event);
        });
        
        // 处理响应
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (error) {
              resolve(xhr.responseText);
            }
          } else {
            reject(new Error(`HTTP error! status: ${xhr.status}`));
          }
        });
        
        // 处理错误
        xhr.addEventListener('error', () => {
          reject(new Error('Network error'));
        });
        
        // 发送请求
        xhr.send(formData);
      });
    }

    return this.request(url, uploadOptions);
  }
}

// 创建默认实例
const apiClient = new ApiClient();

// 添加默认请求拦截器 - 添加认证token等
apiClient.addRequestInterceptor(async (config) => {
  // 从localStorage获取token
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`,
    };
  }
  
  // 可以在这里添加其他请求拦截逻辑，如日志记录等
  console.log('Request URL:', apiClient.buildUrl(config.url || ''));
  
  return config;
});

// 添加默认响应拦截器 - 统一错误处理等
apiClient.addResponseInterceptor(async (response) => {
  // 解析响应数据
  let responseData;
  try {
    responseData = await response.clone().json();
  } catch (error) {
    responseData = null;
  }
  
  // 处理401未授权错误
  if (response.status === 401) {
    // 清除本地token和用户信息
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userInfo');
    
    // 跳转到登录页
    console.warn('Authorization failed, redirecting to login page');
    window.location.href = '/auth';
    return response;
  }
  
  // 处理其他错误状态码
  if (!response.ok) {
    // 构建错误信息
    const errorMessage = responseData?.message || `请求失败: ${response.status} ${response.statusText}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = responseData;
    
    // 抛出错误，让调用方处理
    throw error;
  }
  
  return response;
});

// 添加统一错误处理函数
export const handleApiError = (error) => {
  // 可以在这里添加统一的错误处理逻辑，如显示错误提示、上报错误等
  console.error('API Error:', error.message);
  
  // 示例：显示错误提示
  if (typeof window !== 'undefined' && window.alert) {
    window.alert(error.message);
  }
  
  return error;
};

// 添加请求取消功能
apiClient.cancelTokens = new Map();

// 生成取消令牌
apiClient.getCancelToken = (key) => {
  const controller = new AbortController();
  apiClient.cancelTokens.set(key, controller);
  return controller.signal;
};

// 取消请求
apiClient.cancelRequest = (key) => {
  const controller = apiClient.cancelTokens.get(key);
  if (controller) {
    controller.abort();
    apiClient.cancelTokens.delete(key);
  }
};

// 取消所有请求
apiClient.cancelAllRequests = () => {
  for (const controller of apiClient.cancelTokens.values()) {
    controller.abort();
  }
  apiClient.cancelTokens.clear();
};

export default apiClient;
export { ApiClient };