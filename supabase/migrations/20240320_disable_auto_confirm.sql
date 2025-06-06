-- Disable auto-confirmation for new users
ALTER TABLE auth.users
ALTER COLUMN email_confirmed_at DROP DEFAULT;

-- Ensure new users start with unconfirmed email
CREATE OR REPLACE FUNCTION auth.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Set email_confirmed_at to NULL for new users
  NEW.email_confirmed_at = NULL;
  -- Set email_confirmation_sent_at to current timestamp
  NEW.email_confirmation_sent_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auth.handle_new_user();

-- Add email verification policy
CREATE POLICY "Enable email verification for users"
    ON auth.users FOR UPDATE
    USING (true)
    WITH CHECK (
        -- Only allow updating email verification fields
        (OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at) OR
        (OLD.email_confirmation_token IS DISTINCT FROM NEW.email_confirmation_token) OR
        (OLD.email_confirmation_sent_at IS DISTINCT FROM NEW.email_confirmation_sent_at)
    );

-- Grant permissions for email verification
GRANT UPDATE (
    email_confirmed_at,
    email_confirmation_token,
    email_confirmation_sent_at
) ON auth.users TO authenticated;

-- Allow anonymous users to verify email
GRANT UPDATE (
    email_confirmed_at,
    email_confirmation_token,
    email_confirmation_sent_at
) ON auth.users TO anon; 