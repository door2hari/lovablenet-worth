-- Create all the tables first
CREATE TABLE public.users (
  id text PRIMARY KEY,
  email text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.assets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  type text NOT NULL CHECK (type IN ('home', 'fd', 'rd', 'stock', 'mutual_fund', 'property', 'foreign_stock', 'rsu', 'direct_investment', 'gold', 'crypto', 'cash', 'other')),
  subtype text,
  name text NOT NULL,
  value numeric NOT NULL,
  currency text DEFAULT 'USD',
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.debts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  type text NOT NULL CHECK (type IN ('personal', 'home_loan', 'credit_card', 'other')),
  lender text NOT NULL,
  principal numeric NOT NULL,
  interest_rate numeric,
  term_years integer,
  balance numeric NOT NULL,
  currency text DEFAULT 'USD',
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.family_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  name text NOT NULL,
  relation text NOT NULL,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.family_assets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  family_member_id uuid NOT NULL REFERENCES public.family_members(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('home', 'fd', 'rd', 'stock', 'mutual_fund', 'property', 'foreign_stock', 'rsu', 'direct_investment', 'gold', 'crypto', 'cash', 'other')),
  subtype text,
  name text NOT NULL,
  value numeric NOT NULL,
  currency text DEFAULT 'USD',
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.family_debts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  family_member_id uuid NOT NULL REFERENCES public.family_members(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('personal', 'home_loan', 'credit_card', 'other')),
  lender text NOT NULL,
  principal numeric NOT NULL,
  interest_rate numeric,
  term_years integer,
  balance numeric NOT NULL,
  currency text DEFAULT 'USD',
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_debts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid()::text = id);

-- Create RLS policies for assets table
CREATE POLICY "Users can view own assets" ON public.assets
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own assets" ON public.assets
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own assets" ON public.assets
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own assets" ON public.assets
  FOR DELETE USING (auth.uid()::text = user_id);

-- Create RLS policies for debts table
CREATE POLICY "Users can view own debts" ON public.debts
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own debts" ON public.debts
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own debts" ON public.debts
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own debts" ON public.debts
  FOR DELETE USING (auth.uid()::text = user_id);

-- Create RLS policies for family_members table
CREATE POLICY "Users can view own family members" ON public.family_members
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own family members" ON public.family_members
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own family members" ON public.family_members
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own family members" ON public.family_members
  FOR DELETE USING (auth.uid()::text = user_id);

-- Create RLS policies for family_assets table
CREATE POLICY "Users can view own family assets" ON public.family_assets
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own family assets" ON public.family_assets
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own family assets" ON public.family_assets
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own family assets" ON public.family_assets
  FOR DELETE USING (auth.uid()::text = user_id);

-- Create RLS policies for family_debts table
CREATE POLICY "Users can view own family debts" ON public.family_debts
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own family debts" ON public.family_debts
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own family debts" ON public.family_debts
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own family debts" ON public.family_debts
  FOR DELETE USING (auth.uid()::text = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON public.assets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_debts_updated_at BEFORE UPDATE ON public.debts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_family_members_updated_at BEFORE UPDATE ON public.family_members 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_family_assets_updated_at BEFORE UPDATE ON public.family_assets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_family_debts_updated_at BEFORE UPDATE ON public.family_debts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();