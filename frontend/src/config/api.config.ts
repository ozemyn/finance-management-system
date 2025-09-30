// 真实数据配置 - 用于与后端API交互
export const API_CONFIG = {
  USE_MOCK_DATA: false,
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000,
};

// API端点配置
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me'
  },
  
  // 用户管理
  USERS: {
    LIST: '/users',
    GET: (id: number) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: number) => `/users/${id}`,
    DELETE: (id: number) => `/users/${id}`,
    SEARCH: '/users/search'
  },
  
  // 个人信息
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile',
    UPDATE_PAYMENT_INFO: '/profile/payment-info'
  },
  
  // 账单管理
  BILLS: {
    LIST: '/bills',
    GET: (id: number) => `/bills/${id}`,
    CREATE: '/bills',
    UPDATE: (id: number) => `/bills/${id}`,
    DELETE: (id: number) => `/bills/${id}`,
    APPROVE: (id: number) => `/bills/${id}/approve`,
    REJECT: (id: number) => `/bills/${id}/reject`,
    SEARCH: '/bills/search',
    STATISTICS: '/bills/statistics'
  },
  
  // 文件上传
  UPLOAD: {
    IMAGE: '/upload/image',
    DOCUMENT: '/upload/document'
  },
  
  // PDF导出
  EXPORT: {
    PDF: '/export/pdf'
  }
};

// HTTP状态码
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接错误，请检查网络连接',
  UNAUTHORIZED: '登录已过期，请重新登录',
  FORBIDDEN: '权限不足，无法访问该资源',
  NOT_FOUND: '请求的资源不存在',
  SERVER_ERROR: '服务器错误，请稍后重试',
  VALIDATION_ERROR: '数据验证失败，请检查输入信息'
};