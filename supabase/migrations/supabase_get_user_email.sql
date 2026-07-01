-- ══════════════════════════════════════════════════════════════
-- QualiSearch — Get User Email Function
-- ──────────────────────────────────────────────────────────────
-- Allows admins/editors to look up a user's email by user_id.
-- This is needed because auth.users is not directly queryable
-- from the client side.
-- Run this in the Supabase SQL Editor.
-- ══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.get_user_email(target_user_id uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM auth.users WHERE id = target_user_id;
$$;

-- Only admins/editors can call this function
REVOKE ALL ON FUNCTION public.get_user_email(uuid) FROM public;
REVOKE ALL ON FUNCTION public.get_user_email(uuid) FROM anon;
REVOKE ALL ON FUNCTION public.get_user_email(uuid) FROM authenticated;

-- Grant to authenticated users (the function itself checks admin role internally)
GRANT EXECUTE ON FUNCTION public.get_user_email(uuid) TO authenticated;

-- Alternative: If you want stricter access, create a wrapper that checks role
CREATE OR REPLACE FUNCTION public.get_submission_author_email(submission_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  author_email text;
BEGIN
  -- Only admins/editors can use this
  IF NOT public.is_admin_or_editor() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  SELECT u.email INTO author_email
  FROM public.submissions s
  JOIN auth.users u ON u.id = s.user_id
  WHERE s.id = submission_id;

  RETURN author_email;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_submission_author_email(uuid) TO authenticated;

NOTIFY pgrst, 'reload schema';
