'use client';

import React, { useState, useEffect } from 'react';
import { Search, Eye, Users, Filter, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Layout,
  ProtectedRoute,
  Card,
  StatCard,
  Button,
  Input,
  Table,
  Modal,
  Loading
} from '@/components';
import { DataService } from '@/services';
import { User, SearchParams } from '@/types';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    normalUsers: 0,
    activeUsers: 0
  });

  // 加载用户列表
  const loadUsers = async (params?: SearchParams) => {
    try {
      setLoading(true);
      const userData: User[] = await DataService.user.getUsers(params);
      setUsers(userData);
      
      // 计算统计数据
      setStats({
        totalUsers: userData.length,
        adminUsers: userData.filter((u: User) => u.role === 'admin').length,
        normalUsers: userData.filter((u: User) => u.role === 'user').length,
        activeUsers: userData.filter((u: User) => u.status === 'active').length
      });
    } catch (error: any) {
      toast.error(error.message || '加载用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // 搜索处理
  const handleSearch = () => {
    loadUsers({ keyword: searchKeyword });
  };

  // 重置搜索
  const handleReset = () => {
    setSearchKeyword('');
    loadUsers();
  };

  // 查看用户详情
  const handleViewUser = async (user: User) => {
    try {
      const userDetail = await DataService.user.getUser(user.id);
      setSelectedUser(userDetail);
      setShowUserModal(true);
    } catch (error: any) {
      toast.error(error.message || '获取用户详情失败');
    }
  };

  // 表格列配置
  const columns = [
    {
      key: 'id',
      title: 'ID',
      width: '80px',
      render: (value: number) => (
        <span className="font-mono text-sm">{value}</span>
      )
    },
    {
      key: 'name',
      title: '姓名',
      render: (value: string, record: User) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-ios-blue rounded-full flex items-center justify-center text-white font-medium">
            {value.charAt(0)}
          </div>
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'email',
      title: '邮箱',
      render: (value: string) => (
        <span className="text-gray-600 dark:text-gray-400">{value}</span>
      )
    },
    {
      key: 'phone',
      title: '手机号',
      render: (value: string) => (
        <span className="font-mono">{value}</span>
      )
    },
    {
      key: 'role',
      title: '角色',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'admin' 
            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        }`}>
          {value === 'admin' ? '管理员' : '普通用户'}
        </span>
      )
    },
    {
      key: 'status',
      title: '状态',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'active'
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {value === 'active' ? '激活' : '停用'}
        </span>
      )
    },
    {
      key: 'created_at',
      title: '注册时间',
      render: (value: string) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(value).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'actions',
      title: '操作',
      render: (value: any, record: User) => (
        <Button
          variant="ghost"
          size="sm"
          icon={Eye}
          onClick={() => handleViewUser(record)}
        >
          查看
        </Button>
      )
    }
  ];

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
              用户管理
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              管理系统中的所有用户信息
            </p>
          </motion.div>

          {/* 统计卡片 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6"
          >
            <StatCard
              title="总用户数"
              value={stats.totalUsers}
              icon={<Users className="w-6 h-6 text-ios-blue" />}
            />
            <StatCard
              title="管理员"
              value={stats.adminUsers}
              icon={<Users className="w-6 h-6 text-purple-600" />}
            />
            <StatCard
              title="普通用户"
              value={stats.normalUsers}
              icon={<Users className="w-6 h-6 text-green-600" />}
            />
            <StatCard
              title="激活用户"
              value={stats.activeUsers}
              icon={<Users className="w-6 h-6 text-blue-600" />}
            />
          </motion.div>

          {/* 搜索区域 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="搜索用户姓名、邮箱或手机号"
                    icon={Search}
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="flex gap-2 sm:gap-3">
                  <Button
                    variant="primary"
                    icon={Search}
                    onClick={handleSearch}
                  >
                    搜索
                  </Button>
                  <Button
                    variant="secondary"
                    icon={RefreshCw}
                    onClick={handleReset}
                  >
                    重置
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* 用户表格 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Table
              columns={columns}
              data={users}
              loading={loading}
              emptyText="暂无用户数据"
            />
          </motion.div>

          {/* 用户详情模态框 */}
          <Modal
            isOpen={showUserModal}
            onClose={() => setShowUserModal(false)}
            title="用户详情"
            size="lg"
          >
            {selectedUser && (
              <div className="space-y-6">
                {/* 基本信息 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    基本信息
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        用户ID
                      </label>
                      <p className="text-gray-900 dark:text-white">{selectedUser.id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        姓名
                      </label>
                      <p className="text-gray-900 dark:text-white">{selectedUser.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        邮箱
                      </label>
                      <p className="text-gray-900 dark:text-white">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        手机号
                      </label>
                      <p className="text-gray-900 dark:text-white">{selectedUser.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        角色
                      </label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedUser.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {selectedUser.role === 'admin' ? '管理员' : '普通用户'}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        状态
                      </label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedUser.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {selectedUser.status === 'active' ? '激活' : '停用'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 收款信息 */}
                {selectedUser.payment_info && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      收款信息
                    </h3>
                    <div className="space-y-4">
                      {selectedUser.payment_info.alipay_account && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            支付宝账号
                          </label>
                          <p className="text-gray-900 dark:text-white">
                            {selectedUser.payment_info.alipay_account}
                          </p>
                          {selectedUser.payment_info.alipay_qr_code && (
                            <div className="mt-2">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                收款码
                              </label>
                              <img 
                                src={DataService.file.getFilePreviewUrl(selectedUser.payment_info.alipay_qr_code)}
                                alt="收款码" 
                                className="w-32 h-32 object-cover rounded-lg border"
                              />
                            </div>
                          )}
                        </div>
                      )}
                      
                      {selectedUser.payment_info.bank_card && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              银行卡号
                            </label>
                            <p className="text-gray-900 dark:text-white font-mono">
                              {selectedUser.payment_info.bank_card.replace(/(\d{4})(?=\d)/g, '$1 ')}
                            </p>
                          </div>
                          {selectedUser.payment_info.id_card && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                身份证号
                              </label>
                              <p className="text-gray-900 dark:text-white font-mono">
                                {selectedUser.payment_info.id_card.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2')}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 时间信息 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    时间信息
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        注册时间
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(selectedUser.created_at).toLocaleString()}
                      </p>
                    </div>
                    {selectedUser.updated_at && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          更新时间
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {new Date(selectedUser.updated_at).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}