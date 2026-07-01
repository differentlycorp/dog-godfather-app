-- Paws & Godparents Database Schema
-- Run this in your Supabase Project SQL Editor (SQL Editor -> New Query)

-- 1. Create the Dogs table
CREATE TABLE IF NOT EXISTS dogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    breed TEXT NOT NULL,
    age TEXT NOT NULL,
    gender TEXT CHECK (gender IN ('male', 'female')) NOT NULL,
    status TEXT CHECK (status IN ('needs_sponsor', 'partially_sponsored', 'fully_sponsored')) DEFAULT 'needs_sponsor' NOT NULL,
    target_monthly_sponsorship INTEGER NOT NULL,
    current_monthly_sponsorship INTEGER DEFAULT 0 NOT NULL,
    main_image_url TEXT NOT NULL,
    medical_needs TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the Sponsorships table (tracks godfather requests)
CREATE TABLE IF NOT EXISTS sponsorships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
    sponsor_name TEXT NOT NULL,
    sponsor_email TEXT NOT NULL,
    monthly_amount INTEGER NOT NULL,
    status TEXT CHECK (status IN ('pending', 'active', 'cancelled')) DEFAULT 'pending' NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create the Updates table (tracks medical or daily recovery updates)
CREATE TABLE IF NOT EXISTS updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS) on all tables
ALTER TABLE dogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE updates ENABLE ROW LEVEL SECURITY;

-- 5. Define Security Policies

-- Dogs Policies
CREATE POLICY "Allow public read access to dogs" ON dogs 
    FOR SELECT USING (true);

CREATE POLICY "Allow admin write access to dogs" ON dogs 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Sponsorships Policies
CREATE POLICY "Allow public inserts to sponsorships" ON sponsorships 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin read/write access to sponsorships" ON sponsorships 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Updates Policies
CREATE POLICY "Allow public read access to updates" ON updates 
    FOR SELECT USING (true);

CREATE POLICY "Allow admin write access to updates" ON updates 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
