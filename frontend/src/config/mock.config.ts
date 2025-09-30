// 虚拟数据配置 - 用于前端独立测试
export const API_CONFIG = {
  USE_MOCK_DATA: true,
  BASE_URL: 'http://localhost:3001/api', // 后端API地址（当USE_MOCK_DATA为false时使用）
  TIMEOUT: 5000,
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

// 虚拟用户数据
export const MOCK_USERS = [
  {
    id: 1,
    name: '张三',
    phone: '13800138001',
    email: 'zhangsan@example.com',
    role: 'admin',
    status: 'active',
    created_at: '2025-01-01T00:00:00Z',
    payment_info: {
      alipay_account: 'zhangsan@alipay.com',
      alipay_qr_code: '/uploads/qr_codes/zhangsan_alipay.jpg',
      bank_card: '6225885588558855',
      id_card: '110101199001011234'
    }
  },
  {
    id: 2,
    name: '李四',
    phone: '13800138002',
    email: 'lisi@example.com',
    role: 'user',
    status: 'active',
    created_at: '2025-01-02T00:00:00Z',
    payment_info: {
      alipay_account: 'lisi@alipay.com',
      alipay_qr_code: '/uploads/qr_codes/lisi_alipay.jpg'
    }
  },
  {
    id: 3,
    name: '王五',
    phone: '13800138003',
    email: 'wangwu@example.com',
    role: 'user',
    status: 'active',
    created_at: '2025-01-03T00:00:00Z',
    payment_info: {
      bank_card: '6225885588558866',
      id_card: '110101199001011235'
    }
  },
  {
    id: 4,
    name: '赵六',
    phone: '13800138004',
    email: 'zhaoliu@example.com',
    role: 'user',
    status: 'active',
    created_at: '2025-01-04T00:00:00Z',
    payment_info: {
      alipay_account: 'zhaoliu@alipay.com',
      alipay_qr_code: '/uploads/qr_codes/zhaoliu_alipay.jpg'
    }
  }
];

// 虚拟账单数据
export const MOCK_BILLS = [
  {
    id: 1,
    user_id: 2,
    amount: 1500.00,
    status: 'completed',
    type: 'user_application',
    payment_attachment: '/uploads/payments/payment_001.jpg',
    proof_image: '/uploads/proofs/proof_001.jpg',
    created_at: '2025-09-01T10:30:00Z',
    updated_at: '2025-09-01T14:30:00Z',
    approved_by: 1,
    remark: '项目开发费用'
  },
  {
    id: 2,
    user_id: 3,
    amount: 2800.00,
    status: 'pending',
    type: 'user_application',
    payment_attachment: '/uploads/payments/payment_002.jpg',
    proof_image: '/uploads/proofs/proof_002.jpg',
    created_at: '2025-09-15T09:15:00Z',
    updated_at: '2025-09-15T09:15:00Z',
    remark: '设计费用'
  },
  {
    id: 3,
    user_id: 4,
    amount: 3200.00,
    status: 'completed',
    type: 'admin_payment',
    payment_attachment: '/uploads/payments/payment_003.jpg',
    proof_image: '/uploads/proofs/proof_003.jpg',
    created_at: '2025-09-20T16:45:00Z',
    updated_at: '2025-09-20T16:45:00Z',
    approved_by: 1,
    remark: '咨询服务费'
  },
  {
    id: 4,
    user_id: 2,
    amount: 1800.00,
    status: 'completed',
    type: 'user_application',
    payment_attachment: '/uploads/payments/payment_004.jpg',
    proof_image: '/uploads/proofs/proof_004.jpg',
    created_at: '2025-09-25T11:20:00Z',
    updated_at: '2025-09-25T15:20:00Z',
    approved_by: 1,
    remark: '维护费用'
  },
  {
    id: 5,
    user_id: 3,
    amount: 2500.00,
    status: 'pending',
    type: 'user_application',
    payment_attachment: '/uploads/payments/payment_005.jpg',
    proof_image: '/uploads/proofs/proof_005.jpg',
    created_at: '2025-09-28T13:10:00Z',
    updated_at: '2025-09-28T13:10:00Z',
    remark: '培训费用'
  }
];

// 当前登录用户（虚拟数据）
export const MOCK_CURRENT_USER = {
  id: 1,
  name: '张三',
  phone: '13800138001',
  email: 'zhangsan@example.com',
  role: 'admin',
  status: 'active',
  token: 'mock_jwt_token_admin_user',
  payment_info: {
    alipay_account: 'zhangsan@alipay.com',
    alipay_qr_code: '/uploads/qr_codes/zhangsan_alipay.jpg',
    bank_card: '6225885588558855',
    id_card: '110101199001011234'
  }
};