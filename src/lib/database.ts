import { supabase } from './supabase';
import type { Profile, Pet, Appointment, Service, Feedback, MedicalRecord } from '../types/database';

// Helper to normalize pet rows from the DB (snake_case) to the app (camelCase)
const mapPetRow = (row: any): Pet => {
  if (!row) return row;
  return {
    ...row,
    // prefer snake_case birth_date from DB, fall back to birthDate if already present
    birthDate: row.birth_date ?? row.birthDate ?? undefined,
  } as Pet;
};

// Profile functions
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data: data as Profile | null, error };
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data: data as Profile | null, error };
};

// Pet functions
export const getPets = async (ownerId: string) => {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('owner_id', ownerId);
  const mapped = Array.isArray(data) ? (data as any[]).map(mapPetRow) : null;
  return { data: mapped as Pet[] | null, error };
};

export const getPet = async (petId: string) => {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('id', petId)
    .single();
  const mapped = data ? mapPetRow(data) : null;
  return { data: mapped as Pet | null, error };
};

export const createPet = async (petData: Omit<Pet, 'id' | 'created_at' | 'updated_at'>) => {
  // Only include columns that exist in the DB table. Map birthDate -> birth_date.
  const insertData: any = {
    owner_id: (petData as any).owner_id ?? petData.owner_id,
    name: petData.name,
    species: petData.species,
    breed: (petData as any).breed ?? null,
    gender: (petData as any).gender ?? null,
    weight: (petData as any).weight ?? null,
    medical_history: (petData as any).medical_history ?? null,
  };
  if ((petData as any).birthDate) insertData.birth_date = (petData as any).birthDate;

  const { data, error } = await supabase
    .from('pets')
    .insert(insertData)
    .select()
    .single();

  const mapped = data ? mapPetRow(data) : null;
  return { data: mapped as Pet | null, error };
};

export const updatePet = async (petId: string, updates: Partial<Pet>) => {
  const updateData: any = {};
  if ((updates as any).name !== undefined) updateData.name = (updates as any).name;
  if ((updates as any).species !== undefined) updateData.species = (updates as any).species;
  if ((updates as any).breed !== undefined) updateData.breed = (updates as any).breed;
  if ((updates as any).gender !== undefined) updateData.gender = (updates as any).gender;
  if ((updates as any).weight !== undefined) updateData.weight = (updates as any).weight;
  if ((updates as any).medical_history !== undefined) updateData.medical_history = (updates as any).medical_history;
  if ((updates as any).birthDate !== undefined) updateData.birth_date = (updates as any).birthDate;

  const { data, error } = await supabase
    .from('pets')
    .update(updateData)
    .eq('id', petId)
    .select()
    .single();

  const mapped = data ? mapPetRow(data) : null;
  return { data: mapped as Pet | null, error };
};

export const deletePet = async (petId: string) => {
  const { error } = await supabase
    .from('pets')
    .delete()
    .eq('id', petId);
  return { error };
};

// Appointment functions
export const getAppointments = async (userId: string) => {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      pet:pets(*),
      service:services(*),
      vet:profiles!vet_id(*)
    `)
    .eq('owner_id', userId);
  let mapped = null;
  if (Array.isArray(data)) {
    mapped = (data as any[]).map((row) => {
      // map nested pet row to include birthDate
      if (row.pet) row.pet = mapPetRow(row.pet);
      return row as Appointment & { pet: Pet; service: Service; vet: Profile };
    });
  }
  return { data: mapped as (Appointment & { pet: Pet; service: Service; vet: Profile })[] | null, error };
};

export const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('appointments')
    .insert(appointmentData)
    .select()
    .single();
  return { data: data as Appointment | null, error };
};

export const updateAppointment = async (appointmentId: string, updates: Partial<Appointment>) => {
  const { data, error } = await supabase
    .from('appointments')
    .update(updates)
    .eq('id', appointmentId)
    .select()
    .single();
  return { data: data as Appointment | null, error };
};

export const deleteAppointment = async (appointmentId: string) => {
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', appointmentId);
  return { error };
};

// Service functions
export const getServices = async () => {
  const { data, error } = await supabase
    .from('services')
    .select('*');
  return { data: data as Service[] | null, error };
};

// Feedback functions
export const createFeedback = async (feedbackData: Omit<Feedback, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('feedback')
    .insert(feedbackData)
    .select()
    .single();
  return { data: data as Feedback | null, error };
};

export const getFeedback = async (appointmentId: string) => {
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .eq('appointment_id', appointmentId)
    .single();
  return { data: data as Feedback | null, error };
};

// Medical Record functions
export const getMedicalRecords = async (petId: string) => {
  const { data, error } = await supabase
    .from('medical_records')
    .select(`
      *,
      vet:profiles!vet_id(*)
    `)
    .eq('pet_id', petId);
  return { data: data as (MedicalRecord & { vet: Profile })[] | null, error };
};

// Admin helpers (require appropriate RLS policies allowing admins to read all rows)
export const getAllPets = async () => {
  const { data, error } = await supabase
    .from('pets')
    .select(`*, owner:profiles(*)`);

  const mapped = Array.isArray(data)
    ? (data as any[]).map((row) => ({ ...mapPetRow(row), owner: row.owner }))
    : null;
  return { data: mapped as (Pet & { owner?: Profile })[] | null, error };
};

export const getAllAppointments = async () => {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      pet:pets(*),
      service:services(*),
      owner:profiles!owner_id(*)
    `);

  let mapped = null;
  if (Array.isArray(data)) {
    mapped = (data as any[]).map((row) => {
      if (row.pet) row.pet = mapPetRow(row.pet);
      return row as Appointment & { pet: Pet; service: Service; owner: Profile };
    });
  }
  return { data: mapped as (Appointment & { pet: Pet; service: Service; owner: Profile })[] | null, error };
};