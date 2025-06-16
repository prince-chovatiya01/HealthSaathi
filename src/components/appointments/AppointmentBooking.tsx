import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { appointments } from '../../api';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface AppointmentBookingProps {
  doctorId: string;
  doctorName: string;
  onSuccess: () => void;
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  doctorId,
  doctorName,
  onSuccess
}) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time || !symptoms.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      await appointments.create({
        doctorId,
        date,
        time,
        symptoms: symptoms.trim()
      });

      toast.success('Appointment booked successfully!');
      onSuccess();

      // Optionally reset form after success
      setDate('');
      setTime('');
      setSymptoms('');
    } catch (error) {
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-semibold mb-6">
        Book Appointment with Dr. {doctorName}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Time
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select a time slot</option>
              <option value="09:00">09:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="14:00">02:00 PM</option>
              <option value="15:00">03:00 PM</option>
              <option value="16:00">04:00 PM</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe Your Symptoms
          </label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={4}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Please describe your symptoms..."
            required
          />
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Important Information
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Please arrive 15 minutes before your appointment time</li>
                  <li>Bring any relevant medical records or test reports</li>
                  <li>Consultation fee will be collected at the clinic</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`
              bg-indigo-600 text-white px-6 py-2 rounded-lg
              hover:bg-indigo-700 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AppointmentBooking;
