'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, Phone, Eye, EyeOff } from 'lucide-react';
import { AuthLayout, Button, Input } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { RegisterData } from '@/types';

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError
  } = useForm<RegisterData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterData) => {
    try {
      setLoading(true);
      await registerUser(data);
    } catch (error: any) {
      setError('email', {
        type: 'manual',
        message: error.message || '注册失败'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="注册"
      subtitle="创建您的账户开始使用"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 姓名输入 */}
        <Input
          type="text"
          label="姓名"
          placeholder="请输入您的姓名"
          icon={User}
          error={errors.name?.message}
          {...register('name', {
            required: '请输入姓名',
            minLength: {
              value: 2,
              message: '姓名不能少于2个字符'
            }
          })}
        />

        {/* 手机号输入 */}
        <Input
          type="tel"
          label="手机号"
          placeholder="请输入手机号"
          icon={Phone}
          error={errors.phone?.message}
          {...register('phone', {
            required: '请输入手机号',
            pattern: {
              value: /^1[3-9]\d{9}$/,
              message: '请输入正确的手机号'
            }
          })}
        />

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
              },
              pattern: {
                value: /^(?=.*[a-zA-Z])(?=.*\d).+$/,
                message: '密码必须包含字母和数字'
              }
            })}
          />
          
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* 确认密码输入 */}
        <div className="relative">
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            label="确认密码"
            placeholder="请再次输入密码"
            icon={Lock}
            error={errors.confirm_password?.message}
            {...register('confirm_password', {
              required: '请确认密码',
              validate: value => value === password || '两次输入的密码不一致'
            })}
          />
          
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* 注册按钮 */}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
          className="h-12"
        >
          注册
        </Button>

        {/* 登录链接 */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            已有账户？{' '}
            <Link 
              href="/login" 
              className="text-ios-blue hover:underline font-medium"
            >
              立即登录
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}