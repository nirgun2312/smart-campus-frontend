'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { setAuth } from '@/lib/auth';
import type { ApiResponse, AuthResponse } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: 'admin@campus.edu', password: 'Admin@123' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', form);
      const { token, fullName, email, role, userId } = res.data.data;
      setAuth(token, { userId, email, name: fullName, role: role as 'Admin' | 'Faculty' | 'Student' });
      router.push('/dashboard');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #131956 0%, #1a44f5 60%, #3366ff 100%)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-16 text-white">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl font-bold">S</div>
            <span className="text-xl font-display font-bold tracking-wide">Smart Campus</span>
          </div>
          <h1 className="font-display text-5xl font-bold leading-tight mb-6">
            Manage Your<br />Campus Smarter.
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-md">
            Unified platform for students, faculty & administration. Track attendance, results, courses and more — all in one place.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Students', val: '1,200+' },
            { label: 'Courses', val: '80+' },
            { label: 'Faculty', val: '60+' },
          ].map(s => (
            <div key={s.label} className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="font-display text-3xl font-bold">{s.val}</div>
              <div className="text-white/60 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-10 fade-up">
            <div className="mb-8">
              <h2 className="font-display text-3xl font-bold text-gray-900">Welcome back</h2>
              <p className="text-gray-500 mt-2">Sign in to your campus account</p>
            </div>

            {error && (
              <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-gray-50 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition"
                  placeholder="admin@campus.edu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-gray-50 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-base transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full spin" /> : null}
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-3 font-medium">Demo Credentials</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { role: 'Admin', email: 'admin@campus.edu', pw: 'Admin@123' },
                  { role: 'Faculty', email: 'faculty@campus.edu', pw: 'Faculty@123' },
                  { role: 'Student', email: 'student@campus.edu', pw: 'Student@123' },
                ].map(c => (
                  <button
                    key={c.role}
                    type="button"
                    onClick={() => setForm({ email: c.email, password: c.pw })}
                    className="text-xs py-2 px-3 rounded-lg border border-gray-200 hover:border-brand-300 hover:bg-brand-50 text-gray-600 hover:text-brand-700 transition font-medium"
                  >
                    {c.role}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
