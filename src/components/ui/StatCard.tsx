import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'orange' | 'purple';
  trend?: number;
}

const colors = {
  blue:   { bg: 'bg-brand-50',   icon: 'bg-brand-500',  text: 'text-brand-600' },
  green:  { bg: 'bg-emerald-50', icon: 'bg-emerald-500', text: 'text-emerald-600' },
  orange: { bg: 'bg-orange-50',  icon: 'bg-orange-500',  text: 'text-orange-600' },
  purple: { bg: 'bg-purple-50',  icon: 'bg-purple-500',  text: 'text-purple-600' },
};

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'blue', trend }: Props) {
  const c = colors[color];
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-shadow fade-up">
      <div className="flex items-start justify-between mb-4">
        <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center', c.icon)}>
          <Icon size={20} className="text-white" />
        </div>
        {trend !== undefined && (
          <span className={clsx('text-xs font-medium px-2 py-1 rounded-full',
            trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500')}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="font-display text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-gray-600">{title}</div>
      {subtitle && <div className="text-xs text-gray-400 mt-0.5">{subtitle}</div>}
    </div>
  );
}
