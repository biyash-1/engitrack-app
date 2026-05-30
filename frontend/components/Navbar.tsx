'use client';

import { useAuth } from '@/lib/auth';
import { Menu } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user } = useAuth();

  const getSubscriptionColor = (sub: string) => {
    switch (sub) {
      case 'enterprise': return 'bg-purple-100 text-purple-700';
      case 'professional': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        {user && (
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${getSubscriptionColor(user.subscription)}`}>
            {user.subscription.replace('_', ' ')}
          </span>
        )}

        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
