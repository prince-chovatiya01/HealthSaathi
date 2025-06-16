// import React, { useEffect, useState } from 'react';
// import { Calendar, Clock } from 'lucide-react';
// import { getAppointments } from '../api/appointments';
// import { useHealthSaathi } from '../context/HealthSaathiContext';
// import AppointmentBooking from '../components/appointments/AppointmentBooking';

// const AppointmentsPage = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [showBooking, setShowBooking] = useState(false);
//   const { user } = useHealthSaathi();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const data = await getAppointments();
//         setAppointments(data.filter((a) => a.userId === user?.id));
//       } catch (err) {
//         console.error('Failed to fetch appointments:', err);
//       }
//     };

//     fetchData();
//   }, [user]);

//   const upcoming = appointments.filter((a) => a.status === 'upcoming');
//   const past = appointments.filter((a) => a.status === 'completed');

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex items-center justify-between mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
//         <button
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
//           onClick={() => setShowBooking(true)}
//         >
//           <Calendar className="w-5 h-5" />
//           Book New Appointment
//         </button>
//       </div>

//       <div className="grid gap-6">
//         <Section title="Upcoming Appointments" items={upcoming} />
//         <Section title="Past Appointments" items={past} />
//       </div>

//       {showBooking && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-6 rounded-lg max-w-xl w-full relative">
//             <button
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//               onClick={() => setShowBooking(false)}
//             >
//               ✕
//             </button>
//             <AppointmentBooking
//               doctorId="demo-doc-id" // Replace with actual doctor ID
//               doctorName="Dr. Sarah Wilson" // Replace with selected doctor
//               onSuccess={() => {
//                 setShowBooking(false);
//                 window.location.reload(); // Or refetch appointments instead
//               }}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const Section = ({ title, items }) => (
//   <section className="bg-white rounded-xl shadow-md p-6">
//     <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
//     {items.length ? (
//       <div className="space-y-4">
//         {items.map((appt, i) => (
//           <div
//             key={i}
//             className={`border border-gray-200 rounded-lg p-4 ${
//               appt.status === 'completed' ? 'opacity-75' : ''
//             }`}
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="font-medium text-gray-900">
//                   {appt.doctorName}
//                 </h3>
//                 <p className="text-gray-600">{appt.specialization}</p>
//               </div>
//               <div className="flex items-center gap-2 text-gray-600">
//                 <Calendar className="w-4 h-4" />
//                 <span>{appt.date}</span>
//                 <Clock className="w-4 h-4 ml-2" />
//                 <span>{appt.time}</span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     ) : (
//       <p className="text-gray-500">No {title.toLowerCase()} yet.</p>
//     )}
//   </section>
// );

// export default AppointmentsPage;


import React, { useEffect, useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { getAppointments } from '../api/appointments';
import { useHealthSaathi } from '../context/HealthSaathiContext';
import { useNavigate } from 'react-router-dom'; // ✅ import navigation

interface Appointment {
  _id: string;
  userId: string;
  doctorName: string;
  specialization?: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useHealthSaathi();
  const navigate = useNavigate(); // ✅ initialize navigate

  const fetchAppointments = async () => {
    if (!user?._id) return; // ✅ fixed here
    setLoading(true);
    setError(null);
    try {
      const data = await getAppointments();
      setAppointments(data.filter((a: Appointment) => a.userId === user._id)); // ✅ fixed here
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };
  


  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const upcoming = appointments.filter((a) => a.status === 'upcoming');
  const past = appointments.filter((a) => a.status === 'completed');

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={() => navigate('/doctors')} // ✅ navigate to Doctors page
        >
          <Calendar className="w-5 h-5" />
          Book New Appointment
        </button>
      </div>

      <div className="grid gap-6">
        <Section title="Upcoming Appointments" items={upcoming} />
        <Section title="Past Appointments" items={past} />
      </div>
    </div>
  );
};

interface SectionProps {
  title: string;
  items: Appointment[];
}

const Section: React.FC<SectionProps> = ({ title, items }) => (
  <section className="bg-white rounded-xl shadow-md p-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
    {items.length ? (
      <div className="space-y-4">
        {items.map((appt) => (
          <div
            key={appt._id}
            className={`border border-gray-200 rounded-lg p-4 ${
              appt.status === 'completed' ? 'opacity-75' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{appt.doctorName}</h3>
                <p className="text-gray-600">{appt.specialization || 'General'}</p>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{new Date(appt.date).toLocaleDateString()}</span>
                <Clock className="w-4 h-4 ml-2" />
                <span>{appt.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500">No {title.toLowerCase()} yet.</p>
    )}
  </section>
);

export default AppointmentsPage;
