'use client';

import { useAuth } from '../hooks/useAuth';
import { Loading } from '../components';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // 根据用户角色跳转到相应页面
        if (user.role === 'admin') {
          router.push('/admin/users');
        } else {
          router.push('/profile');
        }
      } else {
        // 未登录用户跳转到登录页
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <Loading />
  );
}