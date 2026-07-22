import clsx from 'clsx';

interface Props {
  label: string;
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'default';
}

const variants = {
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  danger:  'bg-red-50 text-red-600 ring-1 ring-red-200',
  warning: 'bg-orange-50 text-orange-600 ring-1 ring-orange-200',
  info:    'bg-blue-50 text-blue-600 ring-1 ring-blue-200',
  default: 'bg-gray-100 text-gray-600',
};

export default function Badge({ label, variant = 'default' }: Props) {
  return (
    <span className={clsx('inline-block px-2.5 py-0.5 rounded-full text-xs font-medium', variants[variant])}>
      {label}
    </span>
  );
}
