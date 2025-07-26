import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useFinancialSummary } from '@/hooks/useSupabaseData'
import AddSampleData from '@/components/AddSampleData'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Plus, 
  PiggyBank,
  CreditCard,
  Users,
  Settings
} from 'lucide-react'

const Dashboard = () => {
  const { user, signOut } = useAuth()
  const { totalAssets, totalDebts, netWorth, assets, debts } = useFinancialSummary()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-xl mr-3">
                <PiggyBank className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Finance Tracker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Welcome, {user?.email}</span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Show sample data card if no data exists */}
        {totalAssets === 0 && totalDebts === 0 && <AddSampleData />}
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-success text-white shadow-finance">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Total Assets</CardTitle>
              <TrendingUp className="h-4 w-4 text-white/90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalAssets.toLocaleString()}</div>
              <p className="text-xs text-white/70">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-finance">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Total Debts</CardTitle>
              <TrendingDown className="h-4 w-4 text-white/90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalDebts.toLocaleString()}</div>
              <p className="text-xs text-white/70">-5% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-primary text-white shadow-finance">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Net Worth</CardTitle>
              <DollarSign className="h-4 w-4 text-white/90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${netWorth.toLocaleString()}</div>
              <p className="text-xs text-white/70">+18% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your financial portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-20 flex-col space-y-2">
                <Plus className="h-6 w-6" />
                <span>Add Asset</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <CreditCard className="h-6 w-6" />
                <span>Add Debt</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Users className="h-6 w-6" />
                <span>Family</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Settings className="h-6 w-6" />
                <span>Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Recent Assets</CardTitle>
              <CardDescription>Your latest asset additions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assets.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No assets added yet</p>
                    <Button variant="outline" className="mt-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Asset
                    </Button>
                  </div>
                ) : (
                  assets.slice(0, 3).map((asset) => (
                    <div key={asset.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div>
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{asset.type.replace('_', ' ')}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${asset.value.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{asset.currency}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Recent Debts</CardTitle>
              <CardDescription>Your current debt obligations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {debts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No debts recorded</p>
                    <Button variant="outline" className="mt-2">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Add Debt Information
                    </Button>
                  </div>
                ) : (
                  debts.slice(0, 3).map((debt) => (
                    <div key={debt.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div>
                        <p className="font-medium">{debt.lender}</p>
                        <p className="text-sm text-muted-foreground capitalize">{debt.type.replace('_', ' ')}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${debt.balance.toLocaleString()}</p>
                        <p className="text-sm text-destructive">
                          {debt.interest_rate ? `${debt.interest_rate}% APR` : 'No interest'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard