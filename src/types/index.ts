export type Language = 'en' | 'hi' | 'bn' | 'te' | 'ta' | 'mr' | 'gu';

export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  village?: string;
  district?: string;
  state?: string;
  healthRecords?: HealthRecord[];
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  languages: Language[];
  experience: number;
  availability: string[];
  rating: number;
  imageUrl: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  userId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  symptoms?: string;
  notes?: string;
}

export interface HealthRecord {
  id: string;
  userId: string;
  recordType: 'prescription' | 'labReport' | 'vaccination' | 'general';
  date: string;
  doctorName?: string;
  hospitalName?: string;
  details: string;
  attachmentUrls?: string[];
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  price: number;
  availability: boolean;
  imageUrl?: string;
}

export interface MedicineOrder {
  id: string;
  userId: string;
  medicines: { medicineId: string; quantity: number }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  orderDate: string;
  estimatedDelivery?: string;
}

export interface SymptomCheckerResult {
  possibleConditions: {
    name: string;
    probability: number;
    urgency: 'low' | 'medium' | 'high';
    description: string;
  }[];
  recommendedAction: 'selfCare' | 'consult' | 'emergency';
  selfCareSteps?: string[];
}