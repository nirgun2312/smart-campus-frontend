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
import type { Faculty, ApiResponse } from '@/types';

const EMPTY = { fullName: '', email: '', password: '', employeeId: '', department: '', designation: '', phoneNumber: '', specialization: '' };

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState<Faculty | null>(null);
  const [saving, setSaving] = useState(false);
  const user = getUser();
  const isAdmin = user?.role === 'Admin';

  const load = () => {
    setLoading(true);
    api.get<ApiResponse<Faculty[]>>('/faculty').then(r => setFaculty(r.data.data)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = faculty.filter(f =>
    f.fullName.toLowerCase().includes(search.toLowerCase()) ||
    f.employeeId.toLowerCase().includes(search.toLowerCase()) ||
    f.department.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setForm(EMPTY); setEditing(null); setModal('create'); };
  const openEdit = (f: Faculty) => {
    setEditing(f);
    setForm({ fullName: f.fullName, email: f.email, password: '', employeeId: f.employeeId, department: f.department, designation: f.designation, phoneNumber: f.phoneNumber ?? '', specialization: f.specialization ?? '' });
    setModal('edit');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (modal === 'create') await api.post('/faculty', form);
      else await api.put(`/faculty/${editing!.id}`, { fullName: form.fullName, department: form.department, designation: form.designation, phoneNumber: form.phoneNumber, specialization: form.specialization });
      setModal(null); load();
    } catch {} finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this faculty member?')) return;
    await api.delete(`/faculty/${id}`); load();
  };

  const columns = [
    { key: 'employeeId', header: 'ID', render: (f: Faculty) => <span className="font-mono text-xs font-medium text-purple-700 bg-purple-50 px-2 py-1 rounded">{f.employeeId}</span> },
    { key: 'fullName', header: 'Name', render: (f: Faculty) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">{f.fullName.charAt(0)}</div>
        <div><div className="font-medium text-gray-800">{f.fullName}</div><div className="text-xs text-gray-400">{f.email}</div></div>
      </div>
    )},
    { key: 'department', header: 'Department' },
    { key: 'designation', header: 'Designation', render: (f: Faculty) => <Badge label={f.designation} variant="info" /> },
    { key: 'specialization', header: 'Specialization' },
    { key: 'courseCount', header: 'Courses', render: (f: Faculty) => <Badge label={String(f.courseCount)} variant="default" /> },
    ...(isAdmin ? [{ key: 'actions', header: 'Actions', render: (f: Faculty) => (
      <div className="flex gap-2">
        <button onClick={() => openEdit(f)} className="p-1.5 rounded-lg hover:bg-purple-50 text-gray-500 hover:text-purple-600 transition"><Pencil size={14} /></button>
        <button onClick={() => handleDelete(f.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500 transition"><Trash2 size={14} /></button>
      </div>
    )}] : []),
  ];

  return (
    <DashboardLayout>
      <div className="bg-white rounded-2xl shadow-card">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div><h2 className="font-display font-bold text-gray-900 text-lg">Faculty</h2><p className="text-sm text-gray-400">{filtered.length} members</p></div>
          <div className="flex items-center gap-3">
            <input placeholder="Search faculty…" value={search} onChange={e => setSearch(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-100 bg-gray-50" />
            {isAdmin && (
              <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition">
                <Plus size={16} /> Add Faculty
              </button>
            )}
          </div>
        </div>
        <div className="p-2"><DataTable columns={columns} data={filtered} loading={loading} /></div>
      </div>

      <Modal open={modal !== null} onClose={() => setModal(null)} title={modal === 'create' ? 'Add Faculty' : 'Edit Faculty'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Full Name" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
            <FormInput label="Email" type="email" value={form.email} disabled={modal === 'edit'} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          {modal === 'create' && (
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              <FormInput label="Employee ID" value={form.employeeId} onChange={e => setForm(f => ({ ...f, employeeId: e.target.value }))} />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Department" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} />
            <FormInput label="Designation" value={form.designation} onChange={e => setForm(f => ({ ...f, designation: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Phone" value={form.phoneNumber} onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))} />
            <FormInput label="Specialization" value={form.specialization} onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))} />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 disabled:opacity-60 transition">
            {modal === 'create' ? 'Add Faculty' : 'Save Changes'}
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
