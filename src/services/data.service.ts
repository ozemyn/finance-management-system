import { 
  MOCK_USERS, 
  MOCK_BILLS, 
  MOCK_CURRENT_USER, 
  API_CONFIG 
} from '../config';
import { 
  User, 
  Bill, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  ApiResponse,
  BillFormData,
  ProfileUpdateData,
  SearchParams,
  BillStatistics,
  ExportPDFParams
} from '../types';
import apiService from './api.service';

// 模拟延迟函数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 认证服务
export class AuthService {
  // 登录
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await delay(1000); // 模拟网络延迟
      
      // 模拟登录验证
      const user = MOCK_USERS.find(u => u.email === credentials.email);
      if (user && credentials.password === '123456') { // 模拟密码
        const token = `mock_token_${user.id}_${Date.now()}`;
        return {
          success: true,
          token,
          user,
          message: '登录成功'
        };
      }
      
      throw new Error('邮箱或密码错误');
    }
    
    // 真实 API 调用
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    return response.data!;
  }

  // 注册
  static async register(data: RegisterData): Promise<AuthResponse> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await delay(1000);
      
      // 检查邮箱是否已存在
      const existingUser = MOCK_USERS.find(u => u.email === data.email);
      if (existingUser) {
        throw new Error('邮箱已存在');
      }
      
      // 模拟创建新用户
      const newUser: User = {
        id: MOCK_USERS.length + 1,
        name: data.name,
        phone: data.phone,
        email: data.email,
        role: 'user',
        status: 'active',
        created_at: new Date().toISOString()
      };
      
      const token = `mock_token_${newUser.id}_${Date.now()}`;
      return {
        success: true,
        token,
        user: newUser,
        message: '注册成功'
      };
    }
    
    const response = await apiService.post<AuthResponse>('/auth/register', data);
    return response.data!;
  }

  // 获取当前用户信息
  static async getCurrentUser(): Promise<User> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await delay(500);
      return MOCK_CURRENT_USER;
    }
    
    const response = await apiService.get<User>('/auth/me');
    return response.data!;
  }

  // 登出
  static async logout(): Promise<void> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await delay(300);
      return;
    }
    
    await apiService.post('/auth/logout');
  }
}

// 用户管理服务
export class UserService {
  // 获取用户列表
  static async getUsers(params?: SearchParams): Promise<User[]> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await delay(800);
      let users = [...MOCK_USERS];
      
      // 模拟搜索
      if (params?.keyword) {
        users = users.filter(user => 
          user.name.includes(params.keyword!) ||
          user.email.includes(params.keyword!) ||
          user.phone.includes(params.keyword!)
        );
      }
      
      return users;
    }
    
    const response = await apiService.get<User[]>('/users', params);
    return response.data!;
  }

  // 获取用户详情
  static async getUser(id: number): Promise<User> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await delay(500);
      const user = MOCK_USERS.find(u => u.id === id);
      if (!user) throw new Error('用户不存在');
      return user;
    }
    
    const response = await apiService.get<User>(`/users/${id}`);
    return response.data!;
  }
}

// 个人资料服务
export class ProfileService {
  // 更新个人信息
  static async updateProfile(data: ProfileUpdateData): Promise<User> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await delay(1000);
      // 模拟更新
      const updatedUser = { ...MOCK_CURRENT_USER, ...data };
      return updatedUser;
    }
    
    const response = await apiService.put<User>('/profile', data);
    return response.data!;
  }

  // 更新收款信息
  static async updatePaymentInfo(paymentInfo: any): Promise<User> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await delay(1000);
      const updatedUser = { 
        ...MOCK_CURRENT_USER, 
        payment_info: { ...MOCK_CURRENT_USER.payment_info, ...paymentInfo }
      };
      return updatedUser;
    }
    
    const response = await apiService.put<User>('/profile/payment-info', paymentInfo);
    return response.data!;
  }
}