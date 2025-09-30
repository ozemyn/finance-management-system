import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG, API_ENDPOINTS, HTTP_STATUS, ERROR_MESSAGES } from '../config';
import { ApiResponse } from '../types';
import toast from 'react-hot-toast';

// 创建 axios 实例
class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  // 获取保存的token
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('finance_system_token');
    }
    return null;
  }

  // 保存token
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('finance_system_token', token);
    }
  }

  // 清除token
  clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('finance_system_token');
      localStorage.removeItem('finance_system_user');
    }
  }

  // 错误处理
  private handleError(error: AxiosError): void {
    let message = ERROR_MESSAGES.NETWORK_ERROR;

    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case HTTP_STATUS.UNAUTHORIZED:
          message = ERROR_MESSAGES.UNAUTHORIZED;
          this.clearToken();
          // 跳转到登录页
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          break;
        case HTTP_STATUS.FORBIDDEN:
          message = ERROR_MESSAGES.FORBIDDEN;
          break;
        case HTTP_STATUS.NOT_FOUND:
          message = ERROR_MESSAGES.NOT_FOUND;
          break;
        case HTTP_STATUS.BAD_REQUEST:
          message = error.response.data?.message || ERROR_MESSAGES.VALIDATION_ERROR;
          break;
        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
          message = ERROR_MESSAGES.SERVER_ERROR;
          break;
        default:
          message = error.response.data?.message || ERROR_MESSAGES.NETWORK_ERROR;
      }
    }

    toast.error(message);
  }

  // GET 请求
  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    const response = await this.api.get(url, { params });
    return response.data;
  }

  // POST 请求
  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.api.post(url, data);
    return response.data;
  }

  // PUT 请求
  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.api.put(url, data);
    return response.data;
  }

  // DELETE 请求
  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.api.delete(url);
    return response.data;
  }

  // 文件上传
  async upload(file: File, type: 'image' | 'document' = 'image'): Promise<ApiResponse<{ file_url: string; file_name: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await this.api.post(
      type === 'image' ? API_ENDPOINTS.UPLOAD.IMAGE : API_ENDPOINTS.UPLOAD.DOCUMENT,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  }

  // 下载文件
  async download(url: string, filename?: string): Promise<void> {
    const response = await this.api.get(url, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }
}

// 导出单例
export const apiService = new ApiService();
export default apiService;