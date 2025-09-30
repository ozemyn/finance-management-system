// 全局环境变量配置

// 当前使用的配置：虚拟数据配置（测试用）
// 切换到真实数据时，只需修改下面的导入路径

// 虚拟数据配置（当前使用）
export * from './mock.config';

// 真实数据配置（部署时切换）
// export * from './api.config';

// 切换说明：
// 1. 测试阶段：使用上面的 mock.config 导入
// 2. 部署阶段：注释上面的导入，取消注释下面的 api.config 导入
// 3. 这样可以无缝切换数据源，而不需要修改其他任何代码

// 系统配置
export const SYSTEM_CONFIG = {
  APP_NAME: '财务管理系统',
  VERSION: '1.0.0',
  API_VERSION: 'v1',
  
  // 文件上传配置
  UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  },
  
  // 分页配置
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
  },
  
  // 日期格式
  DATE_FORMAT: {
    DISPLAY: 'YYYY-MM-DD HH:mm:ss',
    DATE_ONLY: 'YYYY-MM-DD',
    TIME_ONLY: 'HH:mm:ss'
  },
  
  // 缓存配置
  CACHE: {
    TOKEN_KEY: 'finance_system_token',
    USER_KEY: 'finance_system_user',
    THEME_KEY: 'finance_system_theme',
    SIDEBAR_KEY: 'finance_system_sidebar_collapsed'
  },
  
  // 默认主题配置
  THEME: {
    DEFAULT_MODE: 'system', // 'light' | 'dark' | 'system'
    PRIMARY_COLOR: '#007AFF',
    GLASS_EFFECT: true
  }
};