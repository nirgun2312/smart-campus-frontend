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
import type { Result, Student, Course, ApiResponse } from '@/types';

const EMPTY = { studentId: '', courseId: '', marksObtained: '', totalMarks: '100', grade: '', examType: 'Semester', academicYear: '2023-24' };

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const user = getUser();
  const canAdd = user?.role === 'Admin' || user?.role === 'Faculty';

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get<ApiResponse<Result[]>>('/results'),
      api.get<ApiResponse<Student[]>>('/students'),
      api.get<ApiResponse<Course[]>>('/courses'),
    ]).then(([r, s, c]) => { setResults(r.data.data); setStudents(s.data.data); setCourses(c.data.data); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = results.filter(r =>
    r.studentName.toLowerCase().includes(search.toLowerCase()) ||
    r.courseName.toLowerCase().includes(search.toLowerCase()) ||
    r.grade.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/results', { ...form, studentId: parseInt(form.studentId), courseId: parseInt(form.courseId), marksObtained: parseFloat(form.marksObtained), totalMarks: parseFloat(form.totalMarks) });
      setModal(false); load();
    } catch {} finally { setSaving(false); }
  };

  const gradeVariant = (g: string): 'success' | 'info' | 'warning' | 'danger' | 'default' => {
    if (g === 'A+' || g === 'A') return 'success';
    if (g === 'B+' || g === 'B') return 'info';
    if (g === 'C+' || g === 'C') return 'warning';
    return 'danger';
  };

  const columns = [
    { key: 'rollNumber', header: 'Roll No', render: (r: Result) => <span className="font-mono text-xs text-brand-700 bg-brand-50 px-2 py-1 rounded">{r.rollNumber}</span> },
    { key: 'studentName', header: 'Student', render: (r: Result) => <span className="font-medium text-gray-800">{r.studentName}</span> },
    { key: 'courseName', header: 'Course' },
    { key: 'examType', header: 'Exam', render: (r: Result) => <Badge label={r.examType} variant="default" /> },
    { key: 'marksObtained', header: 'Marks', render: (r: Result) => `${r.marksObtained} / ${r.totalMarks}` },
    { key: 'percentage', header: '%', render: (r: Result) => (
      <div className="flex items-center gap-2">
        <div className="w-16 bg-gray-100 rounded-full h-1.5">
          <div className="h-1.5 rounded-full bg-brand-500" style={{ width: `${r.percentage}%` }} />
        </div>
        <span className="text-xs font-medium text-gray-600">{r.percentage}%</span>
      </div>
    )},
    { key: 'grade', header: 'Grade', render: (r: Result) => <Badge label={r.grade} variant={gradeVariant(r.grade)} /> },
    { key: 'academicYear', header: 'Year' },
  ];

  return (
    <DashboardLayout>
      <div className="bg-white rounded-2xl shadow-card">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div><h2 className="font-display font-bold text-gray-900 text-lg">Results</h2><p className="text-sm text-gray-400">{filtered.length} records</p></div>
          <div className="flex items-center gap-3">
            <input placeholder="Search results…" value={search} onChange={e => setSearch(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-100 bg-gray-50" />
            {canAdd && (
              <button onClick={() => { setForm(EMPTY); setModal(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-medium transition">
                <Plus size={16} /> Add Result
              </button>
            )}
          </div>
        </div>
        <div className="p-2"><DataTable columns={columns} data={filtered} loading={loading} /></div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Add Result">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Student</label>
            <select value={form.studentId} onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-100">
              <option value="">Select student</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.rollNumber} — {s.fullName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Course</label>
            <select value={form.courseId} onChange={e => setForm(f => ({ ...f, courseId: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-100">
              <option value="">Select course</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.courseCode} — {c.courseName}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FormInput label="Marks Obtained" type="number" value={form.marksObtained} onChange={e => setForm(f => ({ ...f, marksObtained: e.target.value }))} placeholder="85" />
            <FormInput label="Total Marks" type="number" value={form.totalMarks} onChange={e => setForm(f => ({ ...f, totalMarks: e.target.value }))} />
            <FormInput label="Grade" value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))} placeholder="A+" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Exam Type</label>
              <select value={form.examType} onChange={e => setForm(f => ({ ...f, examType: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-100">
                <option>Semester</option><option>Midterm</option><option>Internal</option>
              </select>
            </div>
            <FormInput label="Academic Year" value={form.academicYear} onChange={e => setForm(f => ({ ...f, academicYear: e.target.value }))} placeholder="2023-24" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.studentId || !form.courseId}
            className="flex-1 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 disabled:opacity-60 transition">
            Add Result
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
