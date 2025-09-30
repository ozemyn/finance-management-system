// 通用工具函数

/**
 * 延迟执行函数
 * @param ms 延迟时间(毫秒)
 * @returns Promise
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
}; 