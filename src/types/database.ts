export type Profile = {
  id: string;
  email: string;
  full_name: string;
  phone_number: string;
  role: 'user' | 'admin' | 'vet';
  created_at: string;
  updated_at: string;
};

export type Pet = {
  id: string;
  owner_id: string;
  name: string;
  species: string;
  breed: string;
  birthDate?: string;
  age: string;
  gender: string;
  weight: number;
  medical_history?: string;
  created_at: string;
  updated_at: string;
};

export type Appointment = {
  id: string;
  pet_id: string;
  owner_id: string;
  service_type: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  vet_id?: string;
  created_at: string;
  updated_at: string;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  created_at: string;
  updated_at: string;
};

export type Feedback = {
  id: string;
  user_id: string;
  appointment_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
};

export type MedicalRecord = {
  id: string;
  pet_id: string;
  appointment_id: string;
  diagnosis: string;
  treatment: string;
  prescription?: string;
  notes?: string;
  vet_id: string;
  created_at: string;
  updated_at: string;
};