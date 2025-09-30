'use client';

import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { PageLoading } from '../ui/Loading';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return <PageLoading message="初始化中..." />;
  }

  // 管理员布局（有侧边栏）
  if (user?.role === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar
          showMenuButton
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <div className="flex">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          
          <main className="flex-1 md:ml-64 p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // 普通用户布局（无侧边栏）
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar
        showMenuButton
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
      
      {/* 手机端菜单 */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

// 认证布局（登录/注册页面使用）
interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 头部 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            财务管理系统
          </h1>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-1">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* 表单容器 */}
        <div className="ios-card">
          {children}
        </div>
        
        {/* 底部 */}
        <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>© 2025 财务管理系统. 版权所有</p>
        </div>
      </div>
    </div>
  );
};