'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface TableColumn<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  className?: string;
  onRowClick?: (record: T, index: number) => void;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  emptyText?: string;
}

export const Table = <T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  className = '',
  onRowClick,
  pagination,
  emptyText = '暂无数据'
}: TableProps<T>) => {
  const getCellValue = (record: T, column: TableColumn<T>) => {
    if (column.render) {
      const index = data.indexOf(record);
      return column.render(record[column.key as keyof T], record, index);
    }
    return record[column.key as keyof T];
  };

  const getAlignClass = (align?: string) => {
    switch (align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };

  return (
    <div className={`ios-card ${className}`}>
      {/* 表格容器 */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          {/* 表头 */}
          <thead>
            <tr className="border-b border-white/10">
              {columns.map((column, index) => (
                <th
                  key={`header-${index}`}
                  className={`px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 ${getAlignClass(column.align)}`}
                  style={{ width: column.width }}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          
          {/* 表体 */}
          <tbody>
            {loading ? (
              // 加载状态
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={`loading-${index}`}>
                  {columns.map((_, colIndex) => (
                    <td key={`loading-cell-${colIndex}`} className="px-4 py-4">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // 空数据状态
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              // 数据行
              data.map((record, index) => (
                <motion.tr
                  key={index}
                  className={`border-b border-white/5 transition-colors duration-200 ${
                    onRowClick ? 'hover:bg-white/5 cursor-pointer' : ''
                  }`}
                  onClick={() => onRowClick?.(record, index)}
                  whileHover={onRowClick ? { backgroundColor: 'rgba(255, 255, 255, 0.05)' } : {}}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={`cell-${index}-${colIndex}`}
                      className={`px-4 py-4 text-sm text-gray-900 dark:text-white ${getAlignClass(column.align)}`}
                    >
                      {getCellValue(record, column)}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* 分页 */}
      {pagination && pagination.total > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            显示 {((pagination.current - 1) * pagination.pageSize) + 1} - {Math.min(pagination.current * pagination.pageSize, pagination.total)} 条，共 {pagination.total} 条
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              icon={ChevronLeft}
              disabled={pagination.current <= 1}
              onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
            />
            
            <span className="text-sm text-gray-900 dark:text-white">
              {pagination.current} / {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              icon={ChevronRight}
              disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
              onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
            />
          </div>
        </div>
      )}
    </div>
  );
};