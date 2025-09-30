import { API_CONFIG } from '../config';
import { 
  User, 
  ProfileUpdateData, 
  PasswordUpdateData,
  ApiResponse 
} from '../types';
import apiService from './api.service';

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class UserService {
  // 更新个人资料
  static async updateProfile(data: ProfileUpdateData): Promise<User> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await delay(800);
      return {
        id: 1,
        name: data.name || 'Admin',
        email: data.email || 'admin@example.com',
        phone: data.phone || '13800138000',
        role: 'admin',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
    
    const response = await apiService.put<User>('/users/profile', data);
    return response.data!;
  }

  // 更新密码
  static async updatePassword(data: PasswordUpdateData): Promise<ApiResponse> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await delay(800);
      return {
        success: true,
        message: '密码更新成功'
      };
    }
    
    const response = await apiService.put<ApiResponse>('/users/password', data);
    return response.data!;
  }

  // 获取当前用户信息
  static async getCurrentUser(): Promise<User> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await delay(500);
      return {
        id: 1,
        name: 'Admin',
        email: 'admin@example.com',
        phone: '13800138000',
        role: 'admin',
        status: 'active',
        created_at: new Date().toISOString(),
      };
    }
    
    const response = await apiService.get<User>('/users/me');
    return response.data!;
  }
} 