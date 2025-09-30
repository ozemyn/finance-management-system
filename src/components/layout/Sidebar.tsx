'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  BarChart3,
  Download,
  User,
  Settings,
  CreditCard,
  PlusCircle,
  Eye,
  Home
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { MenuItem } from '@/types';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  customMenuItems?: MenuItem[];
  hasPermission?: (item: MenuItem, userRole?: string) => boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = true,
  onClose,
  customMenuItems,
  hasPermission = (item: MenuItem, userRole?: string) => {
    if (!item.role) return true;
    return item.role === userRole;
  }
}) => {
  const { user } = useAuth();
  const pathname = usePathname();

  // 菜单配置
  const defaultMenuItems: MenuItem[] = [
    // 管理员菜单
    {
      id: 'admin-dashboard',
      title: '首页',
      icon: Home,
      path: '/admin',
      role: 'admin'
    },
    {
      id: 'user-management',
      title: '用户管理',
      icon: Users,
      path: '/admin/users',
      role: 'admin'
    },
    {
      id: 'bill-management',
      title: '账单管理',
      icon: FileText,
      path: '/admin/bills',
      role: 'admin'
    },
    {
      id: 'bill-statistics',
      title: '账单统计',
      icon: BarChart3,
      path: '/admin/statistics',
      role: 'admin'
    },
    {
      id: 'pdf-export',
      title: 'PDF导出',
      icon: Download,
      path: '/admin/export',
      role: 'admin'
    },
    
    // 用户菜单
    {
      id: 'profile',
      title: '个人信息',
      icon: User,
      path: '/profile',
      role: 'user'
    },
    {
      id: 'payment-info',
      title: '收款信息',
      icon: CreditCard,
      path: '/profile/payment',
      role: 'user'
    },
    {
      id: 'bill-application',
      title: '账单申请',
      icon: PlusCircle,
      path: '/bills/create',
      role: 'user'
    },
    {
      id: 'my-bills',
      title: '我的账单',
      icon: Eye,
      path: '/bills',
      role: 'user'
    },
    {
      id: 'export-personal',
      title: '导出PDF',
      icon: Download,
      path: '/bills/export',
      role: 'user'
    }
  ];

  // 使用自定义菜单或默认菜单
  const menuItems = customMenuItems || defaultMenuItems;

  // 根据用户角色和权限函数过滤菜单
  const filteredMenuItems = menuItems.filter(item => hasPermission(item, user?.role));

  const isItemActive = (path: string) => {
    if (path === '/admin' && pathname !== '/admin') {
      return false;
    }
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <>
      {/* 桌面端侧边栏 */}
      <motion.aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-r border-gray-100 dark:border-gray-700 pt-16 hidden md:block ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        initial={false}
        animate={{ x: isOpen ? 0 : -256 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="p-6">
          <nav className="space-y-2">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item.path);
              
              return (
                <Link key={item.id} href={item.path}>
                  <motion.div
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      active
                        ? 'bg-ios-blue text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-white/10'
                    }`}
                    whileHover={{ x: active ? 0 : 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.aside>

      {/* 手机端侧边栏 */}
      {isOpen && (
        <motion.div
          className="md:hidden fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 背景蒙版 */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* 侧边栏内容 */}
          <motion.aside
            className="absolute left-0 top-0 h-full w-64 glass-effect"
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                功能菜单
              </h2>
              
              <nav className="space-y-2">
                {filteredMenuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isItemActive(item.path);
                  
                  return (
                    <Link key={item.id} href={item.path} onClick={onClose}>
                      <motion.div
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          active
                            ? 'bg-ios-blue text-white shadow-lg'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-white/10'
                        }`}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.title}</span>
                      </motion.div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </>
  );
};