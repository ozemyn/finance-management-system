'use client';

import React from 'react';
import { motion } from 'framer-motion';

// 基础加载组件
interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`inline-block ${className}`}>
      <div
        className={`${sizeClasses[size]} border-2 border-gray-300 border-t-ios-blue rounded-full animate-spin`}
      />
    </div>
  );
};

// 页面加载组件
interface PageLoadingProps {
  message?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({ message = '加载中...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-gray-300 border-t-ios-blue rounded-full"
      />
      <p className="text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
};

// 内容加载组件
interface ContentLoadingProps {
  lines?: number;
  className?: string;
}

export const ContentLoading: React.FC<ContentLoadingProps> = ({ lines = 3, className = '' }) => {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="flex space-x-4">
          <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-4 w-4" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

// 表格加载组件
interface TableLoadingProps {
  rows?: number;
  columns?: number;
}

export const TableLoading: React.FC<TableLoadingProps> = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="animate-pulse">
      <div className="space-y-3">
        {/* 表头 */}
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: columns }).map((_, index) => (
            <div key={`header-${index}`} className="h-4 bg-gray-300 dark:bg-gray-600 rounded" />
          ))}
        </div>
        
        {/* 表格内容 */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="grid grid-cols-4 gap-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// 骨架屏组件
interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = 'w-full',
  height = 'h-4',
  className = '',
  variant = 'rectangular'
}) => {
  const variantClasses = {
    rectangular: 'rounded',
    circular: 'rounded-full',
    text: 'rounded'
  };

  return (
    <div
      className={`animate-pulse bg-gray-300 dark:bg-gray-600 ${width} ${height} ${variantClasses[variant]} ${className}`}
    />
  );
};