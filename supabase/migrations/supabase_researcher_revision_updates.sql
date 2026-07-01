alter table public.submissions enable row level security;

drop policy if exists "Researchers can submit manuscript revisions" on public.submissions;
create policy "Researchers can submit manuscript revisions"
on public.submissions
for update
using (
  auth.uid() = user_id
  and status in ('Revisions Required', 'Revision Submitted', 'Under Review')
)
with check (
  auth.uid() = user_id
  and status = 'Revision Submitted'
);

notify pgrst, 'reload schema';
