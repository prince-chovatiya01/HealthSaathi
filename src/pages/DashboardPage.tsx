// import React from 'react';
// import { Link } from 'react-router-dom';
// import { PlusCircle, User, Calendar, Pill as Pills, FileText, Activity, ChevronRight, Heart } from 'lucide-react';
// import Card, { CardBody, CardHeader } from '../components/common/Card';
// import Button from '../components/common/Button';
// import { useHealthSaathi } from '../context/HealthSaathiContext';
// import translations, { Language } from '../utils/translations.ts';

// const DashboardPage = () => {
//   const { user, logout } = useHealthSaathi();

//   const lang: Language = 'en';  // or get dynamically from state

//   const t = translations[lang]; // No TypeScript error, safe access
// console.log(t.name);

//   // Mock data
//   const upcomingAppointments = [
//     {
//       id: '1',
//       doctorName: 'Dr. Priya Sharma',
//       specialty: 'General Physician',
//       date: '2025-05-20',
//       time: '10:30 AM',
//       status: 'confirmed'
//     },
//     {
//       id: '2',
//       doctorName: 'Dr. Ajay Verma',
//       specialty: 'Dermatologist',
//       date: '2025-05-25',
//       time: '03:00 PM',
//       status: 'pending'
//     }
//   ];

//   const healthMetrics = {
//     bloodPressure: {
//       systolic: 120,
//       diastolic: 80,
//       date: '2025-05-15'
//     },
//     bloodSugar: {
//       fasting: 95,
//       date: '2025-05-14'
//     },
//     weight: {
//       current: 68,
//       unit: 'kg',
//       date: '2025-05-10'
//     }
//   };

//   return (
//   <div className="container mx-auto px-4 py-8">
//     <div className="flex justify-between items-center mb-4">
//       <div className="text-sm text-gray-700">
//         <p><span className="font-semibold">Logged in as:</span> {user?.name || 'User'}</p>
//         <p><span className="font-semibold">Role:</span> {user?.role === 'admin' ? 'Admin' : 'User'}</p>
//       </div>
//       <div className="flex items-center space-x-2">
//         {user?.role === 'admin' && (
//           <Link to="/admin/add-doctor">
//             <Button variant="primary" size="sm" icon={<PlusCircle className="h-5 w-5" />}>
//               Add Doctor
//             </Button>
//           </Link>
//         )}
//         <Button 
//           variant="destructive"
//           size="sm"
//           onClick={logout}
//         >
//           Logout
//         </Button>
//       </div>
//     </div>


//     {/* Welcome Section */}
//     <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl text-white p-6 mb-8">
//       <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold mb-2">{t.welcomeBack}, {user?.name || 'User'}</h1>
//           <p className="text-indigo-100 mb-4">{t.howAreYouFeeling}</p>
//           <div className="flex space-x-3 mb-4 md:mb-0">
//             <button className="bg-indigo-500 bg-opacity-30 hover:bg-opacity-40 px-4 py-2 rounded-full transition-colors">
//               😊 Great
//             </button>
//             <button className="bg-indigo-500 bg-opacity-30 hover:bg-opacity-40 px-4 py-2 rounded-full transition-colors">
//               😐 Okay
//             </button>
//             <button className="bg-indigo-500 bg-opacity-30 hover:bg-opacity-40 px-4 py-2 rounded-full transition-colors">
//               🤒 Unwell
//             </button>
//           </div>
//         </div>
//         <Link to="/symptom-checker">
//           <Button
//               variant="secondary" 
//               icon={<PlusCircle className="h-5 w-5" />}
//               className="mt-4 md:mt-0"
//             >
//               {t.checkSymptoms}
//             </Button>
//           </Link>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2">
//           {/* Upcoming Appointments */}
//           <Card className="mb-8">
//             <CardHeader>
//               <div className="flex justify-between items-center">
//                 <h2 className="text-xl font-semibold text-gray-800">{t.upcomingAppointments}</h2>
//                 <Link to="/appointments" className="text-indigo-600 text-sm hover:underline flex items-center">
//                   {t.viewAll} <ChevronRight className="h-4 w-4 ml-1" />
//                 </Link>
//               </div>
//             </CardHeader>
//             <CardBody>
//               {upcomingAppointments.length > 0 ? (
//                 <div className="space-y-4">
//                   {upcomingAppointments.map((appointment) => (
//                     <div key={appointment.id} className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
//                       <div className="bg-indigo-100 p-3 rounded-full mr-4">
//                         <User className="h-6 w-6 text-indigo-600" />
//                       </div>
//                       <div className="flex-1">
//                         <h3 className="font-medium">{appointment.doctorName}</h3>
//                         <p className="text-gray-500 text-sm">{appointment.specialty}</p>
//                         <div className="flex items-center mt-1 text-sm text-gray-600">
//                           <Calendar className="h-4 w-4 mr-1" />
//                           <span>
//                             {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
//                           </span>
//                         </div>
//                       </div>
//                       <div>
//                         <span className={`px-3 py-1 rounded-full text-xs ${
//                           appointment.status === 'confirmed' 
//                             ? 'bg-green-100 text-green-800' 
//                             : 'bg-yellow-100 text-yellow-800'
//                         }`}>
//                           {appointment.status === 'confirmed' ? 'Confirmed' : 'Pending'}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-8">
//                   <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
//                   <p className="text-gray-500">No upcoming appointments</p>
//                   <Link to="/doctors">
//                     <Button variant="outline" className="mt-4">
//                       Book an Appointment
//                     </Button>
//                   </Link>
//                 </div>
//               )}
//             </CardBody>
//           </Card>

//           {/* Quick Actions */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//             <Link to="/doctors">
//               <Card hoverable className="border border-gray-100 h-full">
//                 <CardBody className="flex items-center p-6">
//                   <div className="bg-indigo-100 p-3 rounded-full mr-4">
//                     <User className="h-6 w-6 text-indigo-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-medium">{t.findDoctor}</h3>
//                     <p className="text-gray-500 text-sm">Connect with specialists</p>
//                   </div>
//                 </CardBody>
//               </Card>
//             </Link>
            
//             <Link to="/medicines">
//               <Card hoverable className="border border-gray-100 h-full">
//                 <CardBody className="flex items-center p-6">
//                   <div className="bg-green-100 p-3 rounded-full mr-4">
//                     <Pills className="h-6 w-6 text-green-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-medium">{t.orderMedicines}</h3>
//                     <p className="text-gray-500 text-sm">Get doorstep delivery</p>
//                   </div>
//                 </CardBody>
//               </Card>
//             </Link>
            
//             <Link to="/health-records">
//               <Card hoverable className="border border-gray-100 h-full">
//                 <CardBody className="flex items-center p-6">
//                   <div className="bg-blue-100 p-3 rounded-full mr-4">
//                     <FileText className="h-6 w-6 text-blue-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-medium">{t.viewHealthRecords}</h3>
//                     <p className="text-gray-500 text-sm">Access your medical history</p>
//                   </div>
//                 </CardBody>
//               </Card>
//             </Link>
            
//             <Link to="/wellness">
//               <Card hoverable className="border border-gray-100 h-full">
//                 <CardBody className="flex items-center p-6">
//                   <div className="bg-purple-100 p-3 rounded-full mr-4">
//                     <Heart className="h-6 w-6 text-purple-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-medium">{t.getWellnessTips}</h3>
//                     <p className="text-gray-500 text-sm">Personalized health advice</p>
//                   </div>
//                 </CardBody>
//               </Card>
//             </Link>
//           </div>
//         </div>

//         <div className="lg:col-span-1">
//           {/* Health Metrics */}
//           <Card className="mb-8">
//             <CardHeader>
//               <div className="flex justify-between items-center">
//                 <h2 className="text-xl font-semibold text-gray-800">{t.trackHealthMetrics}</h2>
//                 <Button variant="ghost" size="sm" icon={<PlusCircle className="h-4 w-4" />}>Add</Button>
//               </div>
//             </CardHeader>
//             <CardBody>
//               <div className="space-y-4">
//                 <div className="p-3 border border-gray-100 rounded-lg">
//                   <div className="flex justify-between items-center mb-2">
//                     <h3 className="font-medium">Blood Pressure</h3>
//                     <span className="text-xs text-gray-500">
//                       {new Date(healthMetrics.bloodPressure.date).toLocaleDateString()}
//                     </span>
//                   </div>
//                   <div className="flex items-center">
//                     <Activity className="h-5 w-5 text-red-500 mr-2" />
//                     <div className="text-2xl font-bold">
//                       {healthMetrics.bloodPressure.systolic}/{healthMetrics.bloodPressure.diastolic}
//                     </div>
//                     <span className="text-gray-500 ml-2">mmHg</span>
//                   </div>
//                   <div className="mt-2">
//                     <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Normal</span>
//                   </div>
//                 </div>

//                 <div className="p-3 border border-gray-100 rounded-lg">
//                   <div className="flex justify-between items-center mb-2">
//                     <h3 className="font-medium">Blood Sugar (Fasting)</h3>
//                     <span className="text-xs text-gray-500">
//                       {new Date(healthMetrics.bloodSugar.date).toLocaleDateString()}
//                     </span>
//                   </div>
//                   <div className="flex items-center">
//                     <Activity className="h-5 w-5 text-blue-500 mr-2" />
//                     <div className="text-2xl font-bold">
//                       {healthMetrics.bloodSugar.fasting}
//                     </div>
//                     <span className="text-gray-500 ml-2">mg/dL</span>
//                   </div>
//                   <div className="mt-2">
//                     <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Normal</span>
//                   </div>
//                 </div>

//                 <div className="p-3 border border-gray-100 rounded-lg">
//                   <div className="flex justify-between items-center mb-2">
//                     <h3 className="font-medium">Weight</h3>
//                     <span className="text-xs text-gray-500">
//                       {new Date(healthMetrics.weight.date).toLocaleDateString()}
//                     </span>
//                   </div>
//                   <div className="flex items-center">
//                     <Activity className="h-5 w-5 text-green-500 mr-2" />
//                     <div className="text-2xl font-bold">
//                       {healthMetrics.weight.current}
//                     </div>
//                     <span className="text-gray-500 ml-2">{healthMetrics.weight.unit}</span>
//                   </div>
//                 </div>
//               </div>
//             </CardBody>
//           </Card>

//           {/* Reminders */}
//           <Card>
//             <CardHeader>
//               <h2 className="text-xl font-semibold text-gray-800">Reminders</h2>
//             </CardHeader>
//             <CardBody>
//               <div className="space-y-3">
//                 <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
//                   <Pills className="h-5 w-5 text-yellow-600 mr-3" />
//                   <div>
//                     <p className="font-medium text-yellow-800">Take Blood Pressure Medicine</p>
//                     <p className="text-yellow-600 text-sm">Today, 8:00 PM</p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center p-3 bg-indigo-50 rounded-lg">
//                   <Calendar className="h-5 w-5 text-indigo-600 mr-3" />
//                   <div>
//                     <p className="font-medium text-indigo-800">Dr. Sharma Appointment</p>
//                     <p className="text-indigo-600 text-sm">Tomorrow, 10:30 AM</p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center p-3 bg-green-50 rounded-lg">
//                   <Activity className="h-5 w-5 text-green-600 mr-3" />
//                   <div>
//                     <p className="font-medium text-green-800">Check Blood Sugar</p>
//                     <p className="text-green-600 text-sm">May 22, 7:00 AM</p>
//                   </div>
//                 </div>
//               </div>
//             </CardBody>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, User, Calendar, ChevronRight } from 'lucide-react';
import Card, { CardBody, CardHeader } from '../components/common/Card';
import Button from '../components/common/Button';
import { useHealthSaathi } from '../context/HealthSaathiContext';
import translations, { Language } from '../utils/translations.ts';
import axios from 'axios';

// ----------------- Types ------------------

interface Doctor {
  name: string;
  specialization: string;
}

interface Appointment {
  _id: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending';
  doctor: Doctor;
}

interface HealthMetrics {
  heartRate?: number;
  bloodPressure?: string;
  weight?: number;
  [key: string]: any; // optional catch-all
}

// -------------- Component -----------------

const DashboardPage = () => {
  const { user, logout } = useHealthSaathi();
  const lang: Language = 'en';
  const t = translations[lang];

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const res = await axios.get('/api/users/profile', config);

        setAppointments(res.data.appointments || []);
        setHealthMetrics(res.data.healthMetrics || null);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-700">
          <p><span className="font-semibold">Logged in as:</span> {user?.name || 'User'}</p>
          <p><span className="font-semibold">Role:</span> {user?.role === 'admin' ? 'Admin' : 'User'}</p>
        </div>
        <div className="flex items-center space-x-2">
          {user?.role === 'admin' && (
            <Link to="/admin/add-doctor">
              <Button variant="primary" size="sm" icon={<PlusCircle className="h-5 w-5" />}>
                Add Doctor
              </Button>
            </Link>
          )}
          <Button variant="destructive" size="sm" onClick={logout}>Logout</Button>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl text-white p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{t.welcomeBack}, {user?.name || 'User'}</h1>
            <p className="text-indigo-100 mb-4">{t.howAreYouFeeling}</p>
            <div className="flex space-x-3 mb-4 md:mb-0">
              <button className="bg-indigo-500 bg-opacity-30 hover:bg-opacity-40 px-4 py-2 rounded-full transition-colors">😊 Great</button>
              <button className="bg-indigo-500 bg-opacity-30 hover:bg-opacity-40 px-4 py-2 rounded-full transition-colors">😐 Okay</button>
              <button className="bg-indigo-500 bg-opacity-30 hover:bg-opacity-40 px-4 py-2 rounded-full transition-colors">🤒 Unwell</button>
            </div>
          </div>
          <Link to="/symptom-checker">
            <Button variant="secondary" icon={<PlusCircle className="h-5 w-5" />} className="mt-4 md:mt-0">
              {t.checkSymptoms}
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section: Appointments */}
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">{t.upcomingAppointments}</h2>
                <Link to="/appointments" className="text-indigo-600 text-sm hover:underline flex items-center">
                  {t.viewAll} <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </CardHeader>
            <CardBody>
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment._id} className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                      <div className="bg-indigo-100 p-3 rounded-full mr-4">
                        <User className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{appointment.doctor?.name || 'Doctor'}</h3>
                        <p className="text-gray-500 text-sm">{appointment.doctor?.specialization || 'Specialist'}</p>
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{new Date(appointment.date).toLocaleDateString()} at {appointment.time}</span>
                        </div>
                      </div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          appointment.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No upcoming appointments</p>
                  <Link to="/doctors">
                    <Button variant="outline" className="mt-4">Book an Appointment</Button>
                  </Link>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Right Section: Health Metrics or Reminders */}
        <div className="lg:col-span-1">
          {/* Future: Health Metrics and Reminders */}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
