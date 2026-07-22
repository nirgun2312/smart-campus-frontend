'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, UserCircle, BookOpen,
  ClipboardList, BarChart3, LogOut, GraduationCap
} from 'lucide-react';
import { clearAuth, getUser } from '@/lib/auth';
import clsx from 'clsx';

const navItems = [
  { href: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/students',   label: 'Students',    icon: Users },
  { href: '/faculty',    label: 'Faculty',     icon: UserCircle },
  { href: '/courses',    label: 'Courses',     icon: BookOpen },
  { href: '/attendance', label: 'Attendance',  icon: ClipboardList },
  { href: '/results',    label: 'Results',     icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-7 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center">
          <GraduationCap size={20} className="text-white" />
        </div>
        <div>
          <div className="font-display text-white font-bold text-base leading-tight">Smart Campus</div>
          <div className="text-white/40 text-xs">Management System</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-4 py-5 border-t border-white/10">
        {user && (
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-brand-500/30 flex items-center justify-center text-white font-bold text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">{user.name}</div>
              <div className="text-white/40 text-xs">{user.role}</div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-4 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition text-sm font-medium"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
