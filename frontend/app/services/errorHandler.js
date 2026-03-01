/**
 * 统一错误处理和提示机制
 */

/**
 * 错误类型枚举
 */
export const ErrorType = {
  ERROR: 'error',
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info'
};

/**
 * 提示位置枚举
 */
export const ToastPosition = {
  TOP: 'top',
  TOP_LEFT: 'top-left',
  TOP_RIGHT: 'top-right',
  BOTTOM: 'bottom',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_RIGHT: 'bottom-right',
  CENTER: 'center'
};

/**
 * Toast提示配置
 * @typedef {Object} ToastConfig
 * @property {string} [type='info'] - 提示类型
 * @property {string} [position='top-right'] - 提示位置
 * @property {number} [duration=3000] - 自动关闭时间（毫秒）
 * @property {boolean} [closable=true] - 是否可关闭
 * @property {string} [className] - 自定义样式类
 */

/**
 * 创建Toast提示元素
 * @param {string} message - 提示消息
 * @param {ToastConfig} [config] - 提示配置
 * @returns {HTMLElement} Toast元素
 */
const createToastElement = (message, config = {}) => {
  const {
    type = ErrorType.INFO,
    position = ToastPosition.TOP_RIGHT,
    duration = 3000,
    closable = true,
    className = ''
  } = config;

  // 创建toast容器
  const toast = document.createElement('div');
  toast.className = `toast ${type} ${position} ${className}`;
  toast.style.cssText = `
    position: fixed;
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    z-index: 9999;
    opacity: 0;
    transform: translateY(-20px);
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    max-width: 300px;
    word-wrap: break-word;
    ${getPositionStyle(position)}
  `;

  // 设置背景色
  switch (type) {
    case ErrorType.SUCCESS:
      toast.style.backgroundColor = '#52c41a';
      break;
    case ErrorType.ERROR:
      toast.style.backgroundColor = '#f5222d';
      break;
    case ErrorType.WARNING:
      toast.style.backgroundColor = '#faad14';
      break;
    case ErrorType.INFO:
    default:
      toast.style.backgroundColor = '#1890ff';
      break;
  }

  // 添加消息内容
  const messageSpan = document.createElement('span');
  messageSpan.textContent = message;
  toast.appendChild(messageSpan);

  // 添加关闭按钮
  if (closable) {
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
      background: transparent;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      margin-left: 12px;
      padding: 0;
      width: 20px;
      height: 20px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.2s ease;
    `;
    closeBtn.addEventListener('click', () => {
      removeToast(toast);
    });
    toast.appendChild(closeBtn);
  }

  return toast;
};

/**
 * 获取位置样式
 * @param {string} position - 位置
 * @returns {string} 样式字符串
 */
const getPositionStyle = (position) => {
  switch (position) {
    case ToastPosition.TOP:
      return 'top: 20px; left: 50%; transform: translateX(-50%) translateY(-20px);';
    case ToastPosition.TOP_LEFT:
      return 'top: 20px; left: 20px;';
    case ToastPosition.TOP_RIGHT:
      return 'top: 20px; right: 20px;';
    case ToastPosition.BOTTOM:
      return 'bottom: 20px; left: 50%; transform: translateX(-50%) translateY(20px);';
    case ToastPosition.BOTTOM_LEFT:
      return 'bottom: 20px; left: 20px;';
    case ToastPosition.BOTTOM_RIGHT:
      return 'bottom: 20px; right: 20px;';
    case ToastPosition.CENTER:
      return 'top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.8);';
    default:
      return 'top: 20px; right: 20px;';
  }
};

/**
 * 移除Toast提示
 * @param {HTMLElement} toast - Toast元素
 */
const removeToast = (toast) => {
  toast.style.opacity = '0';
  if (toast.classList.contains(ToastPosition.TOP) || toast.classList.contains(ToastPosition.TOP_LEFT) || toast.classList.contains(ToastPosition.TOP_RIGHT)) {
    toast.style.transform = toast.classList.contains(ToastPosition.TOP) ? 'translateX(-50%) translateY(-20px)' : 'translateY(-20px)';
  } else if (toast.classList.contains(ToastPosition.BOTTOM) || toast.classList.contains(ToastPosition.BOTTOM_LEFT) || toast.classList.contains(ToastPosition.BOTTOM_RIGHT)) {
    toast.style.transform = toast.classList.contains(ToastPosition.BOTTOM) ? 'translateX(-50%) translateY(20px)' : 'translateY(20px)';
  } else if (toast.classList.contains(ToastPosition.CENTER)) {
    toast.style.transform = 'translate(-50%, -50%) scale(0.8)';
  }
  
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 300);
};

/**
 * 显示Toast提示
 * @param {string} message - 提示消息
 * @param {ToastConfig} [config] - 提示配置
 * @returns {HTMLElement} Toast元素
 */
export const showToast = (message, config = {}) => {
  const toast = createToastElement(message, config);
  
  // 添加到DOM
  document.body.appendChild(toast);
  
  // 显示动画
  setTimeout(() => {
    toast.style.opacity = '1';
    if (toast.classList.contains(ToastPosition.TOP) || toast.classList.contains(ToastPosition.TOP_LEFT) || toast.classList.contains(ToastPosition.TOP_RIGHT)) {
      toast.style.transform = toast.classList.contains(ToastPosition.TOP) ? 'translateX(-50%) translateY(0)' : 'translateY(0)';
    } else if (toast.classList.contains(ToastPosition.BOTTOM) || toast.classList.contains(ToastPosition.BOTTOM_LEFT) || toast.classList.contains(ToastPosition.BOTTOM_RIGHT)) {
      toast.style.transform = toast.classList.contains(ToastPosition.BOTTOM) ? 'translateX(-50%) translateY(0)' : 'translateY(0)';
    } else if (toast.classList.contains(ToastPosition.CENTER)) {
      toast.style.transform = 'translate(-50%, -50%) scale(1)';
    }
  }, 10);
  
  // 自动关闭
  if (config.duration !== 0) {
    setTimeout(() => {
      removeToast(toast);
    }, config.duration || 3000);
  }
  
  return toast;
};

/**
 * 显示成功提示
 * @param {string} message - 提示消息
 * @param {ToastConfig} [config] - 提示配置
 * @returns {HTMLElement} Toast元素
 */
export const showSuccess = (message, config = {}) => {
  return showToast(message, { ...config, type: ErrorType.SUCCESS });
};

/**
 * 显示错误提示
 * @param {string} message - 提示消息
 * @param {ToastConfig} [config] - 提示配置
 * @returns {HTMLElement} Toast元素
 */
export const showError = (message, config = {}) => {
  return showToast(message, { ...config, type: ErrorType.ERROR });
};

/**
 * 显示警告提示
 * @param {string} message - 提示消息
 * @param {ToastConfig} [config] - 提示配置
 * @returns {HTMLElement} Toast元素
 */
export const showWarning = (message, config = {}) => {
  return showToast(message, { ...config, type: ErrorType.WARNING });
};

/**
 * 显示信息提示
 * @param {string} message - 提示消息
 * @param {ToastConfig} [config] - 提示配置
 * @returns {HTMLElement} Toast元素
 */
export const showInfo = (message, config = {}) => {
  return showToast(message, { ...config, type: ErrorType.INFO });
};

/**
 * 统一处理API错误
 * @param {Error} error - 错误对象
 * @param {ToastConfig} [config] - 提示配置
 * @returns {Error} 原始错误对象
 */
export const handleApiError = (error, config = {}) => {
  console.error('API Error:', error);
  
  // 提取错误信息
  let errorMessage = '请求失败，请稍后重试';
  if (error.message) {
    errorMessage = error.message;
  } else if (error.data?.message) {
    errorMessage = error.data.message;
  } else if (error.status) {
    switch (error.status) {
      case 400:
        errorMessage = '请求参数错误';
        break;
      case 401:
        errorMessage = '未授权，请重新登录';
        break;
      case 403:
        errorMessage = '禁止访问';
        break;
      case 404:
        errorMessage = '资源不存在';
        break;
      case 500:
        errorMessage = '服务器内部错误';
        break;
      default:
        errorMessage = `请求失败: ${error.status}`;
    }
  }
  
  // 显示错误提示
  showError(errorMessage, config);
  
  return error;
};

/**
 * 初始化错误处理机制
 * 在应用启动时调用，用于监听全局错误
 */
export const initErrorHandler = () => {
  // 监听全局未捕获错误
  window.addEventListener('error', (event) => {
    console.error('Global Error:', event.error);
    showError('发生未知错误，请刷新页面重试', { duration: 5000 });
  });
  
  // 监听全局未处理的Promise拒绝
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    showError('发生未知错误，请刷新页面重试', { duration: 5000 });
  });
};
