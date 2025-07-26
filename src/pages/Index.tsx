import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import {
  PiggyBank,
  TrendingUp,
  Shield,
  Smartphone,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

const Index = () => {
  const { user } = useAuth()

  // Redirect to dashboard if user is already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-xl mr-3">
                <PiggyBank className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Finance Tracker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-3xl mb-8 shadow-finance">
            <PiggyBank className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Track Your Financial
            <span className="text-primary block">Journey</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A comprehensive personal finance PWA to track assets, debts, and family finances.
            Secure, offline-capable, and always in your pocket.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="min-w-[200px]">
                Start Tracking
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="min-w-[200px]">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Everything You Need</h2>
          <p className="text-lg text-muted-foreground">Complete financial tracking in one beautiful app</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="shadow-card">
            <CardHeader>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-success rounded-xl mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Asset Tracking</CardTitle>
              <CardDescription>
                Track stocks, real estate, FDs, mutual funds, and more with detailed metadata
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-xl mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>
                Your data is encrypted and stored securely. Complete privacy with row-level security
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-success rounded-xl mb-4">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <CardTitle>PWA Ready</CardTitle>
              <CardDescription>
                Install on any device. Works offline. Native app experience in your browser
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Features List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Comprehensive Financial Management
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-success mr-3 flex-shrink-0" />
                <span className="text-muted-foreground">Track multiple asset types: stocks, FDs, real estate, crypto</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-success mr-3 flex-shrink-0" />
                <span className="text-muted-foreground">Monitor debts and loans with payment tracking</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-success mr-3 flex-shrink-0" />
                <span className="text-muted-foreground">Family financial management</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-success mr-3 flex-shrink-0" />
                <span className="text-muted-foreground">Real-time net worth calculation</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-success mr-3 flex-shrink-0" />
                <span className="text-muted-foreground">Installable PWA for all devices</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-primary rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
            <p className="text-white/90 mb-6">
              Join thousands of users tracking their financial journey with our secure platform.
            </p>
            <Link to="/signup">
              <Button className="bg-white text-primary hover:bg-white/90">
                Create Your Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-primary rounded-lg mr-2">
                <PiggyBank className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-foreground">Finance Tracker</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Secure personal finance management for everyone
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
};

export default Index;
