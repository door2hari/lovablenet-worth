# Personal Finance Tracker PWA

A comprehensive personal finance Progressive Web App (PWA) built with React, Vite, TypeScript, Tailwind CSS, and Supabase. Track your assets, debts, and family finances with a beautiful, secure, and offline-capable interface.

## 🌟 Features

- **📊 Comprehensive Asset Tracking**: Stocks, FDs, RDs, Real Estate, Crypto, and more
- **💳 Debt Management**: Track loans, credit cards, and payment schedules
- **👨‍👩‍👧‍👦 Family Finance**: Manage finances for family members
- **🔐 Secure Authentication**: Email/password and OAuth with Supabase
- **📱 PWA Ready**: Install on any device, works offline
- **🎨 Beautiful UI**: Modern design with dark/light mode support
- **📈 Real-time Calculations**: Live net worth and portfolio updates
- **📱 Mobile Optimized**: Responsive design with touch-friendly interface

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- A Supabase account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd lovablenet-worth
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Update `src/integrations/supabase/client.ts` with your credentials

4. **Set up the database**
   - In your Supabase dashboard, go to the SQL Editor
   - Run the SQL migration script (see Database Setup section below)

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Visit your app**
   Open [http://localhost:8080](http://localhost:8080) in your browser

## 🌐 GitHub Pages Deployment

### Step 1: Update Repository Settings

1. **Update package.json homepage**
   ```bash
   # Replace 'yourusername' with your actual GitHub username
   # The repository name should match your actual repository name
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to Settings > Pages
   - Set Source to "Deploy from a branch"
   - Select "gh-pages" branch
   - Click Save

### Step 2: Configure Supabase for Production

1. **Update Supabase Redirect URLs**
   - Go to your Supabase dashboard
   - Navigate to Authentication > Settings
   - Add your GitHub Pages URL to Site URL:
     ```
     https://yourusername.github.io/lovablenet-worth
     ```
   - Add to Redirect URLs:
     ```
     https://yourusername.github.io/lovablenet-worth/**
     ```

### Step 3: Deploy

1. **Build and deploy**
   ```bash
   npm run deploy
   ```

2. **Verify deployment**
   - Wait 2-3 minutes for GitHub Pages to build
   - Visit your deployed site
   - Test authentication and functionality

### Step 4: Custom Domain (Optional)

If you want to use a custom domain:

1. **Add custom domain in GitHub Pages settings**
2. **Update package.json homepage**
3. **Update Supabase redirect URLs**
4. **Redeploy**

## 📱 Mobile Usage

### Local Development on Mobile

1. **Find your local IP address**
   ```bash
   # On Windows
   ipconfig
   
   # On Mac/Linux
   ifconfig
   ```

2. **Start development server with host binding**
   ```bash
   npm run dev
   ```

3. **Access on mobile**
   - Ensure your mobile device is on the same WiFi network
   - Open browser and navigate to: `http://YOUR_LOCAL_IP:8080`
   - Example: `http://192.168.1.100:8080`

### PWA Installation

1. **On Android (Chrome)**
   - Visit the deployed site
   - Tap the menu (⋮) > "Add to Home screen"
   - Follow the prompts

2. **On iOS (Safari)**
   - Visit the deployed site
   - Tap the share button (□↑)
   - Select "Add to Home Screen"
   - Follow the prompts

3. **On Desktop (Chrome)**
   - Visit the deployed site
   - Look for the install icon in the address bar
   - Click to install

### Mobile Features

- **Touch-friendly interface** with proper button sizes
- **Responsive navigation** with mobile menu
- **Offline support** for viewing cached data
- **App-like experience** when installed
- **Orientation support** for portrait and landscape

## 🗄️ Database Setup

Run this SQL in your Supabase SQL Editor to set up the required tables:

```sql
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
```

## 🔐 Authentication Setup

1. **Enable Authentication in Supabase**
   - Go to Authentication > Settings in your Supabase dashboard
   - Enable email authentication
   - Optionally enable OAuth providers (Google, GitHub, etc.)

2. **Configure OAuth (Optional)**
   - Add your site URL to the allowed redirect URLs
   - For local development: `http://localhost:8080`
   - For production: `https://yourusername.github.io/lovablenet-worth`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages
- `npm run lint` - Run ESLint

## 📱 PWA Features

This app is a Progressive Web App with:

- **Offline Support**: Works without internet connection
- **Install Prompt**: Can be installed on desktop and mobile
- **App-like Experience**: Full-screen, native feel
- **Background Sync**: Data syncs when connection is restored
- **Push Notifications**: (Future enhancement)
- **Service Worker**: Caches resources for offline use

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui with custom variants
- **State Management**: Zustand for auth state
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **PWA**: Vite PWA plugin
- **Mobile**: Responsive design with touch optimization

## 📋 Data Models

### Assets
Track various types of investments and holdings:
- Stocks (domestic & foreign)
- Fixed Deposits (FD) & Recurring Deposits (RD)
- Mutual Funds
- Real Estate/Property
- Cryptocurrency
- Gold & Precious Metals
- Cash & Savings
- RSUs & Direct Investments

### Debts
Monitor loans and liabilities:
- Personal Loans
- Home Mortgages
- Credit Cards
- Other Debts

### Family Management
- Add family members
- Track their assets and debts separately
- Consolidated family net worth view

## 🔧 Customization

### Adding New Asset Types
1. Update the `asset_type` enum in your database
2. Add the new type to `src/types/index.ts`
3. Update the type definitions in `src/types/database.ts`

### Theming
Customize colors and design in:
- `src/index.css` - CSS variables for colors and gradients
- `tailwind.config.ts` - Tailwind theme extensions

## 🚨 Troubleshooting

### Common Issues

1. **Build fails on GitHub Pages**
   - Check that all dependencies are in `package.json`
   - Ensure TypeScript compilation passes locally
   - Check GitHub Actions logs for specific errors

2. **Authentication not working on production**
   - Verify Supabase redirect URLs are correct
   - Check that environment variables are set
   - Ensure HTTPS is enabled

3. **Mobile app not installing**
   - Verify PWA manifest is valid
   - Check that service worker is registered
   - Ensure HTTPS is enabled (required for PWA)

4. **Local mobile access not working**
   - Check firewall settings
   - Ensure devices are on same network
   - Try using `0.0.0.0` instead of `::` in vite config

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙋‍♂️ Support

If you have questions or need help:
1. Check the existing issues
2. Create a new issue with detailed information
3. Provide steps to reproduce any bugs

---

Built with ❤️ using React, Supabase, and modern web technologies.