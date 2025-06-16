import axios from './axiosInstance.ts';

export const getAppointments = async () => {
  const res = await axios.get('/appointments');
  return res.data;
};

export const createAppointment = async (appointmentData: {
  doctorId: string;
  date: string;
  time: string;
  symptoms?: string;
}) => {
  const res = await axios.post('/appointments', appointmentData);
  return res.data;
};

