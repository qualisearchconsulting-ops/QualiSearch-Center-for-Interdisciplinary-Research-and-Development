alter table public.submissions
  add column if not exists cover_image_path text,
  add column if not exists landing_authors text,
  add column if not exists landing_summary text,
  add column if not exists landing_keywords text,
  add column if not exists landing_doi text,
  add column if not exists landing_details text,
  add column if not exists landing_funding text,
  add column if not exists landing_references text,
  add column if not exists published_file_path text,
  add column if not exists manuscript_received_date date,
  add column if not exists manuscript_revised_date date,
  add column if not exists manuscript_accepted_date date,
  add column if not exists published_date date;

notify pgrst, 'reload schema';
