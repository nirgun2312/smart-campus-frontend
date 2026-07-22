'use client';
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import FormInput from '@/components/ui/FormInput';
import api from '@/lib/api';
import { getUser } from '@/lib/auth';
import type { Course, Faculty, ApiResponse } from '@/types';

const EMPTY = { courseCode: '', courseName: '', department: '', credits: '3', semester: '', facultyId: '' };

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState<Course | null>(null);
  const [saving, setSaving] = useState(false);
  const user = getUser();
  const isAdmin = user?.role === 'Admin';

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get<ApiResponse<Course[]>>('/courses'),
      api.get<ApiResponse<Faculty[]>>('/faculty'),
    ]).then(([c, f]) => { setCourses(c.data.data); setFaculty(f.data.data); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = courses.filter(c =>
    c.courseName.toLowerCase().includes(search.toLowerCase()) ||
    c.courseCode.toLowerCase().includes(search.toLowerCase()) ||
    c.department.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setForm(EMPTY); setEditing(null); setModal('create'); };
  const openEdit = (c: Course) => {
    setEditing(c);
    setForm({ courseCode: c.courseCode, courseName: c.courseName, department: c.department, credits: String(c.credits), semester: c.semester, facultyId: String(c.facultyId ?? '') });
    setModal('edit');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, credits: parseInt(form.credits), facultyId: form.facultyId ? parseInt(form.facultyId) : null };
      if (modal === 'create') await api.post('/courses', payload);
      else await api.put(`/courses/${editing!.id}`, { ...payload, isActive: true });
      setModal(null); load();
    } catch {} finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this course?')) return;
    await api.delete(`/courses/${id}`); load();
  };

  const columns = [
    { key: 'courseCode', header: 'Code', render: (c: Course) => <span className="font-mono text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">{c.courseCode}</span> },
    { key: 'courseName', header: 'Course Name', render: (c: Course) => <span className="font-medium text-gray-800">{c.courseName}</span> },
    { key: 'department', header: 'Department' },
    { key: 'credits', header: 'Credits', render: (c: Course) => <Badge label={`${c.credits} cr`} variant="default" /> },
    { key: 'semester', header: 'Semester' },
    { key: 'facultyName', header: 'Faculty', render: (c: Course) => c.facultyName ? <span className="text-gray-600">{c.facultyName}</span> : <span className="text-gray-300">—</span> },
    { key: 'enrolledCount', header: 'Enrolled', render: (c: Course) => <Badge label={String(c.enrolledCount)} variant="info" /> },
    { key: 'isActive', header: 'Status', render: (c: Course) => <Badge label={c.isActive ? 'Active' : 'Inactive'} variant={c.isActive ? 'success' : 'danger'} /> },
    ...(isAdmin ? [{ key: 'actions', header: 'Actions', render: (c: Course) => (
      <div className="flex gap-2">
        <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-emerald-50 text-gray-500 hover:text-emerald-600 transition"><Pencil size={14} /></button>
        <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500 transition"><Trash2 size={14} /></button>
      </div>
    )}] : []),
  ];

  return (
    <DashboardLayout>
      <div className="bg-white rounded-2xl shadow-card">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div><h2 className="font-display font-bold text-gray-900 text-lg">Courses</h2><p className="text-sm text-gray-400">{filtered.length} courses</p></div>
          <div className="flex items-center gap-3">
            <input placeholder="Search courses…" value={search} onChange={e => setSearch(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-100 bg-gray-50" />
            {isAdmin && (
              <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition">
                <Plus size={16} /> Add Course
              </button>
            )}
          </div>
        </div>
        <div className="p-2"><DataTable columns={columns} data={filtered} loading={loading} /></div>
      </div>

      <Modal open={modal !== null} onClose={() => setModal(null)} title={modal === 'create' ? 'Add Course' : 'Edit Course'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Course Code" value={form.courseCode} disabled={modal === 'edit'} onChange={e => setForm(f => ({ ...f, courseCode: e.target.value }))} placeholder="CS301" />
            <FormInput label="Course Name" value={form.courseName} onChange={e => setForm(f => ({ ...f, courseName: e.target.value }))} placeholder="Data Structures" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Department" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} placeholder="Computer Science" />
            <FormInput label="Semester" value={form.semester} onChange={e => setForm(f => ({ ...f, semester: e.target.value }))} placeholder="6th" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Credits" type="number" min="1" max="6" value={form.credits} onChange={e => setForm(f => ({ ...f, credits: e.target.value }))} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Faculty</label>
              <select value={form.facultyId} onChange={e => setForm(f => ({ ...f, facultyId: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-100">
                <option value="">— Unassigned —</option>
                {faculty.map(f => <option key={f.id} value={f.id}>{f.fullName}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-60 transition">
            {modal === 'create' ? 'Add Course' : 'Save Changes'}
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
