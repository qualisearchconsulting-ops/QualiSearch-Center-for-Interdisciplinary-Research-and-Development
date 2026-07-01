-- ══════════════════════════════════════════════════════════════
-- QualiSearch — Publication Email Log Table
-- ──────────────────────────────────────────────────────────────
-- Tracks all publication certificate emails sent.
-- Run this in the Supabase SQL Editor.
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.publication_emails (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id uuid REFERENCES public.submissions(id) ON DELETE CASCADE,
  recipient_email text NOT NULL,
  recipient_name text NOT NULL,
  recipient_role text NOT NULL CHECK (recipient_role IN ('author', 'reviewer')),
  resend_id text,
  status text NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending')),
  error_message text,
  sent_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.publication_emails ENABLE ROW LEVEL SECURITY;

-- Only admins/editors can view email logs
DROP POLICY IF EXISTS "Admins can view email logs" ON public.publication_emails;
CREATE POLICY "Admins can view email logs"
  ON public.publication_emails FOR SELECT
  USING ( public.is_admin_or_editor() );

-- Only admins/editors can insert email logs
DROP POLICY IF EXISTS "Admins can insert email logs" ON public.publication_emails;
CREATE POLICY "Admins can insert email logs"
  ON public.publication_emails FOR INSERT
  WITH CHECK ( public.is_admin_or_editor() );

-- Add index for fast lookup by submission
CREATE INDEX IF NOT EXISTS idx_pub_emails_submission 
  ON public.publication_emails(submission_id);

NOTIFY pgrst, 'reload schema';
