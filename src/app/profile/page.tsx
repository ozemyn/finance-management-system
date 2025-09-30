'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, Save, CreditCard, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  Layout, 
  ProtectedRoute, 
  Card, 
  Button, 
  Input, 
  Loading 
} from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { DataService } from '@/services';
import { ProfileUpdateData } from '@/types';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProfileUpdateData>();

  // 初始化表单数据
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        phone: user.phone,
        email: user.email
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileUpdateData) => {
    try {
      setSaving(true);
      const updatedUser = await DataService.profile.updateProfile(data);
      updateUser(updatedUser);
      toast.success('个人信息更新成功');
    } catch (error: any) {
      toast.error(error.message || '更新失败');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loading size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* 页面头部 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              个人信息
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              管理您的个人资料和账户设置
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 个人信息表单 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <Card>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    基本信息
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    更新您的个人资料
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* 姓名 */}
                  <Input
                    label="姓名"
                    icon={User}
                    placeholder="请输入您的姓名"
                    error={errors.name?.message}
                    {...register('name', {
                      required: '请输入姓名',
                      minLength: {
                        value: 2,
                        message: '姓名不能少于2个字符'
                      }
                    })}
                  />

                  {/* 手机号 */}
                  <Input
                    label="手机号"
                    icon={Phone}
                    placeholder="请输入手机号"
                    error={errors.phone?.message}
                    {...register('phone', {
                      required: '请输入手机号',
                      pattern: {
                        value: /^1[3-9]\d{9}$/,
                        message: '请输入正确的手机号'
                      }
                    })}
                  />

                  {/* 邮箱 */}
                  <Input
                    label="邮箱地址"
                    type="email"
                    icon={Mail}
                    placeholder="请输入邮箱地址"
                    error={errors.email?.message}
                    {...register('email', {
                      required: '请输入邮箱地址',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: '请输入正确的邮箱地址'
                      }
                    })}
                  />

                  {/* 保存按钮 */}
                  <Button
                    type="submit"
                    variant="primary"
                    icon={Save}
                    loading={saving}
                    className="w-full sm:w-auto"
                  >
                    保存修改
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* 侧边栏信息 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* 账户状态 */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  账户状态
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">角色</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {user.role === 'admin' ? '管理员' : '普通用户'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">状态</span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      激活
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">注册时间</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>

              {/* 快捷操作 */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  快捷操作
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="secondary"
                    icon={CreditCard}
                    fullWidth
                    onClick={() => window.location.href = '/profile/payment'}
                  >
                    管理收款信息
                  </Button>
                  
                  {user.role === 'user' && (
                    <>
                      <Button
                        variant="secondary"
                        icon={Smartphone}
                        fullWidth
                        onClick={() => window.location.href = '/bills/create'}
                      >
                        申请账单
                      </Button>
                      <Button
                        variant="secondary"
                        fullWidth
                        onClick={() => window.location.href = '/bills'}
                      >
                        查看我的账单
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}