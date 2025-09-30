// 数据服务统一导出
export { AuthService } from './data.service';
export { UserService } from './data.service';
export { ProfileService } from './data.service';
export { BillService, FileService } from './bill.service';
export { default as apiService } from './api.service';

// 服务类统一接口
export class DataService {
  static auth = AuthService;
  static user = UserService;
  static profile = ProfileService;
  static bill = BillService;
  static file = FileService;
}

export default DataService;