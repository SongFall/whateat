/**
 * 时间处理工具
 */

/**
 * 格式化时间为 YYYY-MM-DD HH:MM 格式
 * @param {string|Date} date - 时间字符串或Date对象
 * @returns {string} 格式化后的时间字符串
 */
export const formatTime = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  
  // 处理无效日期
  if (isNaN(d.getTime())) return '';
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

/**
 * 格式化时间为相对时间（如：3分钟前，2小时前）
 * @param {string|Date} date - 时间字符串或Date对象
 * @returns {string} 相对时间字符串
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  
  // 处理无效日期
  if (isNaN(diff)) return '';
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}天前`;
  } else if (hours > 0) {
    return `${hours}小时前`;
  } else if (minutes > 0) {
    return `${minutes}分钟前`;
  } else {
    return '刚刚';
  }
};