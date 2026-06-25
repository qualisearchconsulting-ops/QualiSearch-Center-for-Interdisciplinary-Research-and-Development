alter table public.submissions
  add column if not exists cover_image_path text,
  add column if not exists landing_authors text,
  add column if not exists landing_summary text,
  add column if not exists landing_keywords text;

notify pgrst, 'reload schema';
