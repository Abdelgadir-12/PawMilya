import { createContext } from 'react';
import { User as AuthUser } from '@supabase/supabase-js';
import { Profile, Pet, Appointment } from "@/types/database";

export interface AuthContextType {
  user: (AuthUser & Profile) | null;
  login: (email: string, password: string) => Promise<{ success: boolean; isAdmin?: boolean }>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<Profile>) => Promise<void>;
  getUserPets: () => Promise<Pet[]>;
  addPet: (pet: Omit<Pet, 'id' | 'owner_id' | 'created_at' | 'updated_at'>) => Promise<Pet>;
  updatePet: (id: string, updates: Partial<Omit<Pet, 'id' | 'owner_id' | 'created_at' | 'updated_at'>>) => Promise<boolean>;
  deletePet: (id: string) => Promise<boolean>;
  getPetById: (id: string) => Promise<Pet | null>;
  calculatePetAge: (birthDate: string) => string;
  getUserAppointments: () => Promise<Appointment[]>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);