import { 
  MOCK_BILLS, 
  MOCK_USERS, 
  API_CONFIG 
} from '../config';
import { 
  Bill, 
  BillFormData,
  SearchParams,
  BillStatistics,
  ExportPDFParams,
  ApiResponse
} from '../types';
import apiService from './api.service';

// 模拟延迟函数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 账单管理服务
export class BillService {
  // 获取账单列表
  static async getBills(params?: SearchParams): Promise<Bill[]> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await delay(800);
      let bills = [...MOCK_BILLS];
      
      // 模拟用户信息
      bills = bills.map(bill => {
        const mappedBill = {
          ...bill,
          user: MOCK_USERS.find(user => user.id === bill.user_id)
        };
        return mappedBill;
      });
      
      // 模拟筛选
      if (params?.user_id) {
        bills = bills.filter(bill => bill.user_id === params.user_id);
      }
      
      if (params?.status) {
        bills = bills.filter(bill => bill.status === params.status);
      }
      
      if (params?.start_date) {
        bills = bills.filter(bill => new Date(bill.created_at) >= new Date(params.start_date!));
      }
      
      if (params?.end_date) {
        bills = bills.filter(bill => new Date(bill.created_at) <= new Date(params.end_date!));
      }
      
      // 按创建时间倒序排列
      bills.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      return bills;
    }
    
    const response = await apiService.get<Bill[]>('/bills', params);
    return response.data!;
  }

  // 获取账单详情
  static async getBill(id: number): Promise<Bill> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await delay(500);
      const bill = MOCK_BILLS.find(b => b.id === id);
      if (!bill) throw new Error('账单不存在');
      
      return {
        ...bill,
        user: MOCK_USERS.find(user => user.id === bill.user_id)
      } as Bill;
    }
    
    const response = await apiService.get<Bill>(`/bills/${id}`);
    return response.data!;
  }

  // 创建账单
  static async createBill(data: BillFormData): Promise<Bill> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await delay(1000);
      
      const newBill: Bill = {
        id: MOCK_BILLS.length + 1,
        user_id: data.user_id || 1,
        amount: data.amount,
        status: (data.user_id ? 'completed' : 'pending') as 'completed' | 'pending', // 管理员创建直接完成，用户申请待审核
        type: (data.user_id ? 'admin_payment' : 'user_application') as 'admin_payment' | 'user_application',
        payment_attachment: '/uploads/payments/mock_payment.jpg',
        proof_image: '/uploads/proofs/mock_proof.jpg',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        remark: data.remark,
        user: MOCK_USERS.find(user => user.id === (data.user_id || 1))
      };
      
      return newBill;
    }
    
    // 如果有文件，先上传
    const formData = new FormData();
    formData.append('user_id', (data.user_id || '').toString());
    formData.append('amount', data.amount.toString());
    formData.append('remark', data.remark || '');
    
    if (data.payment_attachment) {
      formData.append('payment_attachment', data.payment_attachment);
    }
    if (data.proof_image) {
      formData.append('proof_image', data.proof_image);
    }
    
    const response = await apiService.post<Bill>('/bills', formData);
    return response.data!;
  }

  // 审核账单
  static async approveBill(id: number): Promise<Bill> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await delay(800);
      const bill = MOCK_BILLS.find(b => b.id === id);
      if (!bill) throw new Error('账单不存在');
      
      return {
        ...bill,
        status: 'completed' as const,
        approved_by: 1, // 模拟审核人
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: MOCK_USERS.find(user => user.id === bill.user_id)
      } as Bill;
    }
    
    const response = await apiService.post<Bill>(`/bills/${id}/approve`);
    return response.data!;
  }

  // 拒绝账单
  static async rejectBill(id: number, reason?: string): Promise<Bill> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await delay(800);
      const bill = MOCK_BILLS.find(b => b.id === id);
      if (!bill) throw new Error('账单不存在');
      
      return {
        ...bill,
        status: 'rejected' as const,
        approved_by: 1,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        remark: reason || bill.remark,
        user: MOCK_USERS.find(user => user.id === bill.user_id)
      } as Bill;
    }
    
    const response = await apiService.post<Bill>(`/bills/${id}/reject`, { reason });
    return response.data!;
  }

  // 获取账单统计
  static async getBillStatistics(startDate: string, endDate: string): Promise<BillStatistics> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await delay(1000);
      
      // 筛选时间范围内的账单
      const filteredBills = MOCK_BILLS.filter(bill => {
        const billDate = new Date(bill.created_at);
        return billDate >= new Date(startDate) && billDate <= new Date(endDate);
      });
      
      // 计算统计数据
      const totalAmount = filteredBills.reduce((sum, bill) => sum + bill.amount, 0);
      const totalBills = filteredBills.length;
      
      // 按用户统计
      const userStats = MOCK_USERS.map(user => {
        const userBills = filteredBills.filter(bill => bill.user_id === user.id);
        return {
          user_id: user.id,
          user_name: user.name,
          total_amount: userBills.reduce((sum, bill) => sum + bill.amount, 0),
          bill_count: userBills.length,
          bills: userBills.map(bill => ({
            ...bill,
            user
          } as Bill))
        };
      }).filter(stat => stat.bill_count > 0);
      
      return {
        total_amount: totalAmount,
        total_bills: totalBills,
        period: {
          start_date: startDate,
          end_date: endDate
        },
        user_statistics: userStats
      };
    }
    
    const response = await apiService.get<BillStatistics>('/bills/statistics', {
      start_date: startDate,
      end_date: endDate
    });
    return response.data!;
  }

  // 导出PDF
  static async exportPDF(params: ExportPDFParams): Promise<Blob> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await delay(2000);
      
      // 模拟PDF内容生成
      const pdfContent = `
财务管理系统 - 账单导出报告

导出时间: ${new Date().toLocaleString()}
统计周期: ${params.start_date} 至 ${params.end_date}
导出角色: ${
        params.export_type === 'admin' ? '管理员' : '普通用户'
      }

账单明细:
-----------------
`;
      
      // 模拟返回Blob
      return new Blob([pdfContent], { type: 'application/pdf' });
    }
    
    const response = await apiService.post<Blob>('/export/pdf', { 
      ...params,
      responseType: 'blob'
    });
    return response.data as Blob;
  }
}

// 文件上传服务
export class FileService {
  // 上传图片
  static async uploadImage(file: File): Promise<string> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await delay(1500);
      // 模拟返回上传结果
      return `/uploads/images/mock_${Date.now()}_${file.name}`;
    }
    
    const response = await apiService.upload(file, 'image');
    return response.data!.file_url;
  }

  // 上传文档
  static async uploadDocument(file: File): Promise<string> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await delay(1500);
      return `/uploads/documents/mock_${Date.now()}_${file.name}`;
    }
    
    const response = await apiService.upload(file, 'document');
    return response.data!.file_url;
  }

  // 模拟文件预览URL
  static getFilePreviewUrl(filePath: string): string {
    if (API_CONFIG.USE_MOCK_DATA) {
      // 返回模拟图片URL
      return `https://via.placeholder.com/400x300?text=${encodeURIComponent('文件预览')}`;
    }
    
    return `${API_CONFIG.BASE_URL}/files${filePath}`;
  }
}