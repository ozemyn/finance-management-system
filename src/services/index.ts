import { AuthService } from './data.service';
import { UserService } from './data.service';
import { ProfileService } from './data.service';
import { BillService, FileService } from './bill.service';
import apiService from './api.service';

// 服务类统一接口
export class DataService {
  static auth = AuthService;
  static user = UserService;
  static profile = ProfileService;
  static bill = BillService;
  static file = FileService;
}

export {
  AuthService,
  UserService,
  ProfileService,
  BillService,
  FileService,
  apiService,
};

export default DataService;