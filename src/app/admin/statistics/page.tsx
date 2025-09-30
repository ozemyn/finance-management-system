'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Calendar,
  UserCheck,
  UserX,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import {
  Layout,
  ProtectedRoute,
  Card,
  StatCard,
} from '@/components';
import { StatisticsService } from '@/services/data.service';
import toast from 'react-hot-toast';

// 统计数据接口
interface Statistics {
  users: {
    total: number;
    active: number;
    inactive: number;
    admins: number;
    normalUsers: number;
    todayNew: number;
    weekNew: number;
    monthNew: number;
  };
  bills: {
    total: number;
    totalAmount: number;
    pending: number;
    completed: number;
    rejected: number;
    todayCount: number;
    todayAmount: number;
    weekCount: number;
    weekAmount: number;
    monthCount: number;
    monthAmount: number;
  };
}

export default function AdminStatisticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Statistics>({
    users: {
      total: 0,
      active: 0,
      inactive: 0,
      admins: 0,
      normalUsers: 0,
      todayNew: 0,
      weekNew: 0,
      monthNew: 0,
    },
    bills: {
      total: 0,
      totalAmount: 0,
      pending: 0,
      completed: 0,
      rejected: 0,
      todayCount: 0,
      todayAmount: 0,
      weekCount: 0,
      weekAmount: 0,
      monthCount: 0,
      monthAmount: 0,
    }
  });

  // 加载统计数据
  const loadStatistics = async () => {
    try {
      setLoading(true);
      const data = await StatisticsService.getOverview();
      setStats(data);
    } catch (error: any) {
      toast.error(error.message || '加载统计数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatistics();
  }, []);

  return (
    <ProtectedRoute requiredRole="admin">
      <Layout>
        <div className="space-y-6">
          {/* 页面头部 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              统计概览
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              查看系统整体运营数据和统计信息
            </p>
          </motion.div>

          {/* 用户统计 */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                用户统计
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                  title="总用户数"
                  value={stats.users.total}
                  icon={<Users className="w-6 h-6 text-ios-blue" />}
                />
                <StatCard
                  title="活跃用户"
                  value={stats.users.active}
                  icon={<UserCheck className="w-6 h-6 text-green-600" />}
                />
                <StatCard
                  title="管理员"
                  value={stats.users.admins}
                  icon={<Users className="w-6 h-6 text-purple-600" />}
                />
                <StatCard
                  title="普通用户"
                  value={stats.users.normalUsers}
                  icon={<Users className="w-6 h-6 text-blue-600" />}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  新增用户趋势
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">今日新增</span>
                      <Calendar className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.users.todayNew}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">本周新增</span>
                      <Calendar className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.users.weekNew}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">本月新增</span>
                      <Calendar className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.users.monthNew}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* 账单统计 */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                账单统计
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                  title="总账单数"
                  value={stats.bills.total}
                  icon={<FileText className="w-6 h-6 text-ios-blue" />}
                />
                <StatCard
                  title="待处理"
                  value={stats.bills.pending}
                  icon={<Clock className="w-6 h-6 text-yellow-600" />}
                />
                <StatCard
                  title="已完成"
                  value={stats.bills.completed}
                  icon={<CheckCircle className="w-6 h-6 text-green-600" />}
                />
                <StatCard
                  title="总金额"
                  value={`¥${stats.bills.totalAmount.toFixed(2)}`}
                  icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  账单趋势
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">今日账单</span>
                      <Calendar className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.bills.todayCount}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        金额：¥{stats.bills.todayAmount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">本周账单</span>
                      <Calendar className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.bills.weekCount}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        金额：¥{stats.bills.weekAmount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">本月账单</span>
                      <Calendar className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.bills.monthCount}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        金额：¥{stats.bills.monthAmount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
} 