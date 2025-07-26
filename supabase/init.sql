-- Personal Finance Tracker Database Schema
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create users table (extends auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create asset types enum
CREATE TYPE asset_type AS ENUM (
  'home', 'fd', 'rd', 'stock', 'mutual_fund', 'property', 
  'foreign_stock', 'rsu', 'direct_investment', 'gold', 
  'crypto', 'cash', 'other'
);

-- Create debt types enum
CREATE TYPE debt_type AS ENUM (
  'personal', 'home_loan', 'credit_card', 'other'
);

-- Assets table
CREATE TABLE public.assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type asset_type NOT NULL,
  subtype TEXT,
  name TEXT NOT NULL,
  value DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'USD' NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Debts table
CREATE TABLE public.debts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type debt_type NOT NULL,
  lender TEXT NOT NULL,
  principal DECIMAL(15,2) NOT NULL,
  interest_rate DECIMAL(5,2),
  term_years INTEGER,
  balance DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'USD' NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Family members table
CREATE TABLE public.family_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  relation TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Family assets table
CREATE TABLE public.family_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  family_member_id UUID REFERENCES public.family_members(id) ON DELETE CASCADE NOT NULL,
  type asset_type NOT NULL,
  subtype TEXT,
  name TEXT NOT NULL,
  value DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'USD' NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Family debts table
CREATE TABLE public.family_debts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  family_member_id UUID REFERENCES public.family_members(id) ON DELETE CASCADE NOT NULL,
  type debt_type NOT NULL,
  lender TEXT NOT NULL,
  principal DECIMAL(15,2) NOT NULL,
  interest_rate DECIMAL(5,2),
  term_years INTEGER,
  balance DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'USD' NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.users
  FOR ALL USING (auth.uid() = id);

-- Assets policies
CREATE POLICY "Users can manage own assets" ON public.assets
  FOR ALL USING (auth.uid() = user_id);

-- Debts policies  
CREATE POLICY "Users can manage own debts" ON public.debts
  FOR ALL USING (auth.uid() = user_id);

-- Family members policies
CREATE POLICY "Users can manage own family members" ON public.family_members
  FOR ALL USING (auth.uid() = user_id);

-- Family assets policies
CREATE POLICY "Users can manage own family assets" ON public.family_assets
  FOR ALL USING (auth.uid() = user_id);

-- Family debts policies
CREATE POLICY "Users can manage own family debts" ON public.family_debts
  FOR ALL USING (auth.uid() = user_id);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_debts ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
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

-- Sample data insertion function (optional - for testing)
CREATE OR REPLACE FUNCTION create_sample_data(user_uuid UUID)
RETURNS void AS $$
BEGIN
    -- Insert sample assets
    INSERT INTO public.assets (user_id, type, name, value, currency) VALUES
    (user_uuid, 'stock', 'Tesla Inc. (TSLA)', 15420.00, 'USD'),
    (user_uuid, 'fd', 'HDFC Fixed Deposit', 50000.00, 'USD'),
    (user_uuid, 'cash', 'Emergency Fund', 25000.00, 'USD'),
    (user_uuid, 'property', 'Primary Residence', 450000.00, 'USD');

    -- Insert sample debts
    INSERT INTO public.debts (user_id, type, lender, principal, balance, interest_rate, currency) VALUES
    (user_uuid, 'home_loan', 'Wells Fargo', 400000.00, 350000.00, 3.2, 'USD'),
    (user_uuid, 'credit_card', 'Chase Sapphire', 5000.00, 2500.00, 18.9, 'USD');
END;
$$ language 'plpgsql';