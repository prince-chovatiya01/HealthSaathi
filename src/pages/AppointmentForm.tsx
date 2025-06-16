import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useHealthSaathi } from '../context/HealthSaathiContext';
import axiosInstance from '../api/axiosInstance'; // ✅ use configured axios

interface Doctor {
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
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  useEffect(() => {
    if (doctorId) {
      (async () => {
        try {
          const res = await axiosInstance.get(`/doctors/${doctorId}`);
          setDoctor(res.data);
        } catch (err) {
          console.error('Error fetching doctor:', err);
        }
      })();
    }
  }, [doctorId]);

  useEffect(() => {
    if (!date || !doctor) return;

    (async () => {
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });

      const dayAvailability = doctor.availability.find(
        (a) => a.day.toLowerCase() === dayName.toLowerCase()
      );

      if (!dayAvailability || dayAvailability.slots.length === 0) {
        setSlots([]);
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
      }
    })();
  }, [date, doctor, doctorId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSlot || !user || !user._id || !doctorId) {
      setMessage('❌ Missing doctor, user, or selected time slot.');
      return;
    }

    const time = selectedSlot.split('-')[0]; // extract "HH:MM" from "HH:MM-HH:MM"

    try {
      await axiosInstance.post('/appointments', {
        doctorId,
        date,
        time,
      });
      setMessage('✅ Appointment booked successfully!');
    } catch (err: any) {
      setMessage(err.response?.data?.message || '❌ Booking failed.');
    }
  };


  return (
    <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Doctor Availability:</h2>
      {doctor?.availability.map((a, index) => (
        <p key={index}>
          {a.day}:{' '}
          {a.slots.length > 0
            ? `${a.slots[0].startTime} - ${a.slots[a.slots.length - 1].endTime}`
            : '-'}
        </p>
      ))}

      <label>
        Select Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-2 py-1"
          required
        />
      </label>

      {slots.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {slots.map(({ slot, available }) => (
            <button
              type="button"
              key={slot}
              disabled={!available}
              onClick={() => setSelectedSlot(slot)}
              className={`px-3 py-2 border rounded ${
                selectedSlot === slot
                  ? 'bg-blue-500 text-white'
                  : available
                  ? 'bg-green-100 hover:bg-green-200'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {slot} - {available ? 'Available' : 'Unavailable'}
            </button>
          ))}
        </div>
      ) : (
        date && <p>No available slots for the selected date.</p>
      )}

      <button
        type="submit"
        disabled={!selectedSlot}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Book Appointment
      </button>

      {message && <p className="mt-2">{message}</p>}
    </form>
  );
};

export default AppointmentForm;

// ✅ Utilities

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
