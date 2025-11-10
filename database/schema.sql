-- Enable RLS (Row Level Security)
alter table if exists public.profiles enable row level security;
alter table if exists public.pets enable row level security;
alter table if exists public.appointments enable row level security;
alter table if exists public.services enable row level security;
alter table if exists public.feedback enable row level security;
alter table if exists public.medical_records enable row level security;

-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  phone_number text,
  role text check (role in ('user', 'admin', 'vet')) default 'user',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create pets table
create table if not exists public.pets (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  species text not null,
  birth_date date,
  breed text,
  age text,
  gender text,
  weight numeric,
  medical_history text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create services table
create table if not exists public.services (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price numeric not null,
  duration integer not null, -- duration in minutes
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create appointments table
create table if not exists public.appointments (
  id uuid default uuid_generate_v4() primary key,
  pet_id uuid references public.pets(id) on delete cascade,
  owner_id uuid references public.profiles(id) on delete cascade,
  service_type uuid references public.services(id) on delete restrict,
  appointment_date date not null,
  appointment_time time not null,
  status text check (status in ('pending', 'confirmed', 'completed', 'cancelled')) default 'pending',
  notes text,
  vet_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create feedback table
create table if not exists public.feedback (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  appointment_id uuid references public.appointments(id) on delete cascade,
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create medical records table
create table if not exists public.medical_records (
  id uuid default uuid_generate_v4() primary key,
  pet_id uuid references public.pets(id) on delete cascade,
  appointment_id uuid references public.appointments(id) on delete cascade,
  diagnosis text not null,
  treatment text not null,
  prescription text,
  notes text,
  vet_id uuid references public.profiles(id) on delete restrict,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create RLS policies
-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Pets policies
create policy "Users can view their own pets"
  on public.pets for select
  using (auth.uid() = owner_id);

create policy "Users can create their own pets"
  on public.pets for insert
  with check (auth.uid() = owner_id);

create policy "Users can update their own pets"
  on public.pets for update
  using (auth.uid() = owner_id);

create policy "Users can delete their own pets"
  on public.pets for delete
  using (auth.uid() = owner_id);

-- Appointments policies
create policy "Users can view their own appointments"
  on public.appointments for select
  using (auth.uid() = owner_id);

create policy "Users can create their own appointments"
  on public.appointments for insert
  with check (auth.uid() = owner_id);

create policy "Users can update their own appointments"
  on public.appointments for update
  using (auth.uid() = owner_id);

-- Feedback policies
create policy "Users can view their own feedback"
  on public.feedback for select
  using (auth.uid() = user_id);

create policy "Users can create their own feedback"
  on public.feedback for insert
  with check (auth.uid() = user_id);

-- Medical records policies (only vets can create/update, owners can view)
create policy "Users can view their pets' medical records"
  on public.medical_records for select
  using (
    exists (
      select 1 from public.pets
      where pets.id = medical_records.pet_id
      and pets.owner_id = auth.uid()
    )
  );