

const APPOINTMENTS_KEY = "appointments";

export const getAppointments = () => {
  try {
    const appointments = localStorage.getItem(APPOINTMENTS_KEY);
    return appointments ? JSON.parse(appointments) : [];
  } catch (error) {
    console.error("Error getting appointments from localStorage:", error);
    return [];
  }
};

// Add petSpecies to the appointment type
export type Appointment = {
  id: string;
  petName: string;
  petAge?: string;
  petGender?: string;
  petSpecies: string; // Can include "other: specific type" format
  ownerName: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time?: string;
  timeSlot?: string;
  diagnosis?: string;
  additionalInfo?: string;
  status: string;
  createdAt: number;
  isUrgent?: boolean;
  isFirstTime?: boolean;
  owner_id?: string; // Added to track owner for database compatibility
};

type AppointmentInput = Omit<Appointment, "id" | "status" | "createdAt">;

export const updateAppointmentStatus = (id: string, status: string): boolean => {
  const appointments = getAppointments();
  const appointmentIndex = appointments.findIndex((apt) => apt.id === id);

  if (appointmentIndex === -1) {
    console.error(`Appointment with id ${id} not found`);
    return false;
  }

  appointments[appointmentIndex] = {
    ...appointments[appointmentIndex],
    status: status,
  };

  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
  return true;
};

export const saveAppointment = async (appointment: AppointmentInput & { owner_id?: string }): Promise<Appointment> => {
  const appointments = getAppointments();
  
  const newAppointment: Appointment = {
    id: `apt-${Date.now()}`,
    ...appointment,
    status: "Pending",
    createdAt: Date.now(),
    owner_id: appointment.owner_id,
  };
  
  appointments.push(newAppointment);
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
  
  return newAppointment;
};

export const deleteAppointment = (id: string): boolean => {
  const appointments = getAppointments();
  const updatedAppointments = appointments.filter((apt) => apt.id !== id);
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updatedAppointments));
  return true; // Return true to indicate successful deletion
};

// Add the missing seedInitialData function
export const seedInitialData = (): void => {
  // Only seed if there are no appointments
  const existingAppointments = getAppointments();
  if (existingAppointments.length > 0) {
    return;
  }

  // Sample appointment data
  const sampleAppointments: Appointment[] = [
    {
      id: "apt-1680678400000",
      petName: "Max",
      petAge: "3",
      petGender: "male",
      petSpecies: "dog",
      ownerName: "John Doe",
      email: "john.doe@example.com",
      phone: "555-123-4567",
      service: "checkup",
      date: "2025-06-01",
      time: "10:00 AM",
      status: "Pending",
      createdAt: 1680678400000,
      isFirstTime: true
    },
    {
      id: "apt-1680764800000",
      petName: "Luna",
      petAge: "2",
      petGender: "female",
      petSpecies: "cat",
      ownerName: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "555-987-6543",
      service: "vaccination",
      date: "2025-06-02",
      time: "2:30 PM",
      status: "Confirmed",
      createdAt: 1680764800000,
      isUrgent: false
    },
    {
      id: "apt-1680851200000",
      petName: "Rocky",
      petAge: "5",
      petGender: "male",
      petSpecies: "dog",
      ownerName: "Michael Johnson",
      email: "michael.j@example.com",
      phone: "555-456-7890",
      service: "grooming",
      date: "2025-05-28",
      time: "11:15 AM",
      additionalInfo: "Allergic to certain shampoos",
      status: "Completed",
      createdAt: 1680851200000
    },
    {
      id: "apt-1680937600000",
      petName: "Bella",
      petAge: "1",
      petGender: "female",
      petSpecies: "dog",
      ownerName: "Emily Williams",
      email: "emily.w@example.com",
      phone: "555-789-0123",
      service: "deworming",
      date: "2025-05-30",
      time: "3:45 PM",
      status: "Cancelled",
      createdAt: 1680937600000,
      isUrgent: true
    }
  ];

  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(sampleAppointments));
};

