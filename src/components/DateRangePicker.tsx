import React from 'react';
import { Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (range: { startDate: Date | null; endDate: Date | null }) => void;
  className?: string;
}

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  className = ''
}: DateRangePickerProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <DatePicker
              selected={startDate}
              onChange={(date) => onChange({ startDate: date, endDate })}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="yyyy-MM-dd"
              placeholderText="开始日期"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ios-blue focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
            <Calendar className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="flex-1">
          <div className="relative">
            <DatePicker
              selected={endDate}
              onChange={(date) => onChange({ startDate, endDate: date })}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat="yyyy-MM-dd"
              placeholderText="结束日期"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ios-blue focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
            <Calendar className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
} 