'use client';

import React, { useState, useEffect } from 'react';
import { Search, Eye, FileText, Filter, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
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
import { Bill, SearchParams } from '@/types';
import toast from 'react-hot-toast';

export default function AdminBillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const [stats, setStats] = useState({
    totalBills: 0,
    pendingBills: 0,
    completedBills: 0,
    totalAmount: 0
  });

  // 加载账单列表
  const loadBills = async (params?: SearchParams) => {
    try {
      setLoading(true);
      const billData: Bill[] = await DataService.bill.getBills(params);
      setBills(billData);
      
      // 计算统计数据
      setStats({
        totalBills: billData.length,
        pendingBills: billData.filter((b: Bill) => b.status === 'pending').length,
        completedBills: billData.filter((b: Bill) => b.status === 'completed').length,
        totalAmount: billData.reduce((sum, bill) => sum + bill.amount, 0)
      });
    } catch (error: any) {
      toast.error(error.message || '加载账单列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBills();
  }, []);

  // 搜索处理
  const handleSearch = () => {
    loadBills({ keyword: searchKeyword });
  };

  // 重置搜索
  const handleReset = () => {
    setSearchKeyword('');
    loadBills();
  };

  // 查看账单详情
  const handleViewBill = async (bill: Bill) => {
    try {
      const billDetail = await DataService.bill.getBill(bill.id);
      setSelectedBill(billDetail);
      setShowBillModal(true);
    } catch (error: any) {
      toast.error(error.message || '获取账单详情失败');
    }
  };

  // 审批账单
  const handleApproveBill = async (billId: number) => {
    try {
      await DataService.bill.approveBill(billId);
      toast.success('账单审批成功');
      loadBills();
      setShowBillModal(false);
    } catch (error: any) {
      toast.error(error.message || '账单审批失败');
    }
  };

  // 拒绝账单
  const handleRejectBill = async (billId: number) => {
    try {
      await DataService.bill.rejectBill(billId);
      toast.success('账单已拒绝');
      loadBills();
      setShowBillModal(false);
    } catch (error: any) {
      toast.error(error.message || '账单拒绝失败');
    }
  };

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
              账单管理
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              管理和审批系统中的所有账单
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
              title="总账单数"
              value={stats.totalBills}
              icon={<FileText className="w-6 h-6 text-ios-blue" />}
            />
            <StatCard
              title="待处理"
              value={stats.pendingBills}
              icon={<FileText className="w-6 h-6 text-yellow-600" />}
            />
            <StatCard
              title="已完成"
              value={stats.completedBills}
              icon={<FileText className="w-6 h-6 text-green-600" />}
            />
            <StatCard
              title="总金额"
              value={`¥${stats.totalAmount.toFixed(2)}`}
              icon={<FileText className="w-6 h-6 text-purple-600" />}
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
                    placeholder="搜索账单备注或用户信息"
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

          {/* 账单表格 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Table
              columns={[
                {
                  key: 'id',
                  title: 'ID',
                  width: '80px',
                  render: (value: number) => (
                    <span className="font-mono text-sm">{value}</span>
                  )
                },
                {
                  key: 'user',
                  title: '申请人',
                  render: (value: any) => (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-ios-blue rounded-full flex items-center justify-center text-white font-medium">
                        {value.name.charAt(0)}
                      </div>
                      <span className="font-medium">{value.name}</span>
                    </div>
                  )
                },
                {
                  key: 'amount',
                  title: '金额',
                  render: (value: number) => (
                    <span className="font-mono font-medium">
                      ¥{value.toFixed(2)}
                    </span>
                  )
                },
                {
                  key: 'type',
                  title: '类型',
                  render: (value: string) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      value === 'user_application'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    }`}>
                      {value === 'user_application' ? '用户申请' : '管理员支付'}
                    </span>
                  )
                },
                {
                  key: 'status',
                  title: '状态',
                  render: (value: string) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      value === 'completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : value === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {value === 'completed' ? '已完成' : value === 'pending' ? '待处理' : '已拒绝'}
                    </span>
                  )
                },
                {
                  key: 'created_at',
                  title: '创建时间',
                  render: (value: string) => (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(value).toLocaleString()}
                    </span>
                  )
                },
                {
                  key: 'actions',
                  title: '操作',
                  render: (value: any, record: Bill) => (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Eye}
                        onClick={() => handleViewBill(record)}
                      >
                        查看
                      </Button>
                      {record.status === 'pending' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={CheckCircle}
                            onClick={() => handleApproveBill(record.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            通过
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={XCircle}
                            onClick={() => handleRejectBill(record.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            拒绝
                          </Button>
                        </>
                      )}
                    </div>
                  )
                }
              ]}
              data={bills}
              loading={loading}
              emptyText="暂无账单数据"
            />
          </motion.div>

          {/* 账单详情模态框 */}
          <Modal
            isOpen={showBillModal}
            onClose={() => setShowBillModal(false)}
            title="账单详情"
            size="lg"
          >
            {selectedBill && (
              <div className="space-y-6">
                {/* 基本信息 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    基本信息
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        账单ID
                      </label>
                      <p className="text-gray-900 dark:text-white">{selectedBill.id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        申请人
                      </label>
                      <p className="text-gray-900 dark:text-white">{selectedBill?.user?.name || '未知用户'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        金额
                      </label>
                      <p className="text-gray-900 dark:text-white font-mono">
                        ¥{selectedBill.amount.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        类型
                      </label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedBill.type === 'user_application'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      }`}>
                        {selectedBill.type === 'user_application' ? '用户申请' : '管理员支付'}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        状态
                      </label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedBill.status === 'completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : selectedBill.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {selectedBill.status === 'completed' ? '已完成' : selectedBill.status === 'pending' ? '待处理' : '已拒绝'}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        备注
                      </label>
                      <p className="text-gray-900 dark:text-white">{selectedBill.remark}</p>
                    </div>
                  </div>
                </div>

                {/* 附件信息 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    附件信息
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedBill.payment_attachment && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          付款凭证
                        </label>
                        <img 
                          src={DataService.file.getFilePreviewUrl(selectedBill.payment_attachment)}
                          alt="付款凭证" 
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                    {selectedBill.proof_image && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          证明材料
                        </label>
                        <img 
                          src={DataService.file.getFilePreviewUrl(selectedBill.proof_image)}
                          alt="证明材料" 
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* 时间信息 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    时间信息
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        创建时间
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(selectedBill.created_at).toLocaleString()}
                      </p>
                    </div>
                    {selectedBill.updated_at && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          更新时间
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {new Date(selectedBill.updated_at).toLocaleString()}
                        </p>
                      </div>
                    )}
                    {selectedBill.approved_by && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          审批人
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          ID: {selectedBill.approved_by}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 审批按钮 */}
                {selectedBill.status === 'pending' && (
                  <div className="flex justify-end gap-3 mt-6">
                    <Button
                      variant="danger"
                      icon={XCircle}
                      onClick={() => handleRejectBill(selectedBill.id)}
                    >
                      拒绝
                    </Button>
                    <Button
                      variant="primary"
                      icon={CheckCircle}
                      onClick={() => handleApproveBill(selectedBill.id)}
                    >
                      通过
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Modal>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
