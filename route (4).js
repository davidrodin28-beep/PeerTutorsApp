'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SCHOOLS, SUBJECTS } from '@/lib/constants';

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab]       = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  // login fields
  const [loginEmail, setLoginEmail]       = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // register fields
  const [regName, setRegName]           = useState('');
  const [regEmail, setRegEmail]         = useState('');
  const [regPassword, setRegPassword]   = useState('');
  const [regRole, setRegRole]           = useState('student');
  const [regSchool, setRegSchool]       = useState('');
  const [regSubjects, setRegSubjects]   = useState([]);

  function toggleSubject(s) {
    setRegSubjects((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    router.push('/dashboard/messages');
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    if (!regSchool) { setError('Please select your school.'); return; }
    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: regName, email: regEmail, password: regPassword,
        role: regRole, school: regSchool, subjects: regSubjects,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    router.push('/dashboard/messages');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Wordmark */}
        <div className="text-center mb-8">
          <span className="text-white text-3xl font-bold tracking-tight">PeerBridge</span>
          <p className="text-primary-200 text-sm mt-1">Peer tutoring, note sharing, community learning.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {['login', 'register'].map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                  tab === t
                    ? 'text-primary-700 border-b-2 border-primary-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            {/* ── LOGIN ── */}
            {tab === 'login' && (
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="field">
                  <label className="label">Email</label>
                  <input className="input" type="email" placeholder="you@university.edu"
                    value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                </div>
                <div className="field">
                  <label className="label">Password</label>
                  <input className="input" type="password" placeholder="••••••••"
                    value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                </div>
                <button className="btn-primary btn-lg mt-2" disabled={loading}>
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>
            )}

            {/* ── REGISTER ── */}
            {tab === 'register' && (
              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <div className="field">
                  <label className="label">Full Name</label>
                  <input className="input" type="text" placeholder="Your name"
                    value={regName} onChange={(e) => setRegName(e.target.value)} required />
                </div>
                <div className="field">
                  <label className="label">Email</label>
                  <input className="input" type="email" placeholder="you@university.edu"
                    value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
                </div>
                <div className="field">
                  <label className="label">School</label>
                  <select className="input" value={regSchool} onChange={(e) => setRegSchool(e.target.value)} required>
                    <option value="">Select your school</option>
                    {SCHOOLS.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label className="label">I am a</label>
                  <div className="flex gap-3">
                    {['student', 'tutor'].map((r) => (
                      <label key={r} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium cursor-pointer transition-all ${
                        regRole === r
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}>
                        <input type="radio" name="role" value={r} checked={regRole === r}
                          onChange={() => setRegRole(r)} className="sr-only" />
                        {r === 'student' ? '📖 Student' : '🎓 Tutor'}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label className="label">Subjects {regRole === 'tutor' ? 'you teach' : 'you need help with'}</label>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECTS.map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => toggleSubject(s)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                          regSubjects.includes(s)
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'border-gray-200 text-gray-500 hover:border-gray-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label className="label">Password</label>
                  <input className="input" type="password" placeholder="Min. 6 characters"
                    value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required />
                </div>
                <button className="btn-primary btn-lg mt-2" disabled={loading}>
                  {loading ? 'Creating account…' : 'Create Account'}
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-primary-200 text-xs mt-6">
          Browse as guest?{' '}
          <a href="/dashboard/notes" className="underline hover:text-white">View public notes →</a>
        </p>
      </div>
    </div>
  );
}
