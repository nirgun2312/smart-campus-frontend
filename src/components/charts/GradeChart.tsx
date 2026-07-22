'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const GRADE_COLORS: Record<string, string> = {
  'A+': '#10b981', 'A': '#34d399', 'B+': '#3366ff', 'B': '#60a5fa',
  'C+': '#f59e0b', 'C': '#fbbf24', 'D': '#f97316', 'F': '#ef4444',
};

interface Props {
  data: { grade: string; count: number }[];
}

export default function GradeChart({ data }: Props) {
  const sorted = [...data].sort((a, b) => {
    const order = ['A+','A','B+','B','C+','C','D','F'];
    return order.indexOf(a.grade) - order.indexOf(b.grade);
  });

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={sorted} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis dataKey="grade" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 13 }}
          cursor={{ fill: '#f8fafc' }}
        />
        <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Students">
          {sorted.map((entry, i) => (
            <Cell key={i} fill={GRADE_COLORS[entry.grade] ?? '#94a3b8'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
