import axios, { AxiosResponse } from 'axios';
import { API_CONFIG } from '../config';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

interface RequestConfig {
  responseType?: 'json' | 'blob' | 'text' | 'arraybuffer';
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }

  async get<T>(url: string, params?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await axios.get(`${this.baseURL}${url}`, {
        params,
        headers: this.getHeaders(),
        responseType: config?.responseType
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  async post<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await axios.post(`${this.baseURL}${url}`, data, {
        headers: this.getHeaders(),
        responseType: config?.responseType
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  async put<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await axios.put(`${this.baseURL}${url}`, data, {
        headers: this.getHeaders(),
        responseType: config?.responseType
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await axios.delete(`${this.baseURL}${url}`, {
        headers: this.getHeaders(),
        responseType: config?.responseType
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  async upload(file: File, type: 'image' | 'document'): Promise<ApiResponse<{ file_url: string }>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadUrl = type === 'image' ? '/upload/image' : '/upload/document';
      // 直接构建需要的 headers，而不是删除属性
      const headers = {
        ...this.getHeaders(),
        Authorization: this.getHeaders().Authorization // 保留认证信息
      };
      
      const response: AxiosResponse = await axios.post(`${this.baseURL}${uploadUrl}`, formData, {
        headers
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }
}

export default new ApiService();