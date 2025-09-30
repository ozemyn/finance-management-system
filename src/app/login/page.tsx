'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthLayout, Button, Input } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { LoginCredentials } from '../../types';

export default function LoginPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setLoading(true);
      await login(data);
    } catch (error: any) {
      setError('email', {
        type: 'manual',
        message: error.message || '登录失败'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="登录"
      subtitle="欢迎回来，请登录您的账户"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 邮箱输入 */}
        <Input
          type="email"
          label="邮箱地址"
          placeholder="请输入邮箱地址"
          icon={Mail}
          error={errors.email?.message}
          {...register('email', {
            required: '请输入邮箱地址',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: '请输入正确的邮箱地址'
            }
          })}
        />

        {/* 密码输入 */}
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            label="密码"
            placeholder="请输入密码"
            icon={Lock}
            error={errors.password?.message}
            {...register('password', {
              required: '请输入密码',
              minLength: {
                value: 6,
                message: '密码不能少于6位'
              }
            })}
          />
          
          {/* 密码显示/隐藏按钮 */}
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* 登录按钮 */}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
          className="h-12"
        >
          登录
        </Button>

        {/* 注册链接 */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            还没有账户？{
            ' '}
            <Link 
              href="/register" 
              className="text-ios-blue hover:underline font-medium"
            >
              立即注册
            </Link>
          </p>
        </div>

        {/* 演示账户提示 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
        >
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            📍 演示账户
          </h4>
          <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
            <div>
              <strong>管理员账户：</strong>
              <br />
              邮箱：zhangsan@example.com
              <br />
              密码：123456
            </div>
            <div>
              <strong>普通用户账户：</strong>
              <br />
              邮箱：lisi@example.com
              <br />
              密码：123456
            </div>
          </div>
        </motion.div>
      </form>
    </AuthLayout>
  );
}