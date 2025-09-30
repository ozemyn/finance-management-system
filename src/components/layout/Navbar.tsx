'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor, Menu, User, LogOut, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import LogoutConfirmModal from '../modals/LogoutConfirmModal';

interface NavbarProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick, showMenuButton = false }) => {
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('finance_system_theme') as 'light' | 'dark' | 'system' || 'system';
    }
    return 'system';
  });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // 主题初始化
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('finance_system_theme') as 'light' | 'dark' | 'system' || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
    const root = window.document.documentElement;
    const isDark = newTheme === 'dark' || 
      (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    root.classList.remove('light', 'dark');
    root.classList.add(isDark ? 'dark' : 'light');
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem('finance_system_theme', newTheme);
    applyTheme(newTheme);
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  const handleLogoutClick = () => {
    setShowUserMenu(false);
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    handleLogout();
  };

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor
  };

  const ThemeIcon = themeIcons[theme];

  // 如果还没有挂载完成，返回null避免闪烁
  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* 点击其他地方关闭用户菜单 */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-[50] bg-transparent"
          onClick={() => setShowUserMenu(false)}
        />
      )}
      
      <nav className="ios-navbar px-2 sm:px-4 py-2 sm:py-3 relative z-[40]">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* 左侧 */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1">
            {showMenuButton && (
              <Button
                variant="ghost"
                size="sm"
                icon={Menu}
                onClick={onMenuClick}
                className="md:hidden"
              />
            )}
            
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
              财务管理
            </h1>
          </div>

          {/* 中间（手机端主题切换） */}
          <div className="flex-shrink-0 md:hidden">
            <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-md rounded-xl p-1">
              {(['light', 'dark'] as const).map((themeOption) => {
                const Icon = themeIcons[themeOption];
                return (
                  <button
                    key={themeOption}
                    onClick={() => handleThemeChange(themeOption)}
                    className={`p-1.5 rounded-lg transition-colors duration-200 ${
                      theme === themeOption
                        ? 'bg-ios-blue text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* 右侧 */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* 桌面端主题切换 */}
            <div className="hidden md:flex items-center space-x-1 bg-white/20 backdrop-blur-md rounded-xl p-1">
              {(['light', 'dark', 'system'] as const).map((themeOption) => {
                const Icon = themeIcons[themeOption];
                return (
                  <button
                    key={themeOption}
                    onClick={() => handleThemeChange(themeOption)}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      theme === themeOption
                        ? 'bg-ios-blue text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>

            {/* 用户菜单 */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                icon={User}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2"
              >
                <span className="hidden sm:inline max-w-[100px] truncate">{user?.name}</span>
              </Button>

              {/* 用户下拉菜单 */}
              {showUserMenu && (
                <motion.div
                  className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-2 z-[60] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      // 跳转到个人资料页面
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center space-x-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span>个人资料</span>
                  </button>
                  
                  <button
                    onClick={handleLogoutClick}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>退出登录</span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 退出确认弹窗 */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
};