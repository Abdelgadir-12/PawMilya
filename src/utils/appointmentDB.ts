// Re-export from the new localStorage-based appointments
export {
  getAppointmentsFromDB,
  getAppointmentsForUser,
  saveAppointmentToDB,
  updateAppointmentStatusInDB,
  updateAppointmentNotesInDB,
  deleteAppointmentFromDB,
  getAppointmentsByStatus,
  getUpcomingAppointments,
  getAppointmentStats,
  testAppointmentDBConnection,
  getAppointmentsBypass,
  ensureAdminAccess,
  type Appointment,
  type AppointmentInput,
} from './appointments';
