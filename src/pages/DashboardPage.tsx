import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { 
  PlusCircle, 
  User, 
  Calendar, 
  ChevronRight, 
  Heart, 
  Activity, 
  Weight, 
  Thermometer,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Card, { CardBody, CardHeader } from '../components/common/Card';
import Button from '../components/common/Button';
import { useHealthSaathi } from '../context/HealthSaathiContext';
import translations, { Language } from '../utils/translations';
import axiosInstance from '../api/axiosInstance';

interface Doctor {
  name: string;
  specialization: string;
}

interface Appointment {
  _id: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  doctor: Doctor;
  doctorId?: Doctor;
}

interface HealthMetrics {
  heartRate?: number;
  bloodPressure?: string;
  weight?: number;
  temperature?: number;
  steps?: number;
  lastUpdated?: string;
  [key: string]: any;
}

const DashboardPage = () => {
  const { user, logout } = useHealthSaathi();
  const lang: Language = 'en';
  const t = translations[lang];

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  // Generate dummy health metrics if none exist
  const generateDummyHealthMetrics = (): HealthMetrics => {
    const baseDate = new Date();
    baseDate.setHours(baseDate.getHours() - Math.floor(Math.random() * 24));
    
    return {
      heartRate: 72 + Math.floor(Math.random() * 20), // 72-92 BPM
      bloodPressure: `${120 + Math.floor(Math.random() * 20)}/${80 + Math.floor(Math.random() * 10)}`,
      weight: 65 + Math.floor(Math.random() * 30), // 65-95 kg
      temperature: 36.5 + (Math.random() * 1.5), // 36.5-38°C
      steps: 5000 + Math.floor(Math.random() * 8000), // 5000-13000 steps
      lastUpdated: baseDate.toISOString()
    };
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axiosInstance.get('/users/profile');
        
        let appointmentsData = res.data.appointments || [];
        
        if (!appointmentsData || appointmentsData.length === 0) {
          try {
            const appointmentsRes = await axiosInstance.get('/appointments');
            appointmentsData = Array.isArray(appointmentsRes.data) 
              ? appointmentsRes.data 
              : appointmentsRes.data.appointments || [];
            
            appointmentsData = appointmentsData.map((apt: any) => ({
              ...apt,
              doctor: apt.doctorId || apt.doctor || { name: 'Unknown Doctor', specialization: 'General' }
            }));
          } catch (apptError) {
            console.error('Error fetching appointments:', apptError);
            appointmentsData = [];
          }
        }
        
        setAppointments(appointmentsData);
        
        // Use existing health metrics or generate dummy ones
        const existingMetrics = res.data.healthMetrics;
        if (existingMetrics && Object.keys(existingMetrics).length > 0) {
          setHealthMetrics(existingMetrics);
        } else {
          setHealthMetrics(generateDummyHealthMetrics());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Generate dummy metrics even on error
        setHealthMetrics(generateDummyHealthMetrics());
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (!user) return <Navigate to="/login" />;
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  const parseAppointmentDate = (dateStr: string, timeStr: string): Date => {
    try {
      const [hour, minute] = timeStr.split(':').map(Number);
      let date = new Date(dateStr + 'T00:00:00');
      
      if (isNaN(date.getTime())) {
        date = new Date(dateStr);
      }
      
      if (isNaN(date.getTime())) {
        const [year, month, day] = dateStr.split('-').map(Number);
        date = new Date(year, month - 1, day);
      }
      
      if (isNaN(date.getTime())) {
        throw new Error(`Invalid date: ${dateStr}`);
      }
      
      date.setHours(hour, minute, 0, 0);
      return date;
    } catch (error) {
      console.error('Error parsing date:', error, dateStr, timeStr);
      throw error;
    }
  };

  const isUpcoming = (appointment: Appointment): boolean => {
    if (!appointment || !appointment.date || !appointment.time) return false;
    if (appointment.status !== 'upcoming') return false;
    
    try {
      const apptDate = parseAppointmentDate(appointment.date, appointment.time);
      const now = new Date();
      return apptDate > now;
    } catch (error) {
      console.error('Error parsing appointment date:', error, appointment);
      return false;
    }
  };

  const isMissed = (appointment: Appointment): boolean => {
    if (!appointment || !appointment.date || !appointment.time) return false;
    if (appointment.status !== 'upcoming') return false;
    
    try {
      const apptDate = parseAppointmentDate(appointment.date, appointment.time);
      const now = new Date();
      return apptDate <= now;
    } catch (error) {
      console.error('Error parsing appointment date:', error, appointment);
      return false;
    }
  };

  const upcomingAppointments = appointments.filter(isUpcoming).slice(0, 3);
  const missedAppointments = appointments.filter(isMissed);
  const completedAppointments = appointments.filter(apt => apt.status === 'completed').slice(0, 2);

  const formatHealthMetricValue = (key: string, value: any): string => {
    switch (key) {
      case 'heartRate':
        return `${value} BPM`;
      case 'weight':
        return `${value} kg`;
      case 'temperature':
        return `${typeof value === 'number' ? value.toFixed(1) : value}°C`;
      case 'steps':
        return value.toLocaleString();
      case 'bloodPressure':
        return `${value} mmHg`;
      default:
        return value.toString();
    }
  };

  const getHealthMetricIcon = (key: string) => {
    switch (key) {
      case 'heartRate':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'weight':
        return <Weight className="h-5 w-5 text-blue-500" />;
      case 'temperature':
        return <Thermometer className="h-5 w-5 text-orange-500" />;
      case 'steps':
        return <Activity className="h-5 w-5 text-green-500" />;
      case 'bloodPressure':
        return <TrendingUp className="h-5 w-5 text-purple-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getHealthMetricLabel = (key: string): string => {
    switch (key) {
      case 'heartRate':
        return 'Heart Rate';
      case 'bloodPressure':
        return 'Blood Pressure';
      case 'temperature':
        return 'Temperature';
      case 'steps':
        return 'Daily Steps';
      default:
        return key.charAt(0).toUpperCase() + key.slice(1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-700">
          <p><span className="font-semibold">Logged in as:</span> {user.name || 'User'}</p>
          <p><span className="font-semibold">Role:</span> {user.role === 'admin' ? 'Admin' : 'User'}</p>
        </div>
        <div className="flex items-center space-x-2">
          {user.role === 'admin' && (
            <Link to="/admin/add-doctor">
              <Button variant="primary" size="sm" icon={<PlusCircle className="h-5 w-5" />}>
                Add Doctor
              </Button>
            </Link>
          )}
          {user.role === 'admin' && (
            <Link to="/admin/manage-appointments">
              <Button variant="secondary" size="sm" icon={<Calendar className="h-5 w-5" />}>
                Manage Appointments
              </Button>
            </Link>
          )}

          <Button variant="destructive" size="sm" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 rounded-2xl text-white p-8 mb-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{t.welcomeBack}, {user.name || 'User'}!</h1>
            <p className="text-indigo-100 mb-6 text-lg">{t.howAreYouFeeling}</p>
            <div className="flex space-x-3 mb-4 md:mb-0">
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-full transition-all duration-200 backdrop-blur-sm">
                😊 Great
              </button>
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-full transition-all duration-200 backdrop-blur-sm">
                😐 Okay
              </button>
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-full transition-all duration-200 backdrop-blur-sm">
                🤒 Unwell
              </button>
            </div>
          </div>
          <div className="mt-6 md:mt-0">
            <Link to="/symptom-checker">
              <Button 
                variant="secondary" 
                icon={<PlusCircle className="h-5 w-5" />} 
                className="bg-white text-indigo-600 hover:bg-gray-50 font-semibold px-6 py-3"
              >
                {t.checkSymptoms}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Upcoming</p>
                <p className="text-2xl font-bold text-blue-800">{upcomingAppointments.length}</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-full">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-green-800">{completedAppointments.length}</p>
              </div>
              <div className="bg-green-500 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Missed</p>
                <p className="text-2xl font-bold text-red-800">{missedAppointments.length}</p>
              </div>
              <div className="bg-red-500 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Total</p>
                <p className="text-2xl font-bold text-purple-800">{appointments.length}</p>
              </div>
              <div className="bg-purple-500 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Appointments */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-indigo-600" />
                  {t.upcomingAppointments}
                </h2>
                <Link to="/appointments" className="text-indigo-600 text-sm hover:underline flex items-center font-medium">
                  {t.viewAll} <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </CardHeader>
            <CardBody>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment._id} className="flex items-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors duration-200 hover:shadow-md">
                      <div className="bg-indigo-100 p-3 rounded-full mr-4">
                        <User className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{appointment.doctor?.name}</h3>
                        <p className="text-gray-500 text-sm">{appointment.doctor?.specialization}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{(() => {
                            try {
                              return new Date(parseAppointmentDate(appointment.date, appointment.time)).toLocaleString();
                            } catch (e) {
                              return `${appointment.date} ${appointment.time}`;
                            }
                          })()}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 font-medium">
                        Upcoming
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-4">No upcoming appointments</p>
                  <Link to="/doctors">
                    <Button variant="outline" className="px-6 py-2">Book an Appointment</Button>
                  </Link>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Missed Appointments */}
          {missedAppointments.length > 0 && (
            <Card className="shadow-lg border-red-200">
              <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 rounded-t-lg">
                <h2 className="text-xl font-semibold text-red-700 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Missed Appointments
                </h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {missedAppointments.slice(0, 3).map((appointment) => (
                    <div key={appointment._id} className="flex items-center p-4 border border-red-100 rounded-xl hover:bg-red-50 transition-colors duration-200">
                      <div className="bg-red-100 p-3 rounded-full mr-4">
                        <User className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{appointment.doctor?.name}</h3>
                        <p className="text-gray-500 text-sm">{appointment.doctor?.specialization}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{(() => {
                            try {
                              return new Date(parseAppointmentDate(appointment.date, appointment.time)).toLocaleString();
                            } catch (e) {
                              return `${appointment.date} ${appointment.time}`;
                            }
                          })()}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-800 font-medium">
                        Missed
                      </span>
                    </div>
                  ))}
                </div>
                {missedAppointments.length > 3 && (
                  <div className="mt-4 text-center">
                    <Link to="/appointments" className="text-red-600 text-sm hover:underline">
                      View all {missedAppointments.length} missed appointments
                    </Link>
                  </div>
                )}
              </CardBody>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Health Metrics */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-green-600" />
                Health Metrics
              </h2>
            </CardHeader>
            <CardBody>
              {healthMetrics ? (
                <div className="space-y-4">
                  {Object.entries(healthMetrics)
                    .filter(([key]) => key !== 'lastUpdated' && key !== '__v' && key !== '_id')
                    .map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          {getHealthMetricIcon(key)}
                          <span className="ml-3 font-medium text-gray-700">
                            {getHealthMetricLabel(key)}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {formatHealthMetricValue(key, value)}
                        </span>
                      </div>
                    ))}
                  {healthMetrics.lastUpdated && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 text-center">
                        Last updated: {new Date(healthMetrics.lastUpdated).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No health metrics available</p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg">
              <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <Link to="/doctors" className="block">
                  <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-100">
                    <div className="flex items-center">
                      <PlusCircle className="h-5 w-5 text-indigo-600 mr-3" />
                      <span className="font-medium">Book Appointment</span>
                    </div>
                  </button>
                </Link>
                <Link to="/symptom-checker" className="block">
                  <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-100">
                    <div className="flex items-center">
                      <Activity className="h-5 w-5 text-green-600 mr-3" />
                      <span className="font-medium">Check Symptoms</span>
                    </div>
                  </button>
                </Link>
                <Link to="/appointments" className="block">
                  <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-100">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-purple-600 mr-3" />
                      <span className="font-medium">View All Appointments</span>
                    </div>
                  </button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;