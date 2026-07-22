'use client';
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import FormInput from '@/components/ui/FormInput';
import api from '@/lib/api';
import { getUser } from '@/lib/auth';
import type { Attendance, Student, Course, ApiResponse } from '@/types';

const EMPTY = { studentId: '', courseId: '', date: new Date().toISOString().split('T')[0], status: 'Present', remarks: '' };

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const user = getUser();
  const canMark = user?.role === 'Admin' || user?.role === 'Faculty';

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get<ApiResponse<Attendance[]>>('/attendance'),
      api.get<ApiResponse<Student[]>>('/students'),
      api.get<ApiResponse<Course[]>>('/courses'),
    ]).then(([a, s, c]) => {
      setAttendance(a.data.data);
      setStudents(s.data.data);
      setCourses(c.data.data);
    }).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = attendance.filter(a =>
    a.studentName.toLowerCase().includes(search.toLowerCase()) ||
    a.courseName.toLowerCase().includes(search.toLowerCase()) ||
    a.rollNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/attendance', { ...form, studentId: parseInt(form.studentId), courseId: parseInt(form.courseId), date: form.date });
      setModal(false); load();
    } catch {} finally { setSaving(false); }
  };

  const statusVariant = (s: string) => s === 'Present' ? 'success' : s === 'Absent' ? 'danger' : 'warning';

  const columns = [
    { key: 'rollNumber', header: 'Roll No', render: (a: Attendance) => <span className="font-mono text-xs text-brand-700 bg-brand-50 px-2 py-1 rounded">{a.rollNumber}</span> },
    { key: 'studentName', header: 'Student', render: (a: Attendance) => <span className="font-medium text-gray-800">{a.studentName}</span> },
    { key: 'courseName', header: 'Course' },
    { key: 'date', header: 'Date', render: (a: Attendance) => new Date(a.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
    { key: 'status', header: 'Status', render: (a: Attendance) => <Badge label={a.status} variant={statusVariant(a.status) as 'success' | 'danger' | 'warning'} /> },
    { key: 'remarks', header: 'Remarks', render: (a: Attendance) => <span className="text-gray-400 text-xs">{a.remarks ?? '—'}</span> },
  ];

  return (
    <DashboardLayout>
      <div className="bg-white rounded-2xl shadow-card">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div><h2 className="font-display font-bold text-gray-900 text-lg">Attendance</h2><p className="text-sm text-gray-400">{filtered.length} records</p></div>
          <div className="flex items-center gap-3">
            <input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-100 bg-gray-50" />
            {canMark && (
              <button onClick={() => { setForm(EMPTY); setModal(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition">
                <Plus size={16} /> Mark Attendance
              </button>
            )}
          </div>
        </div>
        <div className="p-2"><DataTable columns={columns} data={filtered} loading={loading} /></div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Mark Attendance">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Student</label>
            <select value={form.studentId} onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-100">
              <option value="">Select student</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.rollNumber} — {s.fullName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Course</label>
            <select value={form.courseId} onChange={e => setForm(f => ({ ...f, courseId: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-100">
              <option value="">Select course</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.courseCode} — {c.courseName}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Date" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-100">
                <option>Present</option><option>Absent</option><option>Late</option>
              </select>
            </div>
          </div>
          <FormInput label="Remarks (optional)" value={form.remarks} onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))} placeholder="e.g. Medical leave" />
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.studentId || !form.courseId}
            className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 disabled:opacity-60 transition">
            Mark Attendance
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
