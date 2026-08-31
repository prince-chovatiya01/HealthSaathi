import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { User, Phone, Shield, Calendar, Edit2, Save, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useHealthSaathi } from '../context/HealthSaathiContext';
import axiosInstance from '../api/axiosInstance';
import PageNav from '../components/common/PageNav';

interface ProfileData {
  _id: string;
  name: string;
  phoneNumber: string;
  role: string;
  appointments: {
    _id: string;
    date: string;
    time: string;
    status: string;
    doctor: { name: string; specialization: string };
  }[];
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
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/users/profile');
        setProfile(res.data);
        setNewName(res.data.name);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (!user) return <Navigate to="/login" />;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const handleSaveName = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await axiosInstance.put('/users/profile', { name: newName.trim() });
      setProfile(prev => prev ? { ...prev, name: res.data.name } : prev);
      // Update context too
      login({ ...user, name: res.data.name });
      setEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const completedCount = profile?.appointments.filter(a => a.status === 'completed').length ?? 0;
  const upcomingCount = profile?.appointments.filter(a => a.status === 'upcoming').length ?? 0;
  const cancelledCount = profile?.appointments.filter(a => a.status === 'cancelled').length ?? 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <PageNav />
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your account information</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.type === 'success'
            ? <CheckCircle className="h-5 w-5 text-green-600" />
            : <AlertCircle className="h-5 w-5 text-red-600" />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold text-white">
                  {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{profile?.name}</h2>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                  profile?.role === 'admin'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  <Shield className="h-3 w-3 mr-1" />
                  {profile?.role === 'admin' ? 'Administrator' : 'Patient'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Name Field */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <User className="h-4 w-4" />
                    Full Name
                  </label>
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <Edit2 className="h-3 w-3" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSaveName}
                        disabled={saving}
                        className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 transition-colors"
                      >
                        <Save className="h-3 w-3" />
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => { setEditing(false); setNewName(profile?.name || ''); }}
                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="h-3 w-3" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                {editing ? (
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    autoFocus
                  />
                ) : (
                  <p className="text-gray-900 font-semibold">{profile?.name}</p>
                )}
              </div>

              {/* Phone Field */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </label>
                <p className="text-gray-900 font-semibold">+91 {profile?.phoneNumber}</p>
              </div>
            </div>
          </div>

          {/* Recent Appointments */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                Recent Appointments
              </h3>
              <Link to="/appointments" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                View all →
              </Link>
            </div>

            {profile?.appointments && profile.appointments.length > 0 ? (
              <div className="space-y-3">
                {profile.appointments.slice(0, 5).map((apt) => (
                  <div
                    key={apt._id}
                    className={`flex items-center justify-between p-3 rounded-xl border ${
                      apt.status === 'completed' ? 'bg-green-50 border-green-100' :
                      apt.status === 'upcoming' ? 'bg-blue-50 border-blue-100' :
                      'bg-gray-50 border-gray-100'
                    }`}
                  >
                    <div>
                      <p className="font-medium text-gray-900">{apt.doctor?.name || 'Unknown Doctor'}</p>
                      <p className="text-sm text-gray-600">{apt.doctor?.specialization}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(apt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {apt.time}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                      apt.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No appointments yet</p>
                <Link to="/doctors" className="text-indigo-600 hover:underline text-sm mt-2 block">
                  Book your first appointment
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Appointment Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <span className="text-green-700 text-sm font-medium">Completed</span>
                <span className="text-2xl font-bold text-green-800">{completedCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <span className="text-blue-700 text-sm font-medium">Upcoming</span>
                <span className="text-2xl font-bold text-blue-800">{upcomingCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-600 text-sm font-medium">Cancelled</span>
                <span className="text-2xl font-bold text-gray-700">{cancelledCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl border-t border-purple-100 mt-2">
                <span className="text-purple-700 text-sm font-medium">Total</span>
                <span className="text-2xl font-bold text-purple-800">{profile?.appointments.length ?? 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="font-semibold mb-2">Quick Actions</h3>
            <div className="space-y-2 mt-3">
              <Link to="/doctors" className="block text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-center font-medium">
                Book Appointment
              </Link>
              <Link to="/appointments" className="block text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-center font-medium">
                View Appointments
              </Link>
              <Link to="/health-records" className="block text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-center font-medium">
                Health Records
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;