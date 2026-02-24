-- ============================================================
-- Curatura — Supabase Database Schema
-- Run this in your Supabase project: SQL Editor → New query
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Profiles ─────────────────────────────────────────────────
-- Mirrors auth.users. Automatically created on sign-up via trigger.
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url  text,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

-- Auto-create profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Artworks ─────────────────────────────────────────────────
create table if not exists artworks (
  id              text primary key,
  title           text not null,
  artist          text not null,
  year            integer not null,
  theme           text not null,
  story_line      text not null,
  color           text not null,  -- CSS gradient placeholder
  aspect_ratio    text not null check (aspect_ratio in ('portrait','landscape','square')),
  image_url       text,
  selection_count integer default 0 not null,
  created_at      timestamptz default now() not null
);

-- ── Frames ───────────────────────────────────────────────────
create table if not exists frames (
  id               uuid primary key default uuid_generate_v4(),
  title            text not null,
  is_template      boolean default false not null,
  created_by       uuid references profiles(id) on delete set null,
  original_frame_id uuid references frames(id) on delete set null,
  created_at       timestamptz default now() not null
);

-- ── Frame → Artwork mapping ───────────────────────────────────
create table if not exists frame_artworks (
  id         uuid primary key default uuid_generate_v4(),
  frame_id   uuid not null references frames(id) on delete cascade,
  artwork_id text not null references artworks(id) on delete cascade,
  position   integer not null,
  unique (frame_id, artwork_id)
);

-- ── Curations (walls) ────────────────────────────────────────
create table if not exists curations (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  curator_name text not null,
  user_id      uuid references profiles(id) on delete set null,
  is_template  boolean default false not null,
  is_public    boolean default false not null,
  created_at   timestamptz default now() not null
);

-- ── Curation → Frame mapping ─────────────────────────────────
create table if not exists curation_frames (
  id           uuid primary key default uuid_generate_v4(),
  curation_id  uuid not null references curations(id) on delete cascade,
  frame_id     uuid not null references frames(id) on delete cascade,
  position     integer not null,
  unique (curation_id, frame_id)
);

-- ── Interaction / Analytics log ──────────────────────────────
create table if not exists interaction_logs (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references profiles(id) on delete set null,
  event_type   text not null,  -- 'artwork_selected' | 'frame_remixed' | 'curation_saved' | 'curation_viewed'
  artwork_id   text references artworks(id) on delete set null,
  curation_id  uuid references curations(id) on delete set null,
  metadata     jsonb,
  created_at   timestamptz default now() not null
);

-- ── Row Level Security (RLS) ─────────────────────────────────
alter table profiles          enable row level security;
alter table artworks          enable row level security;
alter table frames            enable row level security;
alter table frame_artworks    enable row level security;
alter table curations         enable row level security;
alter table curation_frames   enable row level security;
alter table interaction_logs  enable row level security;

-- Profiles: users can read all, update only their own
create policy "Profiles are viewable by everyone"
  on profiles for select using (true);
create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);

-- Artworks: publicly readable, only admins insert (use Supabase dashboard)
create policy "Artworks are viewable by everyone"
  on artworks for select using (true);

-- Update artwork selection count (anyone, upsert via function)
create policy "Anyone can update selection_count"
  on artworks for update using (true) with check (true);

-- Frames: templates visible to all; user frames visible to owner
create policy "Template frames are viewable by everyone"
  on frames for select using (is_template = true or created_by = auth.uid());
create policy "Authenticated users can create frames"
  on frames for insert with check (auth.role() = 'authenticated');
create policy "Users can update their own frames"
  on frames for update using (created_by = auth.uid());

-- Frame artworks: follow frame visibility
create policy "Frame artworks viewable with frame"
  on frame_artworks for select using (true);
create policy "Authenticated users can insert frame artworks"
  on frame_artworks for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update frame artworks"
  on frame_artworks for update using (auth.role() = 'authenticated');
create policy "Authenticated users can delete frame artworks"
  on frame_artworks for delete using (auth.role() = 'authenticated');

-- Curations: templates and public curations visible to all
create policy "Public curations are viewable by everyone"
  on curations for select using (is_template = true or is_public = true or user_id = auth.uid());
create policy "Authenticated users can create curations"
  on curations for insert with check (auth.role() = 'authenticated');
create policy "Users can update their own curations"
  on curations for update using (user_id = auth.uid());
create policy "Users can delete their own curations"
  on curations for delete using (user_id = auth.uid());

-- Curation frames
create policy "Curation frames viewable with curation"
  on curation_frames for select using (true);
create policy "Authenticated users can manage curation frames"
  on curation_frames for all using (auth.role() = 'authenticated');

-- Interaction logs: users see their own; insert allowed for all (including anon)
create policy "Users can view their own logs"
  on interaction_logs for select using (user_id = auth.uid());
create policy "Anyone can insert interaction logs"
  on interaction_logs for insert with check (true);

-- ── Increment artwork selection count (safe concurrent updates) ──
create or replace function increment_artwork_selection(artwork_id_param text)
returns void as $$
  update artworks
  set selection_count = selection_count + 1
  where id = artwork_id_param;
$$ language sql security definer;

-- ── Seed: Initial 20 artworks ─────────────────────────────────
insert into artworks (id, title, artist, year, theme, story_line, color, aspect_ratio) values
  ('art-1',  'The Silent Hour',           'Elena Voss',        2019, 'solitude',   'In the quiet between breaths, the world reveals its hidden geometry.',         'linear-gradient(135deg, #2d1b4e 0%, #1a3a5c 100%)', 'portrait'),
  ('art-2',  'Meridian',                  'Tomás Reyes',       2021, 'journey',    'Every horizon is both an ending and an invitation to cross.',                   'linear-gradient(135deg, #c9a96e 0%, #8b5e3c 100%)', 'landscape'),
  ('art-3',  'Fracture Garden',           'Yuki Tanaka',       2020, 'growth',     'Through the cracks in certainty, wildflowers find their way.',                  'linear-gradient(135deg, #3a5c3a 0%, #1a2f1a 100%)', 'square'),
  ('art-4',  'Blue Archive',              'Sophie Mercier',    2018, 'memory',     'Memory is not a photograph — it is a watercolor left in the rain.',              'linear-gradient(135deg, #1a3a6c 0%, #0d1f3c 100%)', 'portrait'),
  ('art-5',  'Ember Field',               'Kofi Asante',       2022, 'passion',    'What burns brightest often begins as the smallest spark.',                      'linear-gradient(135deg, #8b3a1a 0%, #c45a2a 100%)', 'landscape'),
  ('art-6',  'Still Water',               'Linnéa Berg',       2020, 'peace',      'Stillness is not absence — it is the presence of everything at once.',          'linear-gradient(135deg, #4a6a7a 0%, #2a3a4a 100%)', 'square'),
  ('art-7',  'Nocturne VII',              'Marco Rossi',       2021, 'darkness',   'The night does not hide — it reveals what daylight obscures.',                  'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', 'portrait'),
  ('art-8',  'Tessellation',              'Aisha Patel',       2019, 'pattern',    'In repetition, the eye discovers difference.',                                  'linear-gradient(135deg, #5a4a3a 0%, #8a7a6a 100%)', 'landscape'),
  ('art-9',  'Woven Light',               'Clara Dubois',      2022, 'connection', 'Every thread of light connects two darknesses.',                                 'linear-gradient(135deg, #c9a96e 0%, #e8d5b0 100%)', 'portrait'),
  ('art-10', 'Drift',                     'Henrik Sørensen',   2020, 'change',     'To drift is not to be lost — it is to trust the current.',                      'linear-gradient(135deg, #6a8a9a 0%, #3a5a6a 100%)', 'square'),
  ('art-11', 'Threshold',                 'Mia Chen',          2021, 'transition', 'Every door holds two worlds, neither fully visible from the other.',             'linear-gradient(135deg, #4a3a5a 0%, #2a1a3a 100%)', 'landscape'),
  ('art-12', 'Cartography of Absence',    'Diego Fuentes',     2018, 'loss',       'What is missing draws the most precise map of what once was.',                  'linear-gradient(135deg, #3a3a3a 0%, #5a5a5a 100%)', 'portrait'),
  ('art-13', 'Verdant Echo',              'Nora Kim',          2022, 'nature',     'The forest remembers every season it has ever weathered.',                      'linear-gradient(135deg, #2a4a2a 0%, #4a7a4a 100%)', 'square'),
  ('art-14', 'Resonance',                 'Luca Ferretti',     2019, 'sound',      'Between two silences, a note discovers its true meaning.',                      'linear-gradient(135deg, #3a1a4a 0%, #6a3a7a 100%)', 'landscape'),
  ('art-15', 'Vessel',                    'Amara Osei',        2021, 'body',       'Every body is a temporary home for an infinite story.',                         'linear-gradient(135deg, #6a4a3a 0%, #8a6a5a 100%)', 'portrait'),
  ('art-16', 'White Geometry',            'Petra Novak',       2020, 'minimalism', 'Reduction is not simplicity — it is the courage to let go.',                    'linear-gradient(135deg, #8a8a8a 0%, #c0c0c0 100%)', 'square'),
  ('art-17', 'Golden Mean',               'James Okafor',      2018, 'balance',    'Harmony is not achieved — it is constantly negotiated.',                        'linear-gradient(135deg, #8b6914 0%, #c9a96e 100%)', 'landscape'),
  ('art-18', 'The Cartographer''s Dream', 'Sofia Andersen',    2022, 'exploration','Every map is a lie we tell ourselves to make the unknown navigable.',           'linear-gradient(135deg, #1a2a4a 0%, #2a4a6a 100%)', 'portrait'),
  ('art-19', 'Chromatic Study No. 4',     'Rafael Monteiro',   2021, 'color',      'Color does not describe emotion — it is emotion made visible.',                 'linear-gradient(135deg, #8b1a1a 0%, #1a1a8b 100%)', 'square'),
  ('art-20', 'Ephemera',                  'Ingrid Halvorsen',  2019, 'time',       'What vanishes most quickly leaves the deepest impression.',                     'linear-gradient(135deg, #4a3a2a 0%, #7a6a5a 100%)', 'landscape')
on conflict (id) do nothing;
