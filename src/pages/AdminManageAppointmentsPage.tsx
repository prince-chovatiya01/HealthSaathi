import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useHealthSaathi } from '../context/HealthSaathiContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

interface Appointment {
  _id: string;
  userId: {
    _id: string;
    name: string;
    phoneNumber?: string;
  };
  doctorId: {
    _id: string;
    name: string;
    specialization: string;
  };
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

const AdminManageAppointmentsPage = () => {
  const { user } = useHealthSaathi();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<Record<string, 'completed' | 'cancelled'>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/appointments/all');
        setAppointments(res.data);
      } catch (error) {
        console.error('Error fetching appointments', error);
        toast.error('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleCheckboxChange = (appointmentId: string, status: 'completed' | 'cancelled') => {
    setSelectedStatus((prev) => {
      const currentStatus = prev[appointmentId];
      const updated = { ...prev };

      if (currentStatus === status) {
        delete updated[appointmentId];
      } else {
        updated[appointmentId] = status;
      }

      return updated;
    });
  };

  const applyChanges = async () => {
    try {
      const updates = Object.entries(selectedStatus);

      if (updates.length === 0) {
        toast('No changes to apply.');
        return;
      }

      for (const [id, status] of updates) {
        await axiosInstance.patch(`/appointments/${id}/status`, { status });
      }

      toast.success('Appointments updated successfully');

      setAppointments((prev) =>
        prev.map((apt) =>
          selectedStatus[apt._id]
            ? { ...apt, status: selectedStatus[apt._id] }
            : apt
        )
      );

      setSelectedStatus({});
    } catch (error) {
      console.error('Failed to update statuses:', error);
      toast.error('Failed to update some appointments');
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case 'upcoming':
        return `${baseClasses} bg-blue-100 text-blue-700 border border-blue-200`;
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-700 border border-green-200`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-700 border border-red-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Appointment Management</h1>
          <p className="text-gray-600 text-lg">Manage and update appointment statuses</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mt-4"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(apt => apt.status === 'upcoming').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Updates</p>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(selectedStatus).length}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {appointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-500">There are currently no appointments to display.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Appointment Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((apt, index) => (
                    <tr key={apt._id} className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {apt.userId?.name?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {apt.userId?.name || 'Unknown Patient'}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {apt.doctorId?.name?.charAt(0)?.toUpperCase() || 'D'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {apt.doctorId?.name || 'Unknown Doctor'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {apt.doctorId?.specialization || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="font-medium">{formatDate(apt.date)}</div>
                          <div className="text-gray-500">{formatTime(apt.time)}</div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(apt.status)}>
                          {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center space-x-4">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedStatus[apt._id] === 'completed'}
                              onChange={() => handleCheckboxChange(apt._id, 'completed')}
                              disabled={apt.status !== 'upcoming'}
                              className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <span className="text-sm text-green-700 font-medium">Complete</span>
                          </label>
                          
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedStatus[apt._id] === 'cancelled'}
                              onChange={() => handleCheckboxChange(apt._id, 'cancelled')}
                              disabled={apt.status !== 'upcoming'}
                              className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <span className="text-sm text-red-700 font-medium">Cancel</span>
                          </label>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Apply Changes Button */}
            {Object.keys(selectedStatus).length > 0 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {Object.keys(selectedStatus).length} appointment(s) selected for update
                  </div>
                  <Button 
                    variant="primary" 
                    onClick={applyChanges}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    Apply Changes
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManageAppointmentsPage;