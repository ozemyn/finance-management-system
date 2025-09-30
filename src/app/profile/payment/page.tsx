'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  CreditCard, 
  Smartphone, 
  Upload, 
  Save, 
  AlertCircle,
  CheckCircle2,
  FileText,
  QrCode
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Layout,
  ProtectedRoute,
  Card,
  Button,
  Input,
  Loading
} from '../../../components';
import { useAuth } from '../../../hooks/useAuth';
import { DataService } from '../../../services';
import { PaymentInfo } from '../../../types';
import toast from 'react-hot-toast';

type PaymentType = 'alipay' | 'bank';

export default function PaymentInfoPage() {
  const { user, updateUser } = useAuth();
  const [paymentType, setPaymentType] = useState<PaymentType>('alipay');
  const [saving, setSaving] = useState(false);
  const [qrCodeFile, setQrCodeFile] = useState<File | null>(null);
  const [qrCodePreview, setQrCodePreview] = useState<string>('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<PaymentInfo>();

  // 初始化表单数据
  useEffect(() => {
    if (user?.payment_info) {
      reset(user.payment_info);
      // 根据已有信息设置支付类型
      if (user.payment_info.alipay_account) {
        setPaymentType('alipay');
      } else if (user.payment_info.bank_card) {
        setPaymentType('bank');
      }
      
      // 设置二维码预览
      if (user.payment_info.alipay_qr_code) {
        setQrCodePreview(DataService.file.getFilePreviewUrl(user.payment_info.alipay_qr_code));
      }
    }
  }, [user, reset]);

  const onSubmit = async (data: PaymentInfo) => {
    try {
      setSaving(true);
      
      let qrCodeUrl = data.alipay_qr_code;
      
      // 如果选择了支付宝并且上传了新的二维码
      if (paymentType === 'alipay' && qrCodeFile) {
        qrCodeUrl = await DataService.file.uploadImage(qrCodeFile);
      }
      
      const paymentInfo: PaymentInfo = {
        ...(paymentType === 'alipay' ? {
          alipay_account: data.alipay_account,
          alipay_qr_code: qrCodeUrl,
          bank_card: undefined,
          id_card: undefined
        } : {
          bank_card: data.bank_card,
          id_card: data.id_card,
          alipay_account: undefined,
          alipay_qr_code: undefined
        })
      };
      
      const updatedUser = await DataService.profile.updatePaymentInfo(paymentInfo);
      updateUser(updatedUser);
      toast.success('收款信息更新成功');
    } catch (error: any) {
      toast.error(error.message || '更新失败');
    } finally {
      setSaving(false);
    }
  };

  const handleQrCodeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('文件大小不能超过5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('请选择图片文件');
        return;
      }
      
      setQrCodeFile(file);
      
      // 预览图片
      const reader = new FileReader();
      reader.onload = (e) => {
        setQrCodePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const hasPaymentInfo = user?.payment_info && (
    user.payment_info.alipay_account || user.payment_info.bank_card
  );

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
    <ProtectedRoute requiredRole="user">
      <Layout>
        <div className="space-y-6">
          {/* 页面头部 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              收款信息
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              设置您的收款方式，用于接收账单款项
            </p>
          </motion.div>

          {/* 状态提示 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className={hasPaymentInfo ? 'border-green-200 bg-green-50 dark:bg-green-900/20' : 'border-orange-200 bg-orange-50 dark:bg-orange-900/20'}>
              <div className="flex items-start space-x-3">
                {hasPaymentInfo ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                )}
                <div>
                  <h3 className={`font-medium ${hasPaymentInfo ? 'text-green-900 dark:text-green-100' : 'text-orange-900 dark:text-orange-100'}`}>
                    {hasPaymentInfo ? '收款信息已设置' : '需要设置收款信息'}
                  </h3>
                  <p className={`text-sm mt-1 ${hasPaymentInfo ? 'text-green-700 dark:text-green-300' : 'text-orange-700 dark:text-orange-300'}`}>
                    {hasPaymentInfo 
                      ? '您已成功设置收款信息，可以正常申请账单' 
                      : '请至少填写一种收款方式，否则无法发起账单申请'
                    }
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 主表单区域 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card>
                {/* 支付类型选择 */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    选择收款方式
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentType('alipay')}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        paymentType === 'alipay'
                          ? 'border-ios-blue bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Smartphone className="w-6 h-6 text-blue-600" />
                        <div className="text-left">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            支付宝
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            需要支付宝账号 + 收款码
                          </p>
                        </div>
                      </div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setPaymentType('bank')}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        paymentType === 'bank'
                          ? 'border-ios-blue bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-6 h-6 text-green-600" />
                        <div className="text-left">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            银行卡
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            需要银行卡号 + 身份证号
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 表单 */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {paymentType === 'alipay' ? (
                    // 支付宝表单
                    <div className="space-y-6">
                      <Input
                        label="支付宝账号"
                        icon={Smartphone}
                        placeholder="请输入支付宝账号（手机号或邮箱）"
                        error={errors.alipay_account?.message}
                        {...register('alipay_account', {
                          required: paymentType === 'alipay' ? '请输入支付宝账号' : false
                        })}
                      />
                      
                      {/* 收款码上传 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          支付宝收款码
                        </label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center">
                          {qrCodePreview ? (
                            <div className="space-y-4">
                              <img 
                                src={qrCodePreview} 
                                alt="收款码预览" 
                                className="mx-auto w-32 h-32 object-cover rounded-lg"
                              />
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                icon={Upload}
                                onClick={() => document.getElementById('qr-upload')?.click()}
                              >
                                更换图片
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <QrCode className="w-12 h-12 text-gray-400 mx-auto" />
                              <div>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  icon={Upload}
                                  onClick={() => document.getElementById('qr-upload')?.click()}
                                >
                                  上传收款码
                                </Button>
                                <p className="text-xs text-gray-500 mt-2">
                                  支持 JPG、PNG 格式，文件大小不超过5MB
                                </p>
                              </div>
                            </div>
                          )}
                          <input
                            id="qr-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleQrCodeUpload}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    // 银行卡表单
                    <div className="space-y-6">
                      <Input
                        label="银行卡号"
                        icon={CreditCard}
                        placeholder="请输入银行卡号"
                        error={errors.bank_card?.message}
                        {...register('bank_card', {
                          required: paymentType === 'bank' ? '请输入银行卡号' : false,
                          pattern: {
                            value: /^\d{16,19}$/,
                            message: '请输入正确的银行卡号'
                          }
                        })}
                      />
                      
                      <Input
                        label="身份证号"
                        icon={FileText}
                        placeholder="请输入身份证号"
                        error={errors.id_card?.message}
                        {...register('id_card', {
                          required: paymentType === 'bank' ? '请输入身份证号' : false,
                          pattern: {
                            value: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
                            message: '请输入正确的身份证号'
                          }
                        })}
                      />
                    </div>
                  )}

                  {/* 保存按钮 */}
                  <Button
                    type="submit"
                    variant="primary"
                    icon={Save}
                    loading={saving}
                    className="w-full sm:w-auto"
                  >
                    保存收款信息
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* 侧边栏 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* 帮助信息 */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  填写说明
                </h3>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      支付宝收款：
                    </h4>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>填写支付宝账号（手机或邮箱）</li>
                      <li>上传个人收款二维码</li>
                      <li>无需身份证信息</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      银行卡收款：
                    </h4>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>填写银行卡号</li>
                      <li>必须填写身份证号</li>
                      <li>用于验证银行卡所有者</li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* 安全提示 */}
              <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  安全提示
                </h3>
                <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                  <p>• 您的收款信息仅用于账单结算</p>
                  <p>• 系统采用加密存储，保障信息安全</p>
                  <p>• 只有您和管理员可以查看</p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}