import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Database, 
  Key, 
  Globe, 
  CheckCircle, 
  ExternalLink,
  Code2,
  Settings
} from 'lucide-react'

const SetupGuide = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-xl mr-3">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Setup Required</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert className="mb-8 border-warning bg-warning/10">
          <Database className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Supabase Configuration Missing:</strong> To use this Personal Finance Tracker, you need to set up Supabase for authentication and data storage.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6">
          {/* Step 1: Create Supabase Project */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-primary rounded-lg mr-3">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Create a Supabase Project
                  </CardTitle>
                  <CardDescription>Set up your free Supabase account and project</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  1. Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">supabase.com</a> and create a free account
                </p>
                <p className="text-sm text-muted-foreground">
                  2. Click "New Project" and choose your organization
                </p>
                <p className="text-sm text-muted-foreground">
                  3. Enter a project name (e.g., "personal-finance-tracker")
                </p>
                <p className="text-sm text-muted-foreground">
                  4. Set a secure database password and choose a region
                </p>
              </div>
              <Button asChild className="w-full sm:w-auto">
                <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">
                  Create Supabase Project
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Step 2: Get API Keys */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-success rounded-lg mr-3">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <CardTitle className="flex items-center">
                    <Key className="h-5 w-5 mr-2" />
                    Get Your API Keys
                  </CardTitle>
                  <CardDescription>Copy your project URL and anon key from Supabase</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  1. In your Supabase dashboard, go to <strong>Settings → API</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  2. Copy your <strong>Project URL</strong> and <strong>anon/public key</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  3. Create a <code className="bg-secondary px-1 py-0.5 rounded text-xs">.env</code> file in your project root:
                </p>
              </div>
              <div className="bg-secondary p-4 rounded-lg">
                <code className="text-sm block">
                  VITE_SUPABASE_URL=your_project_url<br/>
                  VITE_SUPABASE_ANON_KEY=your_anon_key
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Run Database Migration */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-accent rounded-lg mr-3">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Set Up Database
                  </CardTitle>
                  <CardDescription>Run the SQL migration to create required tables</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  1. In Supabase, go to <strong>SQL Editor</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  2. Copy and run the SQL from <code className="bg-secondary px-1 py-0.5 rounded text-xs">supabase/init.sql</code>
                </p>
                <p className="text-sm text-muted-foreground">
                  3. This creates tables for assets, debts, family members, and security policies
                </p>
              </div>
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Tip:</strong> The SQL file includes Row Level Security (RLS) policies to keep your data private and secure.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Step 4: Restart App */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg mr-3">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                <div>
                  <CardTitle className="flex items-center">
                    <Code2 className="h-5 w-5 mr-2" />
                    Restart the Application
                  </CardTitle>
                  <CardDescription>Reload the app to connect to your Supabase project</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  1. Save your <code className="bg-secondary px-1 py-0.5 rounded text-xs">.env</code> file
                </p>
                <p className="text-sm text-muted-foreground">
                  2. Restart your development server: <code className="bg-secondary px-1 py-0.5 rounded text-xs">npm run dev</code>
                </p>
                <p className="text-sm text-muted-foreground">
                  3. Refresh this page - you should see the login/signup options
                </p>
              </div>
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full sm:w-auto"
                variant="gradient"
              >
                Refresh App
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="mt-8 shadow-card">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>Resources and documentation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" asChild>
                <a href="https://supabase.com/docs" target="_blank" rel="noopener noreferrer">
                  Supabase Documentation
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://supabase.com/docs/guides/auth" target="_blank" rel="noopener noreferrer">
                  Authentication Guide
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SetupGuide