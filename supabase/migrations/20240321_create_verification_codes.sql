-- Create verification_codes table for onboarding
CREATE TABLE IF NOT EXISTS verification_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for verification_codes
CREATE POLICY "Anyone can view verification codes" ON verification_codes
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert verification codes" ON verification_codes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update verification codes" ON verification_codes
  FOR UPDATE USING (true);

-- Create unique constraint to ensure one code per email
ALTER TABLE verification_codes ADD CONSTRAINT unique_email_code UNIQUE (email);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON verification_codes(email);
CREATE INDEX IF NOT EXISTS idx_verification_codes_code ON verification_codes(code);
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires_at ON verification_codes(expires_at); 