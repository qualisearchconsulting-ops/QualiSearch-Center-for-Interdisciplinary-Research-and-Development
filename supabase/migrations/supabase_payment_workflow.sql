-- Add payment proof column to the submissions table
ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS payment_proof_path text;

-- Create an RLS policy so researchers can update their own submissions with the payment proof
-- (We already have an update policy for researchers in previous scripts, but just in case)
DROP POLICY IF EXISTS "Researchers can update own submissions" ON public.submissions;
CREATE POLICY "Researchers can update own submissions"
  ON public.submissions FOR UPDATE
  USING ( auth.uid() = user_id );

-- Create a storage bucket for payments if it doesn't exist yet
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payments', 'payments', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for 'payments' bucket
DROP POLICY IF EXISTS "Users can upload payments" ON storage.objects;
CREATE POLICY "Users can upload payments"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'payments' AND auth.uid()::text = (storage.foldername(name))[1] );

DROP POLICY IF EXISTS "Admins can view all payments" ON storage.objects;
CREATE POLICY "Admins can view all payments"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'payments' AND public.is_admin() );

DROP POLICY IF EXISTS "Users can view own payments" ON storage.objects;
CREATE POLICY "Users can view own payments"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'payments' AND auth.uid()::text = (storage.foldername(name))[1] );
