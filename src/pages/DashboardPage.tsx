import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  Calendar, Heart, Activity, Weight, Thermometer, TrendingUp, Clock,
  AlertCircle, CheckCircle, Edit2, X, Save, PlusCircle, User,
  Stethoscope, FileText, Pill, Leaf, ChevronRight, ArrowRight, Smile
} from 'lucide-react';
import { useHealthSaathi } from '../context/HealthSaathiContext';
import axiosInstance from '../api/axiosInstance';
import PageNav from '../components/common/PageNav';

interface Doctor { name: string; specialization: string; }
interface Appointment {
  _id: string; date: string; time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  doctor: Doctor; doctorId?: Doctor;
}
interface HealthMetrics {
  heartRate?: number; bloodPressure?: string; weight?: number;
  temperature?: number; steps?: number; lastUpdated?: string; [key: string]: any;
}

const feelingOptions = [
  { key: 'great',  emoji: '😊', label: 'Great',  color: 'bg-emerald-500', tip: '🌟 Great to hear! Keep up your health routine.' },
  { key: 'okay',   emoji: '😐', label: 'Okay',   color: 'bg-amber-500',   tip: '💙 Take it easy. Stay hydrated and rest well.' },
  { key: 'unwell', emoji: '🤒', label: 'Unwell', color: 'bg-red-500',     tip: '🩺 Consider booking a doctor consultation.' },
] as const;

const METRIC_META: Record<string, { label: string; unit: string; icon: React.ElementType; color: string }> = {
  heartRate:     { label: 'Heart Rate',     unit: 'BPM',  icon: Heart,        color: 'bg-red-100 text-red-600' },
  bloodPressure: { label: 'Blood Pressure', unit: 'mmHg', icon: TrendingUp,   color: 'bg-purple-100 text-purple-600' },
  weight:        { label: 'Weight',         unit: 'kg',   icon: Weight,       color: 'bg-blue-100 text-blue-600' },
  temperature:   { label: 'Temperature',    unit: '°C',   icon: Thermometer,  color: 'bg-orange-100 text-orange-600' },
  steps:         { label: 'Daily Steps',    unit: '',     icon: Activity,     color: 'bg-green-100 text-green-600' },
};

const quickActions = [
  { to: '/doctors',        icon: Stethoscope, label: 'Book Doctor',    color: 'bg-primary-50 text-primary-700 hover:bg-primary-100' },
  { to: '/health-records', icon: FileText,    label: 'Health Records', color: 'bg-teal-50 text-teal-700 hover:bg-teal-100' },
  { to: '/medicines',      icon: Pill,        label: 'Medicines',      color: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
  { to: '/wellness',       icon: Leaf,        label: 'Wellness',       color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
  { to: '/appointments',   icon: Calendar,    label: 'Appointments',   color: 'bg-violet-50 text-violet-700 hover:bg-violet-100' },
  { to: '/symptom-checker',icon: Activity,    label: 'Symptoms',       color: 'bg-pink-50 text-pink-700 hover:bg-pink-100' },
];

const DashboardPage = () => {
  const { user, logout } = useHealthSaathi();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMetricsForm, setShowMetricsForm] = useState(false);
  const [metricsForm, setMetricsForm] = useState({ heartRate: '', bloodPressure: '', weight: '', temperature: '', steps: '' });
  const [savingMetrics, setSavingMetrics] = useState(false);
  const [metricsError, setMetricsError] = useState('');
  const [feeling, setFeeling] = useState<'great' | 'okay' | 'unwell' | null>(
    () => (localStorage.getItem('hs_feeling') as any) || null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/users/profile');
        let appts = res.data.appointments || [];
        if (!appts.length) {
          const r2 = await axiosInstance.get('/appointments');
          appts = (Array.isArray(r2.data) ? r2.data : r2.data.appointments || [])
            .map((a: any) => ({ ...a, doctor: a.doctorId || a.doctor || { name: 'Doctor', specialization: '' } }));
        }
        setAppointments(appts);
        const m = res.data.healthMetrics;
        if (m && Object.keys(m).length > 0) setHealthMetrics(m);
      } catch { /* ignore */ } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (!user) return <Navigate to="/login" />;
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="hs-spinner w-10 h-10" />
    </div>
  );

  const parseDate = (d: string, t: string) => {
    try { const dt = new Date(`${d}T${t}:00`); return isNaN(dt.getTime()) ? new Date(d) : dt; }
    catch { return new Date(); }
  };

  const upcoming = appointments.filter(a => a.status === 'upcoming' && parseDate(a.date, a.time) > new Date()).slice(0, 3);
  const completed = appointments.filter(a => a.status === 'completed').length;
  const missed = appointments.filter(a => a.status === 'upcoming' && parseDate(a.date, a.time) <= new Date()).length;

  const saveMetrics = async () => {
    setSavingMetrics(true); setMetricsError('');
    try {
      const p: Record<string, any> = {};
      if (metricsForm.heartRate) p.heartRate = Number(metricsForm.heartRate);
      if (metricsForm.bloodPressure) p.bloodPressure = metricsForm.bloodPressure;
      if (metricsForm.weight) p.weight = Number(metricsForm.weight);
      if (metricsForm.temperature) p.temperature = Number(metricsForm.temperature);
      if (metricsForm.steps) p.steps = Number(metricsForm.steps);
      const r = await axiosInstance.put('/users/health-metrics', p);
      setHealthMetrics(r.data.healthMetrics);
      setShowMetricsForm(false);
    } catch (e: any) {
      setMetricsError(e.response?.data?.message || 'Failed to save');
    } finally { setSavingMetrics(false); }
  };

  const currentFeeling = feelingOptions.find(f => f.key === feeling);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="hs-page">
      <div className="hs-container">
        {/* Welcome banner */}
        <div className="gradient-warm rounded-3xl text-white p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-teal-300 rounded-full blur-3xl" />
          </div>
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1">
              <p className="text-white/70 font-medium mb-1">{greeting},</p>
              <h1 className="text-3xl font-bold mb-2">{user.name || 'there'}! 👋</h1>
              <p className="text-white/80 mb-5">How are you feeling today?</p>
              <div className="flex flex-wrap gap-2">
                {feelingOptions.map(f => (
                  <button
                    key={f.key}
                    onClick={() => { const v = feeling === f.key ? null : f.key; setFeeling(v); v ? localStorage.setItem('hs_feeling', v) : localStorage.removeItem('hs_feeling'); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all ${
                      feeling === f.key
                        ? `${f.color} text-white shadow-lg scale-105 ring-2 ring-white/50`
                        : 'bg-white/20 hover:bg-white/30 text-white'
                    }`}
                  >
                    <span>{f.emoji}</span> {f.label}
                  </button>
                ))}
              </div>
              {currentFeeling && (
                <p className="mt-3 text-white/80 text-sm italic">{currentFeeling.tip}</p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              {user.role === 'admin' && (
                <div className="flex gap-2">
                  <Link to="/admin/doctors" className="bg-amber-400 hover:bg-amber-300 text-amber-900 font-semibold px-4 py-2 rounded-xl text-sm transition-all">
                    Manage Doctors
                  </Link>
                  <Link to="/admin/manage-appointments" className="bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all">
                    Admin Panel
                  </Link>
                </div>
              )}
              <Link to="/symptom-checker" className="bg-white text-primary-700 hover:bg-primary-50 font-semibold px-6 py-2.5 rounded-xl text-sm shadow-md transition-all flex items-center gap-2 justify-center">
                <Activity className="w-4 h-4" /> Check Symptoms
              </Link>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Upcoming', value: upcoming.length, icon: Clock, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', textColor: 'text-blue-700' },
            { label: 'Completed', value: completed, icon: CheckCircle, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', textColor: 'text-emerald-700' },
            { label: 'Missed', value: missed, icon: AlertCircle, iconBg: 'bg-red-100', iconColor: 'text-red-600', textColor: 'text-red-700' },
            { label: 'Total', value: appointments.length, icon: Calendar, iconBg: 'bg-violet-100', iconColor: 'text-violet-600', textColor: 'text-violet-700' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className={`stat-icon ${s.iconBg}`}>
                <s.icon className={`w-6 h-6 ${s.iconColor}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{s.label}</p>
                <p className={`text-2xl font-bold ${s.textColor}`}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Appointments */}
            <div className="hs-card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="hs-section-title flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary-600" /> Upcoming Appointments
                </h2>
                <Link to="/appointments" className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1">
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              {upcoming.length > 0 ? (
                <div className="space-y-3">
                  {upcoming.map(a => (
                    <div key={a._id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-primary-50 transition-colors group">
                      <div className="w-11 h-11 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{a.doctor?.name}</p>
                        <p className="text-sm text-slate-500">{a.doctor?.specialization}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-medium text-slate-700">{new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                        <p className="text-xs text-slate-400">{a.time}</p>
                      </div>
                      <span className="badge-blue">Upcoming</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Calendar className="w-14 h-14 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-500 mb-4">No upcoming appointments</p>
                  <Link to="/doctors" className="btn-primary btn-sm">Book an Appointment</Link>
                </div>
              )}
            </div>

            {/* Quick Actions grid */}
            <div className="hs-card p-6">
              <h2 className="hs-section-title mb-5">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {quickActions.map(({ to, icon: Icon, label, color }) => (
                  <Link key={to} to={to} className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl font-medium text-sm transition-all ${color}`}>
                    <Icon className="w-6 h-6" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Health Metrics */}
            <div className="hs-card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="hs-section-title flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-600" /> Health Metrics
                </h2>
                {healthMetrics && !showMetricsForm && (
                  <button onClick={() => { setMetricsForm({ heartRate: String(healthMetrics.heartRate || ''), bloodPressure: healthMetrics.bloodPressure || '', weight: String(healthMetrics.weight || ''), temperature: String(healthMetrics.temperature || ''), steps: String(healthMetrics.steps || '') }); setShowMetricsForm(true); }}
                    className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              {healthMetrics && !showMetricsForm ? (
                <div className="space-y-3">
                  {Object.entries(healthMetrics)
                    .filter(([k]) => METRIC_META[k])
                    .map(([k, v]) => {
                      const meta = METRIC_META[k];
                      const Icon = meta.icon;
                      return (
                        <div key={k} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-sm text-slate-600 flex-1">{meta.label}</span>
                          <span className="font-semibold text-slate-800 text-sm">{v}{meta.unit ? ` ${meta.unit}` : ''}</span>
                        </div>
                      );
                    })}
                  {healthMetrics.lastUpdated && (
                    <p className="text-xs text-slate-400 text-center pt-2">Updated {new Date(healthMetrics.lastUpdated).toLocaleDateString()}</p>
                  )}
                </div>
              ) : !showMetricsForm ? (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm mb-4">No metrics recorded yet</p>
                  <button onClick={() => { setShowMetricsForm(true); setMetricsError(''); }}
                    className="btn-outline btn-sm">
                    <PlusCircle className="w-4 h-4" /> Add Metrics
                  </button>
                </div>
              ) : null}

              {showMetricsForm && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-4">Update Health Metrics</h3>
                  {metricsError && <p className="text-red-500 text-xs mb-3">{metricsError}</p>}
                  <div className="space-y-3">
                    {[
                      { key: 'heartRate', label: 'Heart Rate (BPM)', placeholder: '72', type: 'number' },
                      { key: 'bloodPressure', label: 'Blood Pressure', placeholder: '120/80', type: 'text' },
                      { key: 'weight', label: 'Weight (kg)', placeholder: '70', type: 'number' },
                      { key: 'temperature', label: 'Temperature (°C)', placeholder: '36.6', type: 'number' },
                      { key: 'steps', label: 'Daily Steps', placeholder: '8000', type: 'number' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="hs-label text-xs">{f.label}</label>
                        <input type={f.type} value={metricsForm[f.key as keyof typeof metricsForm]}
                          onChange={e => setMetricsForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                          placeholder={f.placeholder} className="hs-input py-2 text-sm" />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={saveMetrics} disabled={savingMetrics}
                      className="btn-primary btn-sm flex-1 justify-center">
                      <Save className="w-3.5 h-3.5" /> {savingMetrics ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => { setShowMetricsForm(false); setMetricsError(''); }}
                      className="btn-ghost btn-sm px-3">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile card */}
            <div className="hs-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 gradient-health rounded-2xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{user.name}</p>
                  <p className="text-sm text-slate-500 capitalize">{user.role === 'admin' ? '🛡 Admin' : '👤 Patient'}</p>
                </div>
              </div>
              <Link to="/profile" className="btn-outline btn-sm w-full justify-center">View Profile</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;