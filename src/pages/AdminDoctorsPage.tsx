import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useHealthSaathi } from '../context/HealthSaathiContext';
import axiosInstance from '../api/axiosInstance';
import { Stethoscope, Edit2, Trash2, Plus, Search, Star, Award, Languages, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../components/common/Button';

interface Slot {
  startTime: string;
  endTime: string;
}

interface Availability {
  day: string;
  slots: Slot[];
}

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  experience: number;
  languages: string[];
  fees: number;
  imageUrl?: string;
  availability: Availability[];
  rating?: number;
  reviewCount?: number;
}

const AdminDoctorsPage = () => {
  const { user: authUser } = useHealthSaathi();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (authUser?.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [authUser, navigate]);

  const fetchDoctors = async () => {
    try {
      const res = await axiosInstance.get('/admin/doctors');
      setDoctors(res.data);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDelete = async (doctorId: string, doctorName: string) => {
    if (!window.confirm(`Are you sure you want to remove Dr. ${doctorName}? This will also delete all their ratings.`)) {
      return;
    }

    setDeletingId(doctorId);
    try {
      await axiosInstance.delete(`/admin/${doctorId}`);
      setDoctors(prev => prev.filter(d => d._id !== doctorId));
      setMessage({ type: 'success', text: `Dr. ${doctorName} has been removed successfully.` });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete doctor' });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredDoctors = doctors.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Doctors</h1>
          <p className="text-gray-600 mt-1">{doctors.length} doctor{doctors.length !== 1 ? 's' : ''} registered</p>
        </div>
        <Link to="/admin/add-doctor">
          <Button variant="primary" icon={<Plus className="h-4 w-4" />}>
            Add New Doctor
          </Button>
        </Link>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.type === 'success'
            ? <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            : <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or specialization..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
        />
      </div>

      {/* Doctor List */}
      {filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
          <Stethoscope className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {searchTerm ? 'No doctors match your search' : 'No doctors registered'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? 'Try a different search term' : 'Add your first doctor to get started'}
          </p>
          {!searchTerm && (
            <Link to="/admin/add-doctor">
              <Button variant="primary" icon={<Plus className="h-4 w-4" />}>
                Add Doctor
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDoctors.map(doctor => (
            <div
              key={doctor._id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 border-b border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={doctor.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=6366f1&color=fff&rounded=true`}
                      alt={doctor.name}
                      className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight truncate">{doctor.name}</h3>
                    <p className="text-indigo-600 font-medium text-sm">{doctor.specialization}</p>
                    {(doctor.rating ?? 0) > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-700">{doctor.rating?.toFixed(1)}</span>
                        <span className="text-xs text-gray-400">({doctor.reviewCount ?? 0} reviews)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Award className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span>{doctor.experience} years experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Languages className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="truncate">{doctor.languages.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span>₹{doctor.fees} per consultation</span>
                  </div>
                </div>

                {/* Availability preview */}
                {doctor.availability.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {doctor.availability.slice(0, 4).map(a => (
                      <span key={a.day} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                        {a.day.slice(0, 3)}
                      </span>
                    ))}
                    {doctor.availability.length > 4 && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        +{doctor.availability.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <Link
                    to={`/doctors/${doctor._id}`}
                    className="flex-1 text-center text-sm py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium transition-colors"
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={() => handleDelete(doctor._id, doctor.name)}
                    disabled={deletingId === doctor._id}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    {deletingId === doctor._id ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDoctorsPage;
