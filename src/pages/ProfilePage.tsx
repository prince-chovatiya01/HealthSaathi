import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { User, Phone, Shield, Calendar, Edit2, Save, X, CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';
import { useHealthSaathi } from '../context/HealthSaathiContext';
import axiosInstance from '../api/axiosInstance';
import PageNav from '../components/common/PageNav';

interface ProfileData {
  _id: string; name: string; phoneNumber: string; role: string;
  appointments: { _id: string; date: string; time: string; status: string; doctor: { name: string; specialization: string } }[];
}

const ProfilePage = () => {
  const { user, login } = useHealthSaathi();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    axiosInstance.get('/users/profile').then(r => { setProfile(r.data); setNewName(r.data.name); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (!user) return <Navigate to="/login" />;
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="hs-spinner w-10 h-10" /></div>;

  const handleSaveName = async () => {
    if (!newName.trim()) return;
    setSaving(true); setMessage(null);
    try {
      const r = await axiosInstance.put('/users/profile', { name: newName.trim() });
      setProfile(p => p ? { ...p, name: r.data.name } : p);
      login({ ...user, name: r.data.name });
      setEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (e: any) {
      setMessage({ type: 'error', text: e.response?.data?.message || 'Failed to update profile' });
    } finally { setSaving(false); }
  };

  const counts = {
    completed: profile?.appointments.filter(a => a.status === 'completed').length ?? 0,
    upcoming: profile?.appointments.filter(a => a.status === 'upcoming').length ?? 0,
    cancelled: profile?.appointments.filter(a => a.status === 'cancelled').length ?? 0,
    total: profile?.appointments.length ?? 0,
  };

  const recentAppointments = (profile?.appointments || [])
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="hs-page">
      <div className="hs-container-narrow max-w-4xl">
        <PageNav />

        <div className="mb-8">
          <h1 className="hs-page-title">My Profile</h1>
          <p className="text-slate-500 mt-1">Manage your account information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile card */}
          <div className="lg:col-span-1 space-y-5">
            <div className="hs-card p-6 text-center">
              <div className="w-24 h-24 gradient-health rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <User className="w-12 h-12 text-white" />
              </div>
              {editing ? (
                <div className="space-y-3">
                  <input value={newName} onChange={e => setNewName(e.target.value)} className="hs-input text-center" />
                  <div className="flex gap-2">
                    <button onClick={handleSaveName} disabled={saving} className="btn-primary btn-sm flex-1 justify-center">
                      <Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => { setEditing(false); setNewName(profile?.name || ''); }} className="btn-ghost btn-sm px-3">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-slate-900">{profile?.name}</h2>
                  <p className="text-sm text-slate-500 mt-1 capitalize">{profile?.role === 'admin' ? '🛡 Administrator' : '👤 Patient'}</p>
                  <button onClick={() => setEditing(true)} className="btn-ghost btn-sm mt-3 mx-auto">
                    <Edit2 className="w-3.5 h-3.5" /> Edit Name
                  </button>
                </>
              )}

              {message && (
                <div className={`mt-4 text-sm px-3 py-2 rounded-xl ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  {message.text}
                </div>
              )}
            </div>

            {/* Contact info */}
            <div className="hs-card p-5 space-y-3">
              <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">Account Details</h3>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span className="text-slate-600">{profile?.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span className="text-slate-600 capitalize">{profile?.role}</span>
              </div>
            </div>
          </div>

          {/* Stats + History */}
          <div className="lg:col-span-2 space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total', value: counts.total, icon: Calendar, bg: 'bg-violet-100', color: 'text-violet-700' },
                { label: 'Upcoming', value: counts.upcoming, icon: Clock, bg: 'bg-blue-100', color: 'text-blue-700' },
                { label: 'Completed', value: counts.completed, icon: CheckCircle, bg: 'bg-emerald-100', color: 'text-emerald-700' },
                { label: 'Cancelled', value: counts.cancelled, icon: XCircle, bg: 'bg-slate-100', color: 'text-slate-600' },
              ].map(s => (
                <div key={s.label} className="hs-card p-4">
                  <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-2`}>
                    <s.icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Recent appointments */}
            <div className="hs-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="hs-section-title">Recent Appointments</h3>
                <Link to="/appointments" className="text-sm text-primary-600 font-medium hover:text-primary-800">View all</Link>
              </div>
              {recentAppointments.length > 0 ? (
                <div className="space-y-2">
                  {recentAppointments.map(a => (
                    <div key={a._id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 truncate text-sm">{a.doctor?.name || 'Doctor'}</p>
                        <p className="text-xs text-slate-500">{new Date(a.date).toLocaleDateString()} · {a.time}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        a.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                        a.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>{a.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">No appointments yet</p>
                  <Link to="/doctors" className="btn-outline btn-sm mt-3 inline-flex">Find a Doctor</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;