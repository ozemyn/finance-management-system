'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { PageLoading } from '../ui/Loading';

interface LayoutProps {
  children: React.ReactNode;
  // 是否显示侧边栏，默认根据用户角色决定
  showSidebar?: boolean;
  // 是否固定侧边栏（桌面端），默认true
  fixedSidebar?: boolean;
  // 自定义布局类名
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  showSidebar,
  fixedSidebar = true,
  className = ''
}) => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // 如果没有明确指定是否显示侧边栏，则根据用户角色决定
  const shouldShowSidebar = showSidebar ?? user?.role === 'admin';

  useEffect(() => {
    // 初始化检查是否为桌面端
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    checkIsDesktop();
    
    // 监听窗口大小变化
    window.addEventListener('resize', checkIsDesktop);
    
    return () => {
      window.removeEventListener('resize', checkIsDesktop);
    };
  }, []);

  if (loading) {
    return <PageLoading message="初始化中..." />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${className}`}>
      <Navbar
        showMenuButton={shouldShowSidebar}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className={`flex min-h-screen ${shouldShowSidebar ? 'pt-16' : ''}`}>
        {shouldShowSidebar && (
          <Sidebar
            isOpen={fixedSidebar ? (isDesktop || sidebarOpen) : sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}
        
        <main className={`flex-1 p-6 ${shouldShowSidebar && fixedSidebar ? 'md:ml-64' : ''}`}>
          <div className={`mx-auto ${shouldShowSidebar ? 'max-w-[calc(100vw-88px)] md:max-w-full' : 'max-w-[calc(100vw-48px)] md:max-w-full'}`}>
            {children}
          </div>
        </main>
      </div>
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