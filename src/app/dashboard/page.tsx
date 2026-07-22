'use client';
import { useEffect, useState } from 'react';
import { Users, UserCircle, BookOpen, ClipboardList, TrendingUp } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/ui/StatCard';
import AttendanceChart from '@/components/charts/AttendanceChart';
import DeptPieChart from '@/components/charts/DeptPieChart';
import GradeChart from '@/components/charts/GradeChart';
import api from '@/lib/api';
import type { ApiResponse, DashboardStats } from '@/types';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<ApiResponse<DashboardStats>>('/dashboard/stats')
      .then(r => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard title="Total Students" value={loading ? '…' : stats?.totalStudents ?? 0}
            icon={Users} color="blue" trend={4} subtitle="Enrolled this semester" />
          <StatCard title="Faculty Members" value={loading ? '…' : stats?.totalFaculty ?? 0}
            icon={UserCircle} color="purple" subtitle="Active instructors" />
          <StatCard title="Active Courses" value={loading ? '…' : stats?.totalCourses ?? 0}
            icon={BookOpen} color="green" trend={2} subtitle="Running this term" />
          <StatCard title="Today's Attendance" value={loading ? '…' : `${stats?.attendanceRate ?? 0}%`}
            icon={ClipboardList} color="orange"
            subtitle={`${stats?.presentToday ?? 0} of ${stats?.totalToday ?? 0} present`} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Attendance Chart */}
          <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display font-bold text-gray-900">Monthly Attendance</h3>
                <p className="text-sm text-gray-400 mt-0.5">Last 6 months overview</p>
              </div>
              <div className="p-2 bg-brand-50 rounded-xl">
                <TrendingUp size={18} className="text-brand-600" />
              </div>
            </div>
            {loading ? (
              <div className="h-64 flex items-center justify-center text-gray-300 text-sm">Loading chart…</div>
            ) : (
              <AttendanceChart data={stats?.monthlyAttendance ?? []} />
            )}
          </div>

          {/* Dept Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <div className="mb-5">
              <h3 className="font-display font-bold text-gray-900">Dept. Distribution</h3>
              <p className="text-sm text-gray-400 mt-0.5">Students by department</p>
            </div>
            {loading ? (
              <div className="h-64 flex items-center justify-center text-gray-300 text-sm">Loading chart…</div>
            ) : (
              <DeptPieChart data={stats?.deptDistribution ?? []} />
            )}
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="mb-5">
            <h3 className="font-display font-bold text-gray-900">Grade Distribution</h3>
            <p className="text-sm text-gray-400 mt-0.5">Results overview across all exams</p>
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-gray-300 text-sm">Loading chart…</div>
          ) : (
            <GradeChart data={stats?.gradeDistribution ?? []} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
