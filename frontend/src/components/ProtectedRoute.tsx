'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { PageLoading } from './ui/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // 用户未登录
      if (!user) {
        router.push('/login');
        return;
      }

      // 检查角色权限
      if (requiredRole && user.role !== requiredRole) {
        // 根据用户角色跳转到适当的页面
        if (user.role === 'admin') {
          router.push('/admin/users');
        } else {
          router.push('/profile');
        }
        return;
      }

      // 如果指定了重定向地址
      if (redirectTo) {
        router.push(redirectTo);
        return;
      }
    }
  }, [user, loading, requiredRole, redirectTo, router]);

  if (loading) {
    return <PageLoading message="加载中..." />;
  }

  if (!user) {
    return <PageLoading message="跳转到登录页面..." />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <PageLoading message="跳转中..." />;
  }

  return <>{children}</>;
};

// 公开路由组件（仅允许未登录用户访问）
interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // 已登录用户根据角色跳转
      if (user.role === 'admin') {
        router.push('/admin/users');
      } else {
        router.push('/profile');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <PageLoading message="加载中..." />;
  }

  if (user) {
    return <PageLoading message="跳转中..." />;
  }

  return <>{children}</>;
};