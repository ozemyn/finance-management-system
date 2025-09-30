'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar } from 'lucide-react';
import {
  Layout,
  ProtectedRoute,
  Card,
  Button,
  DateRangePicker
} from '@/components';
import { DataService } from '@/services';
import toast from 'react-hot-toast';

export default function AdminExportPage() {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null
  });

  // 处理导出账单
  const handleExportBills = async () => {
    try {
      if (!dateRange.startDate || !dateRange.endDate) {
        toast.error('请选择导出时间范围');
        return;
      }

      setLoading(true);
      const params = {
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString()
      };

      // 调用导出接口
      const response = await DataService.bill.exportBills(params);
      
      // 创建下载链接
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `账单报表_${new Date().toLocaleDateString()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('导出成功');
    } catch (error: any) {
      toast.error(error.message || '导出失败');
    } finally {
      setLoading(false);
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
              账单导出
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              导出指定时间范围内的账单数据
            </p>
          </motion.div>

          {/* 导出配置卡片 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    导出设置
                  </h3>
                  <div className="space-y-4">
                    {/* 时间范围选择 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        时间范围
                      </label>
                      <DateRangePicker
                        startDate={dateRange.startDate}
                        endDate={dateRange.endDate}
                        onChange={(range) => setDateRange({
                          startDate: range.startDate,
                          endDate: range.endDate
                        })}
                        className="w-full"
                      />
                    </div>

                    {/* 导出说明 */}
                    <div className="bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            导出说明
                          </h4>
                          <ul className="mt-2 text-sm text-blue-700 dark:text-blue-300 list-disc list-inside space-y-1">
                            <li>导出格式为 PDF 文件</li>
                            <li>包含账单基本信息、申请人、金额等数据</li>
                            <li>建议选择合适的时间范围，避免数据量过大</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    icon={Download}
                    loading={loading}
                    onClick={handleExportBills}
                  >
                    开始导出
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
} 