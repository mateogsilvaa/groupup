-- ==========================================================
-- GroupUp · Supabase Database Setup
-- Pega TODO esto en Supabase Dashboard → SQL Editor → New query → Run
-- ==========================================================

-- ── EXTENSIONES ──────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── TABLAS ───────────────────────────────────────────────

-- Perfiles (se crean automáticamente al registrarse con el trigger de abajo)
create table if not exists public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  full_name   text,
  username    text,
  avatar_url  text,
  email       text,
  created_at  timestamptz default now() not null
);
create unique index if not exists profiles_username_idx
  on public.profiles(lower(username)) where username is not null;

-- Grupos
create table if not exists public.groups (
  id          uuid default uuid_generate_v4() primary key,
  name        text not null,
  description text default '',
  invite_code text unique not null,
  created_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz default now() not null
);

-- Miembros de grupo
create table if not exists public.group_members (
  id        uuid default uuid_generate_v4() primary key,
  group_id  uuid references public.groups(id) on delete cascade not null,
  user_id   uuid references auth.users(id) on delete cascade not null,
  role      text not null default 'member' check (role in ('admin','member')),
  joined_at timestamptz default now() not null,
  constraint group_members_unique unique (group_id, user_id)
);

-- Tareas (kanban)
create table if not exists public.tasks (
  id          uuid default uuid_generate_v4() primary key,
  group_id    uuid references public.groups(id) on delete cascade not null,
  title       text not null,
  description text,
  status      text not null default 'todo' check (status in ('todo','in_progress','done')),
  priority    text default 'medium' check (priority in ('high','medium','low')),
  assigned_to uuid references auth.users(id) on delete set null,
  due_date    date,
  created_at  timestamptz default now() not null
);

-- Archivos (metadatos; el fichero real va en Storage)
create table if not exists public.files (
  id           uuid default uuid_generate_v4() primary key,
  group_id     uuid references public.groups(id) on delete cascade not null,
  uploaded_by  uuid references auth.users(id) on delete set null,
  name         text not null,
  url          text not null,
  size         bigint not null default 0,
  mime_type    text,
  storage_path text not null,
  created_at   timestamptz default now() not null
);
-- Ensure uploaded_by exists (handles existing tables from prior runs)
alter table public.files add column if not exists uploaded_by uuid references auth.users(id) on delete set null;

-- Mensajes de chat
create table if not exists public.messages (
  id         uuid default uuid_generate_v4() primary key,
  group_id   uuid references public.groups(id) on delete cascade not null,
  user_id    uuid references auth.users(id) on delete set null,
  content    text not null default '',
  image_url  text,
  reactions  jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null
);

-- Publicaciones del tablón
create table if not exists public.board_posts (
  id         uuid default uuid_generate_v4() primary key,
  group_id   uuid references public.groups(id) on delete cascade not null,
  user_id    uuid references auth.users(id) on delete set null,
  title      text not null,
  content    text not null,
  pinned     boolean default false,
  likes      uuid[] default '{}',
  created_at timestamptz default now() not null
);

-- Ideas (post-its arrastrables)
create table if not exists public.ideas (
  id         uuid default uuid_generate_v4() primary key,
  group_id   uuid references public.groups(id) on delete cascade not null,
  user_id    uuid references auth.users(id) on delete set null,
  content    text not null,
  color      text default '#fef08a',
  pos_x      float default 100,
  pos_y      float default 100,
  votes      uuid[] default '{}',
  created_at timestamptz default now() not null
);

-- ── TRIGGER: perfil automático al registrarse ─────────────

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, username)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    coalesce(new.raw_user_meta_data->>'username',  split_part(new.email,'@',1))
  )
  on conflict (id) do update
    set email     = excluded.email,
        full_name = coalesce(excluded.full_name, profiles.full_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── FUNCIONES HELPER PARA RLS ────────────────────────────

create or replace function public.is_group_member(gid uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.group_members
    where group_id = gid and user_id = auth.uid()
  );
$$;

create or replace function public.is_group_admin(gid uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.group_members
    where group_id = gid and user_id = auth.uid() and role = 'admin'
  );
$$;

-- ── ROW LEVEL SECURITY ───────────────────────────────────

alter table public.profiles     enable row level security;
alter table public.groups       enable row level security;
alter table public.group_members enable row level security;
alter table public.tasks        enable row level security;
alter table public.files        enable row level security;
alter table public.messages     enable row level security;
alter table public.board_posts  enable row level security;
alter table public.ideas        enable row level security;

-- PROFILES
drop policy if exists "profiles_select_all"  on public.profiles;
drop policy if exists "profiles_insert_own"  on public.profiles;
drop policy if exists "profiles_update_own"  on public.profiles;
create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_insert_own" on public.profiles for insert with check (id = auth.uid());
create policy "profiles_update_own" on public.profiles for update using (id = auth.uid());

-- GROUPS
drop policy if exists "groups_select_member" on public.groups;
drop policy if exists "groups_insert_auth"   on public.groups;
drop policy if exists "groups_update_admin"  on public.groups;
drop policy if exists "groups_delete_admin"  on public.groups;
create policy "groups_select_member" on public.groups for select using (public.is_group_member(id));
create policy "groups_insert_auth"   on public.groups for insert with check (auth.uid() is not null);
create policy "groups_update_admin"  on public.groups for update using (public.is_group_admin(id));
create policy "groups_delete_admin"  on public.groups for delete using (public.is_group_admin(id));

-- GROUP_MEMBERS
drop policy if exists "gm_select"       on public.group_members;
drop policy if exists "gm_insert"       on public.group_members;
drop policy if exists "gm_update_admin" on public.group_members;
drop policy if exists "gm_delete"       on public.group_members;
create policy "gm_select"       on public.group_members for select using (user_id = auth.uid() or public.is_group_member(group_id));
create policy "gm_insert"       on public.group_members for insert with check (auth.uid() is not null);
create policy "gm_update_admin" on public.group_members for update using (public.is_group_admin(group_id));
create policy "gm_delete"       on public.group_members for delete using (user_id = auth.uid() or public.is_group_admin(group_id));

-- TASKS
drop policy if exists "tasks_select" on public.tasks;
drop policy if exists "tasks_insert" on public.tasks;
drop policy if exists "tasks_update" on public.tasks;
drop policy if exists "tasks_delete" on public.tasks;
create policy "tasks_select" on public.tasks for select using (public.is_group_member(group_id));
create policy "tasks_insert" on public.tasks for insert with check (public.is_group_member(group_id));
create policy "tasks_update" on public.tasks for update using (public.is_group_member(group_id));
create policy "tasks_delete" on public.tasks for delete using (public.is_group_member(group_id));

-- FILES
drop policy if exists "files_select" on public.files;
drop policy if exists "files_insert" on public.files;
drop policy if exists "files_delete" on public.files;
create policy "files_select" on public.files for select using (public.is_group_member(group_id));
create policy "files_insert" on public.files for insert with check (public.is_group_member(group_id));
create policy "files_delete" on public.files for delete using (public.is_group_admin(group_id) or uploaded_by = auth.uid());

-- MESSAGES
drop policy if exists "messages_select" on public.messages;
drop policy if exists "messages_insert" on public.messages;
drop policy if exists "messages_update" on public.messages;
create policy "messages_select" on public.messages for select using (public.is_group_member(group_id));
create policy "messages_insert" on public.messages for insert with check (public.is_group_member(group_id));
create policy "messages_update" on public.messages for update using (user_id = auth.uid());

-- BOARD_POSTS
drop policy if exists "bp_select" on public.board_posts;
drop policy if exists "bp_insert" on public.board_posts;
drop policy if exists "bp_update" on public.board_posts;
drop policy if exists "bp_delete" on public.board_posts;
create policy "bp_select" on public.board_posts for select using (public.is_group_member(group_id));
create policy "bp_insert" on public.board_posts for insert with check (public.is_group_member(group_id));
create policy "bp_update" on public.board_posts for update using (user_id = auth.uid() or public.is_group_admin(group_id));
create policy "bp_delete" on public.board_posts for delete using (user_id = auth.uid() or public.is_group_admin(group_id));

-- IDEAS
drop policy if exists "ideas_select" on public.ideas;
drop policy if exists "ideas_insert" on public.ideas;
drop policy if exists "ideas_update" on public.ideas;
drop policy if exists "ideas_delete" on public.ideas;
create policy "ideas_select" on public.ideas for select using (public.is_group_member(group_id));
create policy "ideas_insert" on public.ideas for insert with check (public.is_group_member(group_id));
create policy "ideas_update" on public.ideas for update using (public.is_group_member(group_id));
create policy "ideas_delete" on public.ideas for delete using (user_id = auth.uid() or public.is_group_admin(group_id));

-- ── STORAGE ──────────────────────────────────────────────

-- Crea el bucket (público para poder descargar archivos con URL directa)
insert into storage.buckets (id, name, public)
values ('group-files', 'group-files', true)
on conflict (id) do update set public = true;

-- Limpia políticas antiguas si existen
drop policy if exists "storage_select_public" on storage.objects;
drop policy if exists "storage_insert_auth"   on storage.objects;
drop policy if exists "storage_delete_auth"   on storage.objects;

create policy "storage_select_public" on storage.objects
  for select using (bucket_id = 'group-files');

create policy "storage_insert_auth" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'group-files');

create policy "storage_delete_auth" on storage.objects
  for delete to authenticated
  using (bucket_id = 'group-files');

-- ── REALTIME ─────────────────────────────────────────────

-- Activa cambios en tiempo real para el chat y las tareas
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.tasks;
alter publication supabase_realtime add table public.board_posts;

-- ==========================================================
-- ✅ ¡Listo! La base de datos de GroupUp está configurada.
--
-- Ahora ve a: Supabase Dashboard → Authentication → Providers
-- y asegúrate de que Email está habilitado.
--
-- También ve a: Authentication → URL Configuration
-- y añade tu URL de producción en "Site URL":
--   https://mateogsilvaa.github.io/groupup
-- ==========================================================
