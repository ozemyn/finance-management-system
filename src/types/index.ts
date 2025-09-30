// 用户相关类型
export interface User {
  id: number;
  name: string;
  phone: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at?: string;
  payment_info?: PaymentInfo;
}

// 支付信息类型
export interface PaymentInfo {
  alipay_account?: string;
  alipay_qr_code?: string;
  bank_card?: string;
  id_card?: string; // 仅在选择银行卡时必填
}

// 账单相关类型
export interface Bill {
  id: number;
  user_id: number;
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  type: 'user_application' | 'admin_payment';
  payment_attachment?: string; // 付款附件图片URL
  proof_image?: string; // 证明图片URL
  created_at: string;
  updated_at: string;
  approved_by?: number; // 审核人用户ID
  approved_at?: string; // 审核时间
  remark?: string; // 备注
  user?: User; // 关联用户信息
}

// 账单统计类型
export interface BillStatistics {
  total_amount: number;
  total_bills: number;
  period: {
    start_date: string;
    end_date: string;
  };
  user_statistics: UserBillStatistics[];
}

export interface UserBillStatistics {
  user_id: number;
  user_name: string;
  total_amount: number;
  bill_count: number;
  bills: Bill[];
}

// 登录相关类型
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

// 表单相关类型
export interface BillFormData {
  user_id?: number;
  amount: number;
  payment_attachment?: File;
  proof_image?: File;
  remark?: string;
}

export interface ProfileUpdateData {
  name?: string;
  phone?: string;
  email?: string;
  payment_info?: PaymentInfo;
}

// 文件上传类型
export interface FileUploadResponse {
  success: boolean;
  file_url: string;
  file_name: string;
  message?: string;
}

// 查询参数类型
export interface SearchParams {
  keyword?: string;
  user_id?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  per_page?: number;
}

// PDF导出参数
export interface ExportPDFParams {
  user_id?: number | 'all';
  start_date: string;
  end_date: string;
  export_type: 'personal' | 'admin';
}

// 主题相关类型
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primary_color: string;
  glass_effect: boolean;
}

// 系统配置类型
export interface SystemConfig {
  app_name: string;
  version: string;
  api_version: string;
  upload_max_size: number;
  supported_file_types: string[];
}

// 菜单项类型
export interface MenuItem {
  id: string;
  title: string;
  icon: any; // Lucide React icon component
  path: string;
  role?: 'admin' | 'user' | 'both';
  children?: MenuItem[];
}

// 面包屑类型
export interface BreadcrumbItem {
  title: string;
  path?: string;
}

// 通知类型
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actions?: {
    label: string;
    action: () => void;
  }[];
}