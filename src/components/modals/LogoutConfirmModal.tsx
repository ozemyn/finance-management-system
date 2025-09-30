import { LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { ConfirmModal } from '../ui/Modal';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutConfirmModalProps) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="确认退出"
      message="您确定要退出登录吗？退出后需要重新登录才能访问系统。"
      confirmText="确认退出"
      cancelText="取消"
      variant="danger"
    />
  );
} 