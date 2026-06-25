alter table public.submissions enable row level security;

drop policy if exists "Published submissions are publicly readable" on public.submissions;
create policy "Published submissions are publicly readable"
on public.submissions
for select
using (status = 'Published');

notify pgrst, 'reload schema';
