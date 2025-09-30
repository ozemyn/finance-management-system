export const ROUTES = {
  // 公共路由
  LOGIN: '/login',
  REGISTER: '/register',

  // 管理员路由
  ADMIN: {
    HOME: '/admin',
    USERS: '/admin/users',
    BILLS: '/admin/bills',
    STATISTICS: '/admin/statistics',
    EXPORT: '/admin/export'
  },

  // 用户路由
  USER: {
    HOME: '/profile',
    PROFILE: '/profile',
    PAYMENT: '/profile/payment',
    BILLS: '/bills',
    CREATE_BILL: '/bills/create',
    EXPORT: '/bills/export'
  }
} as const;

// 获取用户默认首页
export const getDefaultHomePage = (role: 'admin' | 'user'): string => {
  return role === 'admin' ? ROUTES.ADMIN.HOME : ROUTES.USER.HOME;
}; 