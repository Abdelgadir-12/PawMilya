import { Pet } from '@/types/auth';
import { getSessionUser } from './localAuth';

const PETS_KEY = 'pets';

interface StoredPet {
  id: string;
  owner_id: string;
  name: string;
  type: string;
  species: string;
  breed: string | null;
  weight: string | null;
  birth_date: string;
  gender: string;
  created_at: string;
  updated_at: string;
}

const readPets = (): StoredPet[] => {
  try {
    const raw = localStorage.getItem(PETS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writePets = (pets: StoredPet[]) => {
  localStorage.setItem(PETS_KEY, JSON.stringify(pets));
};

const convertToPet = (stored: StoredPet): Pet => {
  return {
    id: stored.id,
    name: stored.name,
    type: stored.type as Pet['type'],
    species: stored.species,
    breed: stored.breed || undefined,
    weight: stored.weight || undefined,
    birthDate: stored.birth_date,
    gender: stored.gender as Pet['gender'],
    ownerId: stored.owner_id,
  };
};

const convertFromPet = (pet: Omit<Pet, 'id' | 'ownerId'>, ownerId: string): Omit<StoredPet, 'id' | 'created_at' | 'updated_at'> => {
  return {
    owner_id: ownerId,
    name: pet.name,
    type: pet.type,
    species: pet.species,
    breed: pet.breed || null,
    weight: pet.weight || null,
    birth_date: pet.birthDate,
    gender: pet.gender,
  };
};

export const getUserPets = async (userId: string): Promise<Pet[]> => {
  try {
    const pets = readPets();
    const userPets = pets.filter(p => p.owner_id === userId);
    return userPets.map(convertToPet);
  } catch (error) {
    console.error('Error fetching pets:', error);
    return [];
  }
};

export const addPet = async (pet: Omit<Pet, 'id' | 'ownerId'>, userId: string): Promise<Pet> => {
  try {
    const pets = readPets();
    const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `pet-${Date.now()}`;
    
    const newPet: StoredPet = {
      id,
      ...convertFromPet(pet, userId),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    pets.push(newPet);
    writePets(pets);
    return convertToPet(newPet);
  } catch (error) {
    console.error('Error adding pet:', error);
    throw error;
  }
};

export const updatePet = async (id: string, updates: Partial<Omit<Pet, 'id' | 'ownerId'>>, userId: string): Promise<boolean> => {
  try {
    const pets = readPets();
    const petIndex = pets.findIndex(p => p.id === id && p.owner_id === userId);
    
    if (petIndex === -1) {
      return false;
    }
    
    if (updates.name) pets[petIndex].name = updates.name;
    if (updates.type) pets[petIndex].type = updates.type;
    if (updates.species) pets[petIndex].species = updates.species;
    if (updates.breed !== undefined) pets[petIndex].breed = updates.breed || null;
    if (updates.weight !== undefined) pets[petIndex].weight = updates.weight || null;
    if (updates.birthDate) pets[petIndex].birth_date = updates.birthDate;
    if (updates.gender) pets[petIndex].gender = updates.gender;
    pets[petIndex].updated_at = new Date().toISOString();
    
    writePets(pets);
    return true;
  } catch (error) {
    console.error('Error updating pet:', error);
    return false;
  }
};

export const deletePet = async (id: string, userId: string): Promise<boolean> => {
  try {
    const pets = readPets();
    const filtered = pets.filter(p => !(p.id === id && p.owner_id === userId));
    writePets(filtered);
    return filtered.length < pets.length;
  } catch (error) {
    console.error('Error deleting pet:', error);
    return false;
  }
};

export const getPetById = async (id: string, userId: string): Promise<Pet | null> => {
  try {
    const pets = readPets();
    const pet = pets.find(p => p.id === id && p.owner_id === userId);
    return pet ? convertToPet(pet) : null;
  } catch (error) {
    console.error('Error fetching pet:', error);
    return null;
  }
};

export const getAllPets = async (): Promise<Pet[]> => {
  try {
    const pets = readPets();
    return pets.map(convertToPet);
  } catch (error) {
    console.error('Error fetching all pets:', error);
    return [];
  }
};

