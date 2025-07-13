import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  Calendar,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowLeft,
  Filter,
  Search,
  Star
} from 'lucide-react';
import Card, { CardBody } from '../components/common/Card';
import Button from '../components/common/Button';
import { useHealthSaathi } from '../context/HealthSaathiContext';
import translations, { Language } from '../utils/translations';
import axiosInstance from '../api/axiosInstance';

interface Doctor {
  _id?: string;
  name: string;
  specialization: string;
}

interface Appointment {
  _id: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  doctor: Doctor;
  doctorId?: string | Doctor;
  hasRated?: boolean;
  userRating?: number;
  userReview?: string;
}

const AppointmentsPage = () => {
  const { user } = useHealthSaathi();
  const lang: Language = 'en';
  const t = translations[lang];

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'missed' | 'completed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axiosInstance.get('/appointments/completed');
        const completedData = res.data.appointments || [];

        const allRes = await axiosInstance.get('/appointments');
        const allData = Array.isArray(allRes.data)
          ? allRes.data
          : allRes.data.appointments || [];

        const formatted = allData.map((apt: any) => {
          const ratedMatch = completedData.find((c: any) => c._id === apt._id);
          return {
            ...apt,
            hasRated: ratedMatch?.hasRated || false,
            userRating: ratedMatch?.userRating || 0,
            userReview: ratedMatch?.userReview || '',
            doctor: apt.doctorId || apt.doctor || { name: 'Unknown', specialization: 'General' },
          };
        });

        setAppointments(formatted);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        // Don't logout here, just log the error
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAppointments();
    }
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  const parseAppointmentDate = (dateStr: string, timeStr: string): Date => {
    try {
      const [hour, minute] = timeStr.split(':').map(Number);
      let date = new Date(dateStr + 'T00:00:00');

      if (isNaN(date.getTime())) {
        const [year, month, day] = dateStr.split('-').map(Number);
        date = new Date(year, month - 1, day);
      }

      date.setHours(hour, minute, 0, 0);
      return date;
    } catch {
      return new Date();
    }
  };

  const isUpcoming = (appointment: Appointment): boolean => {
    if (appointment.status !== 'upcoming') return false;
    return parseAppointmentDate(appointment.date, appointment.time) > new Date();
  };

  const isMissed = (appointment: Appointment): boolean => {
    if (appointment.status !== 'upcoming') return false;
    return parseAppointmentDate(appointment.date, appointment.time) <= new Date();
  };

  const getFilteredAppointments = () => {
    let filtered = appointments;

    switch (filter) {
      case 'upcoming':
        filtered = appointments.filter(isUpcoming);
        break;
      case 'missed':
        filtered = appointments.filter(isMissed);
        break;
      case 'completed':
        filtered = appointments.filter((apt) => apt.status === 'completed');
        break;
      case 'cancelled':
        filtered = appointments.filter((apt) => apt.status === 'cancelled');
        break;
      default:
        filtered = appointments;
    }

    if (searchTerm) {
      filtered = filtered.filter((apt) =>
        apt.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.doctor?.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      const dateA = parseAppointmentDate(a.date, a.time);
      const dateB = parseAppointmentDate(b.date, b.time);
      return dateB.getTime() - dateA.getTime();
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 font-medium">Upcoming</span>;
      case 'completed':
        return <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 font-medium">Completed</span>;
      case 'missed':
        return <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-800 font-medium">Missed</span>;
      case 'cancelled':
        return <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800 font-medium">Cancelled</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800 font-medium">Unknown</span>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return <Clock className="h-5 w-5 text-blue-600" />;
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'missed': return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'cancelled': return <XCircle className="h-5 w-5 text-gray-600" />;
      default: return <Calendar className="h-5 w-5 text-gray-600" />;
    }
  };

  // Helper function to get proper doctor ID
  const getDoctorId = (appointment: Appointment): string => {
    if (typeof appointment.doctorId === 'string') {
      return appointment.doctorId;
    }
    if (typeof appointment.doctorId === 'object' && appointment.doctorId?._id) {
      return appointment.doctorId._id;
    }
    if (appointment.doctor?._id) {
      return appointment.doctor._id;
    }
    return '';
  };

  const filteredAppointments = getFilteredAppointments();

  const counts = {
    total: appointments.length,
    upcoming: appointments.filter(isUpcoming).length,
    missed: appointments.filter(isMissed).length,
    completed: appointments.filter((apt) => apt.status === 'completed').length,
    cancelled: appointments.filter((apt) => apt.status === 'cancelled').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link to="/dashboard" className="mr-4">
            <Button variant="outline" size="sm" icon={<ArrowLeft className="h-4 w-4" />}>
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
            <p className="text-gray-600 mt-1">Manage and view all your appointments</p>
          </div>
        </div>
        <Link to="/doctors">
          <Button variant="primary" icon={<Calendar className="h-5 w-5" />}>
            Book New Appointment
          </Button>
        </Link>
      </div>

      <Card className="shadow-lg">
        <CardBody>
          {filteredAppointments.length > 0 ? (
            <div className="space-y-4">
              {filteredAppointments.map((apt) => {
                const status = apt.status === 'completed' ? 'completed' : (
                  isUpcoming(apt) ? 'upcoming' : isMissed(apt) ? 'missed' : apt.status
                );

                const doctorId = getDoctorId(apt);

                return (
                  <div key={apt._id} className={`flex items-center p-4 border rounded-xl 
                    hover:shadow-md transition-all duration-200 ${
                      status === 'missed' ? 'border-red-200 bg-red-50' :
                      status === 'upcoming' ? 'border-blue-200 bg-blue-50' :
                      status === 'completed' ? 'border-green-200 bg-green-50' :
                      'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="p-3 rounded-full mr-4 bg-gray-100">
                      {getStatusIcon(status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{apt.doctor?.name}</h3>
                          <p className="text-gray-600 text-sm">{apt.doctor?.specialization}</p>
                          <div className="flex items-center mt-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span className="font-medium">
                              {new Date(apt.date).toLocaleDateString('en-US', {
                                weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                              })}
                            </span>
                            <span className="mx-2">•</span>
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="font-medium">{apt.time}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(status)}
                          {status === 'completed' && !apt.hasRated && doctorId && (
                            <div className="mt-2">
                              <Link
                                to="/rate-doctor"
                                state={{
                                  appointmentId: apt._id,
                                  doctorId: doctorId,
                                  doctorName: apt.doctor?.name,
                                  doctorSpecialization: apt.doctor?.specialization,
                                  appointmentDate: apt.date,
                                  appointmentTime: apt.time
                                }}
                              >
                                <Button variant="secondary" size="sm">
                                  <Star className="h-4 w-4 mr-1" /> Rate Doctor
                                </Button>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'all' ? 'No appointments found' : `No ${filter} appointments`}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by booking your first appointment'}
              </p>
              {!searchTerm && (
                <Link to="/doctors">
                  <Button variant="primary" icon={<Calendar className="h-5 w-5" />}>
                    Book an Appointment
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default AppointmentsPage;