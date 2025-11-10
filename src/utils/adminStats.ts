import { getAppointmentsFromDB } from './appointments';
import { getAllPets } from './petsDB';
import { getUsersFromDB } from './usersDB';

export interface AdminStats {
  totalAppointments: number;
  totalPets: number;
  activeClients: number;
  scheduledAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
}

export const getAdminStats = async (): Promise<AdminStats> => {
  try {
    console.log('🔍 Loading admin stats from localStorage...');
    
    // Get appointments from localStorage
    const appointments = await getAppointmentsFromDB();
    console.log('✅ Appointments loaded:', appointments.length);

    // Get pets from localStorage
    const pets = await getAllPets();
    console.log('✅ Pets loaded:', pets.length);

    // Calculate unique clients (owners) from appointments
    const uniqueClients = new Set();
    appointments.forEach(apt => {
      if (apt.owner_id) uniqueClients.add(apt.owner_id);
    });

    // Calculate appointment status counts (case-insensitive)
    const scheduledAppointments = appointments.filter(apt => apt.status?.toLowerCase() === 'scheduled').length;
    const completedAppointments = appointments.filter(apt => apt.status?.toLowerCase() === 'completed').length;
    const cancelledAppointments = appointments.filter(apt => apt.status?.toLowerCase() === 'cancelled').length;

    return {
      totalAppointments: appointments.length,
      totalPets: pets.length,
      activeClients: uniqueClients.size,
      scheduledAppointments,
      completedAppointments,
      cancelledAppointments,
    };
  } catch (error) {
    console.error('Error calculating admin stats:', error);
    return {
      totalAppointments: 0,
      totalPets: 0,
      activeClients: 0,
      scheduledAppointments: 0,
      completedAppointments: 0,
      cancelledAppointments: 0,
    };
  }
};

export const getRecentAppointments = async (limit: number = 5) => {
  try {
    console.log('🔍 Loading recent appointments from localStorage...');
    
    const appointments = await getAppointmentsFromDB();
    const recent = appointments
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
    
    console.log('✅ Recent appointments loaded:', recent.length);
    
    return recent.map((apt: any) => ({
      id: apt.id,
      petName: apt.pet_name,
      service: apt.service,
      date: apt.appointment_date,
      timeSlot: apt.time_slot,
      ownerName: apt.owner_name,
      status: apt.status,
      createdAt: new Date(apt.created_at).getTime()
    }));
  } catch (error) {
    console.error('Error getting recent appointments:', error);
    return [];
  }
};

export const getAppointmentsByStatus = async (status: string) => {
  try {
    console.log('🔍 Loading appointments by status from localStorage...');
    
    const appointments = await getAppointmentsFromDB();
    const filtered = appointments.filter(apt => apt.status.toLowerCase() === status.toLowerCase());
    
    console.log('✅ Appointments by status loaded:', filtered.length);
    
    return filtered.map((apt: any) => ({
      id: apt.id,
      petName: apt.pet_name,
      service: apt.service,
      date: apt.appointment_date,
      timeSlot: apt.time_slot,
      ownerName: apt.owner_name,
      status: apt.status,
      createdAt: new Date(apt.created_at).getTime()
    }));
  } catch (error) {
    console.error('Error getting appointments by status:', error);
    return [];
  }
};
