'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor, Menu, User, LogOut, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

interface NavbarProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick, showMenuButton = false }) => {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [showUserMenu, setShowUserMenu] = useState(false);

  // 主题切换
  useEffect(() => {
    const savedTheme = localStorage.getItem('finance_system_theme') as 'light' | 'dark' | 'system' || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
    const root = window.document.documentElement;
    
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      root.classList.toggle('dark', newTheme === 'dark');
    }
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

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor
  };

  const ThemeIcon = themeIcons[theme];

  return (
    <motion.nav
      className="ios-navbar px-4 py-3"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-between">
        {/* 左侧 */}
        <div className="flex items-center space-x-4">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="sm"
              icon={Menu}
              onClick={onMenuClick}
              className="md:hidden"
            />
          )}
          
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            财务管理系统
          </h1>
        </div>

        {/* 中间（手机端主题切换） */}
        <div className="md:hidden">
          <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-md rounded-xl p-1">
            {(['light', 'dark', 'system'] as const).map((themeOption) => {
              const Icon = themeIcons[themeOption];
              return (
                <button
                  key={themeOption}
                  onClick={() => handleThemeChange(themeOption)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
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
        <div className="flex items-center space-x-4">
          {/* 桌面端主题切换 */}
          <div className="hidden md:flex items-center space-x-1 bg-white/20 backdrop-blur-md rounded-xl p-1">
            {(['light', 'dark', 'system'] as const).map((themeOption) => {
              const Icon = themeIcons[themeOption];
              return (
                <button
                  key={themeOption}
                  onClick={() => handleThemeChange(themeOption)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
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
              className="flex items-center space-x-2"
            >
              <span className="hidden md:inline">{user?.name}</span>
            </Button>

            {/* 用户下拉菜单 */}
            {showUserMenu && (
              <motion.div
                className="absolute right-0 mt-2 w-48 glass-effect rounded-xl shadow-lg py-2 z-50"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="px-4 py-2 border-b border-white/10">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
                
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    // 跳转到个人资料页面
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-white/10 flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>个人资料</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-white/10 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>退出登录</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      {/* 点击其他地方关闭用户菜单 */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </motion.nav>
  );
};