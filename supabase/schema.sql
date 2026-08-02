-- AUSECOURS — Supabase schema
-- Run in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists "uuid-ossp";

-- ---------- Profiles (extends Supabase auth.users) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  preferred_lang text default 'tn' check (preferred_lang in ('tn','ar','fr','en')),
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- ---------- Facilities (hospitals, clinics, pharmacies, civil protection) ----------
create table if not exists public.facilities (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type text not null check (type in ('hospital','clinic','pharmacy','civil_protection','ambulance')),
  city text not null,
  lat double precision not null,
  lng double precision not null,
  phone text,
  created_at timestamptz default now()
);
alter table public.facilities enable row level security;
create policy "Facilities are publicly readable" on public.facilities for select using (true);

-- ---------- CPR videos ----------
create table if not exists public.cpr_videos (
  id uuid primary key default uuid_generate_v4(),
  category text not null,
  title text not null,
  description text,
  duration_label text,
  embed_url text,
  created_at timestamptz default now()
);
alter table public.cpr_videos enable row level security;
create policy "CPR videos are publicly readable" on public.cpr_videos for select using (true);

-- ---------- Per-user CPR progress / favorites ----------
create table if not exists public.cpr_progress (
  user_id uuid references auth.users(id) on delete cascade,
  video_id uuid references public.cpr_videos(id) on delete cascade,
  favorited boolean default false,
  watched_seconds int default 0,
  completed boolean default false,
  updated_at timestamptz default now(),
  primary key (user_id, video_id)
);
alter table public.cpr_progress enable row level security;
create policy "Users manage their own progress" on public.cpr_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- Chat history (optional — for logged-in users who opt in) ----------
create table if not exists public.chat_messages (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  lang text,
  created_at timestamptz default now()
);
alter table public.chat_messages enable row level security;
create policy "Users manage their own chat history" on public.chat_messages
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- Daily awareness tips ----------
create table if not exists public.awareness_tips (
  id uuid primary key default uuid_generate_v4(),
  day_of_year int not null,
  lang text not null check (lang in ('tn','ar','fr','en')),
  tag text,
  title text,
  body text,
  myth text,
  fact text
);
alter table public.awareness_tips enable row level security;
create policy "Awareness tips are publicly readable" on public.awareness_tips for select using (true);

-- Seed facilities with the same sample data used in src/lib/facilities.ts
insert into public.facilities (name, type, city, lat, lng, phone) values
  ('Hôpital Charles Nicolle', 'hospital', 'Tunis', 36.8065, 10.1815, '71578548'),
  ('Hôpital La Rabta', 'hospital', 'Tunis', 36.8095, 10.1425, '71578000'),
  ('Clinique El Manar', 'clinic', 'Tunis', 36.8393, 10.1518, '71885000'),
  ('Pharmacie Centrale', 'pharmacy', 'Tunis', 36.7990, 10.1810, '71330033'),
  ('Protection Civile Tunis', 'civil_protection', 'Tunis', 36.8000, 10.1800, '198'),
  ('Hôpital Sahloul', 'hospital', 'Sousse', 35.8433, 10.5980, '73369411'),
  ('Hôpital Habib Bourguiba', 'hospital', 'Sfax', 34.7400, 10.7500, '74405600')
on conflict do nothing;
