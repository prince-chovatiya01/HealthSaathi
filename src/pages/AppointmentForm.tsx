import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useHealthSaathi } from '../context/HealthSaathiContext';
import axiosInstance from '../api/axiosInstance';
import { Calendar, Clock, User, Stethoscope, MessageSquare, CheckCircle, XCircle } from 'lucide-react';

interface Doctor {
  name?: string;
  specialization?: string;
  availability: { day: string; slots: { startTime: string; endTime: string }[] }[];
}

interface Appointment {
  date: string;
  timeSlot: string;
}

const AppointmentForm: React.FC = () => {
  const { id: doctorId } = useParams();
  const { user } = useHealthSaathi();

  const [date, setDate] = useState('');
  const [slots, setSlots] = useState<{ slot: string; available: boolean }[]>([]);
  const [message, setMessage] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (doctorId) {
      (async () => {
        try {
          const res = await axiosInstance.get(`/doctors/${doctorId}`);
          setDoctor(res.data);
        } catch (err) {
          console.error('Error fetching doctor:', err);
          setErrorMessage('Failed to load doctor information');
        }
      })();
    }
  }, [doctorId]);

  useEffect(() => {
    if (!date || !doctor) return;

    (async () => {
      setLoading(true);
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });

      const dayAvailability = doctor.availability.find(
        (a) => a.day.toLowerCase() === dayName.toLowerCase()
      );

      if (!dayAvailability || dayAvailability.slots.length === 0) {
        setSlots([]);
        setLoading(false);
        return;
      }

      const generated: string[] = [];

      for (const s of dayAvailability.slots) {
        const start = parseTime(s.startTime);
        const end = parseTime(s.endTime);

        for (let t = start; t + 60 <= end; t += 60) {
          const slotStart = formatMinutesToTime(t);
          const slotEnd = formatMinutesToTime(t + 60);
          generated.push(`${slotStart}-${slotEnd}`);
        }
      }

      try {
        const appts = await axiosInstance.get(`/appointments`, {
          params: { doctor: doctorId, date }
        });

        const taken: string[] = appts.data.map((a: Appointment) => a.timeSlot);

        setSlots(
          generated.map((slot) => ({
            slot,
            available: !taken.includes(slot),
          }))
        );
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setErrorMessage('Failed to load available slots');
      } finally {
        setLoading(false);
      }
    })();
  }, [date, doctor, doctorId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!selectedSlot || !user || !user._id || !doctorId) {
      setErrorMessage('Missing doctor, user, or selected time slot.');
      setLoading(false);
      return;
    }

    const time = selectedSlot.split('-')[0];

    try {
      await axiosInstance.post('/appointments', {
        doctorId,
        date,
        time,
        symptoms: symptoms || 'No symptoms provided'
      });
      
      setSuccessMessage('Appointment booked successfully!');
      setSelectedSlot('');
      setDate('');
      setSymptoms('');
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Book Your Appointment</h1>
          <p className="text-gray-600">Schedule a consultation with your healthcare provider</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Doctor Info Section */}
          {doctor && (
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{doctor.name || 'Dr. Healthcare Provider'}</h2>
                  <p className="text-blue-100">{doctor.specialization || 'General Medicine'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Availability Schedule */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              Doctor's Availability
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctor?.availability.map((a, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="font-medium text-gray-800 mb-1">{a.day}</div>
                  <div className="text-sm text-gray-600">
                    {a.slots.length > 0
                      ? `${a.slots[0].startTime} - ${a.slots[a.slots.length - 1].endTime}`
                      : 'Not Available'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                Select Date
              </label>
              <input
                type="date"
                value={date}
                min={getTodayDate()}
                onChange={(e) => {
                  setDate(e.target.value);
                  setSelectedSlot('');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* Time Slots */}
            {date && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-blue-600" />
                  Available Time Slots
                </label>
                
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading available slots...</span>
                  </div>
                ) : slots.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {slots.map(({ slot, available }) => (
                      <button
                        type="button"
                        key={slot}
                        disabled={!available}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          selectedSlot === slot
                            ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                            : available
                            ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 hover:shadow-md'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                        }`}
                      >
                        <div className="font-semibold">{slot}</div>
                        <div className="text-xs opacity-75">
                          {available ? 'Available' : 'Booked'}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No available slots for the selected date</p>
                    <p className="text-sm">Please choose another date</p>
                  </div>
                )}
              </div>
            )}

            {/* Symptoms Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
                Symptoms or Reason for Visit (Optional)
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Please describe your symptoms or reason for the visit..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!selectedSlot || loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Booking Appointment...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <User className="w-5 h-5 mr-2" />
                  Book Appointment
                </div>
              )}
            </button>

            {/* Messages */}
            {successMessage && (
              <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
                <span className="font-medium">{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                <XCircle className="w-5 h-5 mr-3 text-red-600" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            {/* Legacy message display for backward compatibility */}
            {message && !successMessage && !errorMessage && (
              <div className={`p-4 rounded-lg ${
                message.includes('✅') 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {message}
              </div>
            )}
          </form>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Need help? Contact our support team for assistance with booking.</p>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;

// Utilities (unchanged)
const parseTime = (timeStr?: string) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const formatMinutesToTime = (minutes: number) => {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};