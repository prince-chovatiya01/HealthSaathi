import axios, {
  InternalAxiosRequestConfig,
  AxiosResponse
} from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Correct type used for interceptor: InternalAxiosRequestConfig
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// --- TypeScript interfaces ---

interface RegisterData {
  name: string;
  phoneNumber: string;
  password: string;
  village: string;
  district: string;
  state: string;
}

interface LoginData {
  phoneNumber: string;
  password: string;
}

interface ReviewData {
  rating: number;
  comment: string;
}

interface AppointmentCreateData {
  doctorId: string;
  date: string;
  time: string;
  symptoms?: string;
}

interface AppointmentStatusUpdate {
  status: 'scheduled' | 'completed' | 'cancelled';
}

// --- API wrappers ---

export const auth = {
  register: (data: RegisterData) => api.post('/users/register', data),
  login: (data: LoginData) => api.post('/users/login', data),
  getProfile: () => api.get('/users/profile'),
};

export const doctors = {
  getAll: (params?: Record<string, any>) => api.get('/doctors', { params }),
  getById: (id: string) => api.get(`/doctors/${id}`),
  addReview: (id: string, data: ReviewData) => api.post(`/doctors/${id}/reviews`, data),
};

export const appointments = {
  getAll: () => api.get('/appointments'),
  create: (data: AppointmentCreateData) => api.post('/appointments', data),
  updateStatus: (id: string, data: AppointmentStatusUpdate) => api.patch(`/appointments/${id}`, data),
};

export const healthRecords = {
  getAll: () => api.get('/health-records'),
  create: (data: FormData) => api.post('/health-records', data),
};

export default api;
