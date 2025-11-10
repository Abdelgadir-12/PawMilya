import { 
  getAppointments, 
  saveAppointment, 
  updateAppointmentStatus as updateLocalAppointmentStatus, 
  deleteAppointment, 
  type Appointment as LocalAppointment 
} from './localStorageDB';
import { getSessionUser } from './localAuth';

export interface Appointment {
  id: string;
  pet_name: string;
  owner_name: string;
  service: string;
  appointment_date: string;
  time_slot: string;
  status: string;
  owner_id: string;
  user_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AppointmentInput {
  pet_name: string;
  pet_species?: string;
  owner_name: string;
  email?: string;
  phone?: string;
  service: string;
  appointment_date: string;
  time_slot?: string;
  additional_info?: string;
  blood_test?: string;
}

// Convert local appointment to DB format
const convertToDBFormat = (localApt: LocalAppointment, userId: string): Appointment => {
  return {
    id: localApt.id,
    pet_name: localApt.petName,
    owner_name: localApt.ownerName,
    service: localApt.service,
    appointment_date: localApt.date,
    time_slot: localApt.timeSlot || localApt.time || '',
    status: localApt.status,
    owner_id: userId,
    user_notes: localApt.additionalInfo,
    created_at: new Date(localApt.createdAt).toISOString(),
    updated_at: new Date(localApt.createdAt).toISOString(),
  };
};

// Convert DB format to local format
const convertToLocalFormat = (dbApt: AppointmentInput & { owner_id?: string }): Omit<LocalAppointment, 'id' | 'status' | 'createdAt'> => {
  return {
    petName: dbApt.pet_name,
    ownerName: dbApt.owner_name,
    service: dbApt.service,
    date: dbApt.appointment_date,
    timeSlot: dbApt.time_slot || '',
    time: dbApt.time_slot || '',
    email: dbApt.email || '',
    phone: dbApt.phone || '',
    petSpecies: dbApt.pet_species || '',
    additionalInfo: dbApt.additional_info,
  };
};

export const ensureAdminAccess = async (): Promise<boolean> => {
  try {
    const user = getSessionUser();
    if (!user) {
      return false;
    }
    return user.role === 'admin';
  } catch (error) {
    console.error('❌ Failed to ensure admin access:', error);
    return false;
  }
};

export const getAppointmentsFromDB = async (): Promise<Appointment[]> => {
  try {
    console.log('🔍 Fetching appointments from localStorage...');
    const localAppointments = getAppointments();
    
    // Convert to DB format
    // If owner_id is stored, use it; otherwise try to match by email
    const users = await import('./localAuth').then(m => m.readUsers());
    const emailToUserId = new Map(users.map(u => [u.email.toLowerCase(), u.id]));
    
    const appointments = localAppointments.map(apt => {
      // Use stored owner_id if available, otherwise match by email
      const ownerId = (apt as any).owner_id || 
                     (apt.email ? (emailToUserId.get(apt.email.toLowerCase()) || 'anonymous') : 'anonymous');
      return convertToDBFormat(apt, ownerId);
    });
    
    console.log('✅ Appointments loaded successfully:', appointments.length);
    return appointments;
  } catch (error) {
    console.error('❌ Failed to fetch appointments:', error);
    return [];
  }
};

export const getAppointmentsForUser = async (userId: string): Promise<Appointment[]> => {
  try {
    console.log(`🔍 Fetching appointments for user: ${userId}`);
    const allAppointments = await getAppointmentsFromDB();
    const userAppointments = allAppointments.filter(apt => apt.owner_id === userId);
    console.log(`✅ Found ${userAppointments.length} appointments for user ${userId}`);
    return userAppointments;
  } catch (error) {
    console.error('❌ Failed to fetch user appointments:', error);
    return [];
  }
};

export const saveAppointmentToDB = async (appointment: AppointmentInput & { owner_id?: string }): Promise<Appointment> => {
  try {
    console.log('💾 Saving appointment to localStorage...', appointment);
    
    const user = getSessionUser();
    const userId = appointment.owner_id || user?.id || 'anonymous';
    
    const localAppointmentInput = convertToLocalFormat(appointment);
    // Add owner_id to the saved appointment for tracking
    const localAppointmentWithOwner = {
      ...localAppointmentInput,
      owner_id: userId,
    };
    
    const savedAppointment = await saveAppointment(localAppointmentWithOwner as any);
    
    // Convert back to DB format
    const dbAppointment = convertToDBFormat(savedAppointment, userId);
    console.log('✅ Appointment saved successfully:', dbAppointment);
    return dbAppointment;
  } catch (error) {
    console.error('❌ Failed to save appointment:', error);
    throw error;
  }
};

export const updateAppointmentStatusInDB = async (id: string, status: string): Promise<boolean> => {
  try {
    console.log(`🔄 Updating appointment ${id} status to: ${status}`);
    const success = updateLocalAppointmentStatus(id, status);
    if (success) {
      console.log('✅ Appointment status updated successfully');
    }
    return success;
  } catch (error) {
    console.error('❌ Failed to update appointment status:', error);
    throw error;
  }
};

export const updateAppointmentNotesInDB = async (id: string, user_notes: string): Promise<boolean> => {
  try {
    console.log(`📝 Updating appointment ${id} notes`);
    const appointments = getAppointments();
    const appointmentIndex = appointments.findIndex(apt => apt.id === id);
    
    if (appointmentIndex === -1) {
      throw new Error(`Appointment with id ${id} not found`);
    }
    
    appointments[appointmentIndex] = {
      ...appointments[appointmentIndex],
      additionalInfo: user_notes,
    };
    
    localStorage.setItem('appointments', JSON.stringify(appointments));
    console.log('✅ Appointment notes updated successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to update appointment notes:', error);
    throw error;
  }
};

export const deleteAppointmentFromDB = async (id: string): Promise<boolean> => {
  try {
    console.log(`🗑️ Deleting appointment ${id}`);
    const success = deleteAppointment(id);
    if (success) {
      console.log('✅ Appointment deleted successfully');
    }
    return success;
  } catch (error) {
    console.error('❌ Failed to delete appointment:', error);
    throw error;
  }
};

export const getAppointmentsByStatus = async (status: string): Promise<Appointment[]> => {
  try {
    console.log(`🔍 Fetching appointments with status: ${status}`);
    const allAppointments = await getAppointmentsFromDB();
    const filtered = allAppointments.filter(apt => apt.status.toLowerCase() === status.toLowerCase());
    console.log(`✅ Found ${filtered.length} appointments with status: ${status}`);
    return filtered;
  } catch (error) {
    console.error('❌ Failed to fetch appointments by status:', error);
    return [];
  }
};

export const getUpcomingAppointments = async (): Promise<Appointment[]> => {
  try {
    console.log('🔍 Fetching upcoming appointments...');
    const allAppointments = await getAppointmentsFromDB();
    const today = new Date().toISOString().split('T')[0];
    const upcoming = allAppointments.filter(apt => {
      return apt.appointment_date >= today && apt.status.toLowerCase() !== 'cancelled';
    });
    console.log(`✅ Found ${upcoming.length} upcoming appointments`);
    return upcoming;
  } catch (error) {
    console.error('❌ Failed to fetch upcoming appointments:', error);
    return [];
  }
};

export const getAppointmentStats = async () => {
  try {
    console.log('📊 Fetching appointment statistics...');
    const appointments = await getAppointmentsFromDB();
    
    const stats = {
      total: appointments.length,
      scheduled: appointments.filter(apt => apt.status.toLowerCase() === 'scheduled').length,
      completed: appointments.filter(apt => apt.status.toLowerCase() === 'completed').length,
      cancelled: appointments.filter(apt => apt.status.toLowerCase() === 'cancelled').length
    };
    
    console.log('✅ Appointment stats:', stats);
    return stats;
  } catch (error) {
    console.error('❌ Failed to fetch appointment stats:', error);
    return {
      total: 0,
      scheduled: 0,
      completed: 0,
      cancelled: 0
    };
  }
};

export const testAppointmentDBConnection = async (): Promise<boolean> => {
  try {
    console.log('🔍 Testing appointment database connection...');
    const appointments = getAppointments();
    console.log('✅ Appointment DB connection test successful');
    return true;
  } catch (error) {
    console.error('❌ Appointment DB connection test error:', error);
    return false;
  }
};

export const getAppointmentsBypass = async (): Promise<Appointment[]> => {
  console.log('🚀 Loading all appointments...');
  return getAppointmentsFromDB();
};

