
export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  phone?: string;
  address?: string;
};

export type Pet = {
  id: string;
  name: string;
  type: "dog" | "cat" | "bird" | "rabbit" | "hamster" | "fish" | "reptile" | "other";
  species: string;
  breed?: string;
  weight?: string;
  birthDate: string;
  gender: "male" | "female";
  ownerId: string;
};

export type Appointment = {
  id: string;
  petName: string;
  service: string;
  date: string;
  timeSlot: string;
  ownerName: string;
  ownerId: string;
  status?: string;
};
