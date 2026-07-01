-- 1. Create the secure user_roles table
create table if not exists public.user_roles (
  user_id uuid references auth.users(id) on delete cascade primary key,
  role text not null default 'researcher' check (role in ('admin', 'editor', 'peer_reviewer', 'researcher'))
);

-- Enable RLS on user_roles
alter table public.user_roles enable row level security;

-- Only users can read their own role, admins can read all
drop policy if exists "Users can view their own role" on public.user_roles;
create policy "Users can view their own role"
  on public.user_roles for select
  using ( auth.uid() = user_id );

-- 2. Migrate existing users' roles from metadata into user_roles
insert into public.user_roles (user_id, role)
select id, coalesce(raw_user_meta_data->>'account_type', 'researcher')
from auth.users
on conflict (user_id) do update 
set role = excluded.role;

-- 3. Create a helper function to get the current user's role securely
create or replace function public.get_my_role()
returns text
language sql
security definer
set search_path = public
as $$
  select role from public.user_roles where user_id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists(select 1 from public.user_roles where user_id = auth.uid() and role = 'admin');
$$;

create or replace function public.is_admin_or_editor()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists(select 1 from public.user_roles where user_id = auth.uid() and role in ('admin', 'editor'));
$$;

-- Admins can view/update all roles
drop policy if exists "Admins can manage roles" on public.user_roles;
create policy "Admins can manage roles"
  on public.user_roles for all
  using ( public.is_admin() );

-- 4. Create trigger to auto-insert role on signup
create or replace function public.handle_new_user_role()
returns trigger as $$
begin
  insert into public.user_roles (user_id, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'account_type', 'researcher'))
  on conflict (user_id) do update set role = excluded.role;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created_role on auth.users;
create trigger on_auth_user_created_role
  after insert on auth.users
  for each row execute procedure public.handle_new_user_role();


-- 5. RE-CREATE VULNERABLE POLICIES ON OTHER TABLES
-- (The following policies overwrite the old user_metadata-based ones)

-- For journal_settings
drop policy if exists "Editors can insert journal settings" on public.journal_settings;
create policy "Editors can insert journal settings"
  on public.journal_settings for insert
  with check ( public.is_admin_or_editor() );

drop policy if exists "Editors can update journal settings" on public.journal_settings;
create policy "Editors can update journal settings"
  on public.journal_settings for update
  using ( public.is_admin_or_editor() )
  with check ( public.is_admin_or_editor() );

-- For submissions
drop policy if exists "Admins can view all submissions" on public.submissions;
create policy "Admins can view all submissions"
  on public.submissions for select
  using ( public.is_admin_or_editor() );

drop policy if exists "Admins can update all submissions" on public.submissions;
create policy "Admins can update all submissions"
  on public.submissions for update
  using ( public.is_admin_or_editor() )
  with check ( public.is_admin_or_editor() );

-- For reviewers
drop policy if exists "Admins can insert reviewers" on public.reviewers;
create policy "Admins can insert reviewers"
  on public.reviewers for insert
  with check ( public.is_admin() );

notify pgrst, 'reload schema';
