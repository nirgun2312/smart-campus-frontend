'use client';
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, UserCheck, UserX } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import FormInput from '@/components/ui/FormInput';
import api from '@/lib/api';
import { getUser } from '@/lib/auth';
import type { Student, ApiResponse } from '@/types';

const EMPTY = { fullName: '', email: '', password: '', rollNumber: '', department: '', semester: '', phoneNumber: '', dateOfBirth: '' };

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState<Student | null>(null);
  const [saving, setSaving] = useState(false);
  const user = getUser();
  const isAdmin = user?.role === 'Admin';

  const load = () => {
    setLoading(true);
    api.get<ApiResponse<Student[]>>('/students')
      .then(r => setStudents(r.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = students.filter(s =>
    s.fullName.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setForm(EMPTY); setEditing(null); setModal('create'); };
  const openEdit = (s: Student) => {
    setEditing(s);
    setForm({ fullName: s.fullName, email: s.email, password: '', rollNumber: s.rollNumber, department: s.department, semester: s.semester, phoneNumber: s.phoneNumber ?? '', dateOfBirth: s.dateOfBirth });
    setModal('edit');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (modal === 'create') {
        await api.post('/students', { ...form, dateOfBirth: form.dateOfBirth || '2000-01-01' });
      } else {
        await api.put(`/students/${editing!.id}`, { fullName: form.fullName, department: form.department, semester: form.semester, phoneNumber: form.phoneNumber });
      }
      setModal(null);
      load();
    } catch { } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this student?')) return;
    await api.delete(`/students/${id}`);
    load();
  };

  const columns = [
    { key: 'rollNumber', header: 'Roll No', render: (s: Student) => <span className="font-mono text-xs font-medium text-brand-700 bg-brand-50 px-2 py-1 rounded">{s.rollNumber}</span> },
    { key: 'fullName', header: 'Name', render: (s: Student) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">
          {s.fullName.charAt(0)}
        </div>
        <div>
          <div className="font-medium text-gray-800">{s.fullName}</div>
          <div className="text-xs text-gray-400">{s.email}</div>
        </div>
      </div>
    )},
    { key: 'department', header: 'Department' },
    { key: 'semester', header: 'Semester', render: (s: Student) => <Badge label={s.semester} variant="info" /> },
    { key: 'isActive', header: 'Status', render: (s: Student) => (
      s.isActive
        ? <Badge label="Active" variant="success" />
        : <Badge label="Inactive" variant="danger" />
    )},
    ...(isAdmin ? [{
      key: 'actions', header: 'Actions',
      render: (s: Student) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-brand-50 text-gray-500 hover:text-brand-600 transition">
            <Pencil size={14} />
          </button>
          <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500 transition">
            <Trash2 size={14} />
          </button>
        </div>
      )
    }] : []),
  ];

  return (
    <DashboardLayout>
      <div className="bg-white rounded-2xl shadow-card">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="font-display font-bold text-gray-900 text-lg">Students</h2>
            <p className="text-sm text-gray-400">{filtered.length} total students</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              placeholder="Search students…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-100 bg-gray-50"
            />
            {isAdmin && (
              <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-medium transition">
                <Plus size={16} /> Add Student
              </button>
            )}
          </div>
        </div>
        <div className="p-2">
          <DataTable columns={columns} data={filtered} loading={loading} emptyMessage="No students found" />
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal open={modal !== null} onClose={() => setModal(null)}
        title={modal === 'create' ? 'Add Student' : 'Edit Student'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Full Name" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="Arjun Mehta" />
            <FormInput label="Email" type="email" value={form.email} disabled={modal === 'edit'} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="student@campus.edu" />
          </div>
          {modal === 'create' && (
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" />
              <FormInput label="Roll Number" value={form.rollNumber} onChange={e => setForm(f => ({ ...f, rollNumber: e.target.value }))} placeholder="CS2024001" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Department" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} placeholder="Computer Science" />
            <FormInput label="Semester" value={form.semester} onChange={e => setForm(f => ({ ...f, semester: e.target.value }))} placeholder="6th" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Phone" value={form.phoneNumber} onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))} placeholder="9876543210" />
            {modal === 'create' && <FormInput label="Date of Birth" type="date" value={form.dateOfBirth} onChange={e => setForm(f => ({ ...f, dateOfBirth: e.target.value }))} />}
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 disabled:opacity-60 transition flex items-center justify-center gap-2">
            {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full spin" />}
            {modal === 'create' ? 'Add Student' : 'Save Changes'}
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
