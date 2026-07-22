'use client';
import { usePathname } from 'next/navigation';
import { Bell, Search } from 'lucide-react';
import { getUser } from '@/lib/auth';

const titles: Record<string, string> = {
  '/dashboard':  'Dashboard',
  '/students':   'Students',
  '/faculty':    'Faculty',
  '/courses':    'Courses',
  '/attendance': 'Attendance',
  '/results':    'Results',
};

export default function Navbar() {
  const pathname = usePathname();
  const user = getUser();
  const title = Object.entries(titles).find(([k]) => pathname.startsWith(k))?.[1] ?? 'Smart Campus';

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h1 className="font-display text-xl font-bold text-gray-900">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-xl hover:bg-gray-100 transition text-gray-500">
          <Search size={18} />
        </button>
        <button className="p-2 rounded-xl hover:bg-gray-100 transition text-gray-500 relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-gray-100">
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">
            {user?.name.charAt(0)}
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-gray-800">{user?.name}</div>
            <div className="text-xs text-gray-400">{user?.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
