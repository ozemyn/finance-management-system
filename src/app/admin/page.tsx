'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  BarChart3,
  Download,
} from 'lucide-react';
import { Layout, ProtectedRoute } from '@/components';

const AdminDashboard = () => {
  const quickLinks = [
    {
      id: 'users',
      title: '用户管理',
      description: '管理系统用户、权限设置',
      icon: Users,
      path: '/admin/users',
      color: 'from-pink-400 to-rose-400',
      shadowColor: 'shadow-pink-400/30',
    },
    {
      id: 'bills',
      title: '账单管理',
      description: '查看和处理用户账单申请',
      icon: FileText,
      path: '/admin/bills',
      color: 'from-purple-400 to-fuchsia-400',
      shadowColor: 'shadow-purple-400/30',
    },
    {
      id: 'statistics',
      title: '账单统计',
      description: '查看账单数据统计和分析',
      icon: BarChart3,
      path: '/admin/statistics',
      color: 'from-sky-400 to-indigo-400',
      shadowColor: 'shadow-sky-400/30',
    },
    {
      id: 'export',
      title: 'PDF导出',
      description: '导出账单数据报表',
      icon: Download,
      path: '/admin/export',
      color: 'from-teal-400 to-cyan-400',
      shadowColor: 'shadow-teal-400/30',
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <Layout>
        <div className="min-h-[calc(100vh-4rem)] flex flex-col">
          {/* 欢迎区域 */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              欢迎回来，管理员
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              今天是个适合整理账单的好日子 ☀️
            </p>
          </div>

          {/* 快捷操作区域 */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <motion.div key={link.id} variants={item}>
                  <Link href={link.path}>
                    <div
                      className={`
                    relative group overflow-hidden rounded-2xl p-6
                    bg-gradient-to-br ${link.color}
                    dark:from-opacity-80 dark:to-opacity-80
                    shadow-lg ${link.shadowColor} hover:shadow-xl
                    transition-all duration-300 hover:-translate-y-1
                  `}
                    >
                      <div className="relative z-10">
                        <Icon className="w-8 h-8 text-white mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {link.title}
                        </h3>
                        <p className="text-white/80 text-sm">
                          {link.description}
                        </p>
                      </div>
                      
                      {/* 装饰性圆圈 */}
                      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full transition-transform duration-300 group-hover:scale-150" />
                      <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/5 rounded-full" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* 底部装饰 */}
          <div className="mt-auto pt-12 pb-6 text-center text-sm text-gray-500 dark:text-gray-400">
            财务管理系统 · 用心服务每一笔账单
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default AdminDashboard; 