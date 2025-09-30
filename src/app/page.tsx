'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { PageLoading } from '@/components/ui/Loading';
import { ROUTES, getDefaultHomePage } from '@/constants/routes';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // 未登录，重定向到登录页
        router.replace(ROUTES.LOGIN);
      } else {
        // 已登录，根据角色重定向到对应的首页
        router.replace(getDefaultHomePage(user.role));
      }
    }
  }, [user, loading, router]);

  // 显示加载状态
  return <PageLoading message="页面加载中..." />;
}