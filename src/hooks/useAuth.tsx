'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../types';
import { DataService } from '../services';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 初始化时检查登录状态
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('finance_system_token');
      const savedUser = localStorage.getItem('finance_system_user');
      
      if (token && savedUser) {
        // 验证token是否有效
        const userData = await DataService.auth.getCurrentUser();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('认证检查失败:', error);
      // 清除无效的登录信息
      localStorage.removeItem('finance_system_token');
      localStorage.removeItem('finance_system_user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const response: AuthResponse = await DataService.auth.login(credentials);
      
      if (response.success) {
        // 保存登录信息
        localStorage.setItem('finance_system_token', response.token);
        localStorage.setItem('finance_system_user', JSON.stringify(response.user));
        setUser(response.user);
        
        toast.success(response.message || '登录成功');
        
        // 根据用户角色跳转
        if (response.user.role === 'admin') {
          router.push('/admin/users');
        } else {
          router.push('/profile');
        }
      }
    } catch (error: any) {
      toast.error(error.message || '登录失败');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      const response: AuthResponse = await DataService.auth.register(data);
      
      if (response.success) {
        // 保存登录信息
        localStorage.setItem('finance_system_token', response.token);
        localStorage.setItem('finance_system_user', JSON.stringify(response.user));
        setUser(response.user);
        
        toast.success(response.message || '注册成功');
        router.push('/profile');
      }
    } catch (error: any) {
      toast.error(error.message || '注册失败');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await DataService.auth.logout();
    } catch (error) {
      console.error('登出请求失败:', error);
    } finally {
      // 无论如何都清除本地存储
      localStorage.removeItem('finance_system_token');
      localStorage.removeItem('finance_system_user');
      setUser(null);
      toast.success('已退出登录');
      router.push('/login');
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('finance_system_user', JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};