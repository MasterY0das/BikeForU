-- Enable password reset functionality
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow users to update their own password
CREATE POLICY "Users can update their own password"
ON auth.users
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Configure email templates for password reset
UPDATE auth.config
SET 
  email_template_reset_password = '{
    "subject": "Reset your BikeForU password",
    "html": "<h1>Reset your BikeForU password</h1><p>Click the link below to reset your password:</p><p><a href=\"{{ .ConfirmationURL }}\">Reset Password</a></p><p>If you did not request this password reset, you can safely ignore this email.</p>",
    "text": "Reset your BikeForU password\n\nClick the link below to reset your password:\n\n{{ .ConfirmationURL }}\n\nIf you did not request this password reset, you can safely ignore this email."
  }'
WHERE id = 1; 