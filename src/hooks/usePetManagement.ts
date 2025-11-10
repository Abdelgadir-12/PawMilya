import { useCallback } from "react";
import { Pet, Appointment, User } from "@/types/auth";
import { getUserPets, addPet, updatePet, deletePet, getPetById } from "@/utils/petsDB";
import { getAppointmentsFromDB } from "@/utils/appointments";

export const usePetManagement = (user: User | null) => {
  const getUserPetsCallback = useCallback(async (): Promise<Pet[]> => {
    if (!user) return [];
    return getUserPets(user.id);
  }, [user?.id]);

  const addPetCallback = useCallback(async (pet: Omit<Pet, 'id' | 'ownerId'>): Promise<Pet> => {
    if (!user) throw new Error("User not authenticated");
    return addPet(pet, user.id);
  }, [user?.id]);

  const updatePetCallback = useCallback(async (id: string, updates: Partial<Omit<Pet, 'id' | 'ownerId'>>): Promise<boolean> => {
    if (!user) return false;
    return updatePet(id, updates, user.id);
  }, [user?.id]);

  const deletePetCallback = useCallback(async (id: string): Promise<boolean> => {
    if (!user) return false;
    return deletePet(id, user.id);
  }, [user?.id]);

  const getPetByIdCallback = useCallback(async (id: string): Promise<Pet | null> => {
    if (!user) return null;
    return getPetById(id, user.id);
  }, [user?.id]);

  const calculatePetAge = useCallback((birthDate: string): string => {
    const today = new Date();
    const birth = new Date(birthDate);
    
    let years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    
    if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
      years--;
    }
    
    let remainingMonths = months;
    if (remainingMonths < 0) {
      remainingMonths += 12;
    }
    
    if (years < 1) {
      return remainingMonths === 1 ? "1 month" : `${remainingMonths} months`;
    } else if (remainingMonths === 0) {
      return years === 1 ? "1 year" : `${years} years`;
    } else {
      return `${years} ${years === 1 ? "year" : "years"} and ${remainingMonths} ${remainingMonths === 1 ? "month" : "months"}`;
    }
  }, []);

  const getUserAppointments = useCallback(async (): Promise<Appointment[]> => {
    if (!user) return [];

    try {
      console.log('🔍 Loading user appointments...');
      const allAppointments = await getAppointmentsFromDB();
      const userAppointments = allAppointments.filter(apt => apt.owner_id === user.id);
      console.log('✅ User appointments loaded successfully:', userAppointments.length);
      return userAppointments;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return [];
    }
  }, [user?.id]);

  return {
    getUserPets: getUserPetsCallback,
    addPet: addPetCallback,
    updatePet: updatePetCallback,
    deletePet: deletePetCallback,
    getPetById: getPetByIdCallback,
    calculatePetAge,
    getUserAppointments
  };
};
