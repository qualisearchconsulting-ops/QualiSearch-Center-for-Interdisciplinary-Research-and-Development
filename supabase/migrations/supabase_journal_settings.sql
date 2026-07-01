create table if not exists public.journal_settings (
  code text primary key,
  status text not null default 'forthcoming',
  launched_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.journal_settings enable row level security;

insert into public.journal_settings (code, status, launched_at)
values
  ('QJERP', 'active', now()),
  ('QJHS', 'forthcoming', null),
  ('QJBG', 'forthcoming', null),
  ('QJTI', 'forthcoming', null),
  ('QJPLC', 'forthcoming', null)
on conflict (code) do nothing;

drop policy if exists "Journal settings are publicly readable" on public.journal_settings;
create policy "Journal settings are publicly readable"
on public.journal_settings
for select
using (true);

drop policy if exists "Editors can insert journal settings" on public.journal_settings;
create policy "Editors can insert journal settings"
on public.journal_settings
for insert
with check (
  auth.jwt() -> 'user_metadata' ->> 'account_type' in ('admin', 'editor')
);

drop policy if exists "Editors can update journal settings" on public.journal_settings;
create policy "Editors can update journal settings"
on public.journal_settings
for update
using (
  auth.jwt() -> 'user_metadata' ->> 'account_type' in ('admin', 'editor')
)
with check (
  auth.jwt() -> 'user_metadata' ->> 'account_type' in ('admin', 'editor')
);

notify pgrst, 'reload schema';
