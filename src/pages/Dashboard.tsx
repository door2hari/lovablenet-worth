import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Header from '@/components/Header'

import { 
  PieChartComponent, 
  BarChartComponent, 
  LineChartComponent, 
  DonutChartComponent,
  StackedBarChartComponent,
  AreaChartComponent
} from '@/components/ui/charts'
import { useAssets, useDebts, useFamilyMembers, useFinancialSummary } from '@/hooks/useSupabaseData'
import { AssetForm } from '@/components/AssetForm'
import { DebtForm } from '@/components/DebtForm'

import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Plus, 
  BarChart3, 
  PieChart, 
  LineChart,
  Download,
  Target,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'

const Dashboard = () => {
  const [isAssetFormOpen, setIsAssetFormOpen] = useState(false)
  const [isDebtFormOpen, setIsDebtFormOpen] = useState(false)
  const navigate = useNavigate()


  const { data: assets = [], isLoading: assetsLoading } = useAssets()
  const { data: debts = [], isLoading: debtsLoading } = useDebts()
  const familyMembersResult = useFamilyMembers()
  const familyMembers = familyMembersResult.data || []
  const financialSummary = useFinancialSummary()
  const { toast } = useToast()

  const { totalAssets, totalDebts, netWorth, assetBreakdown, debtBreakdown } = financialSummary || {}

  const getAssetTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      cash: '#10B981',
      stock: '#3B82F6',
      mutual_fund: '#8B5CF6',
      property: '#F59E0B',
      home: '#EF4444',
      fd: '#06B6D4',
      rd: '#84CC16',
      foreign_stock: '#EC4899',
      rsu: '#F97316',
      direct_investment: '#6366F1',
      gold: '#FCD34D',
      crypto: '#7C3AED',
      other: '#6B7280'
    }
    return colors[type] || '#6B7280'
  }

  const getDebtTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      personal: '#EF4444',
      home_loan: '#F59E0B',
      credit_card: '#EC4899',
      other: '#6B7280'
    }
    return colors[type] || '#6B7280'
  }

  const generateMonthlyData = (assets: any[], debts: any[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return months.map((month, index) => {
      const monthAssets = assets.filter(asset => 
        new Date(asset.created_at).getMonth() === index
      )
      const monthDebts = debts.filter(debt => 
        new Date(debt.created_at).getMonth() === index
      )
      
      return {
        name: month,
        assets: monthAssets.reduce((sum, asset) => sum + asset.value, 0),
        debts: monthDebts.reduce((sum, debt) => sum + debt.balance, 0),
        netWorth: monthAssets.reduce((sum, asset) => sum + asset.value, 0) - 
                 monthDebts.reduce((sum, debt) => sum + debt.balance, 0)
      }
    })
  }

  // Use all assets and debts without filtering
  const filteredAssets = assets
  const filteredDebts = debts

  // Prepare chart data
  const assetChartData = Object.entries(assetBreakdown || {}).map(([type, value]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' '),
    value: value as number,
    color: getAssetTypeColor(type)
  }))

  const debtChartData = Object.entries(debtBreakdown || {}).map(([type, value]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' '),
    value: value as number,
    color: getDebtTypeColor(type)
  }))

  const monthlyData = generateMonthlyData(assets, debts)



  const getNetWorthStatus = () => {
    if (!netWorth) return { status: 'neutral', text: 'No data', icon: Activity }
    if (netWorth > 0) return { status: 'positive', text: 'Positive', icon: CheckCircle }
    return { status: 'negative', text: 'Negative', icon: AlertTriangle }
  }

  const netWorthStatus = getNetWorthStatus()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header 
        title="Financial Dashboard"
        showAddButtons={true}
        onAddAsset={() => setIsAssetFormOpen(true)}
        onAddDebt={() => setIsDebtFormOpen(true)}
      />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-8">


        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card className="card-hover bg-gradient-to-br from-green-500 to-green-600 text-white shadow-finance">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Total Assets</CardTitle>
              <TrendingUp className="h-4 w-4 text-white/90" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">₹{totalAssets?.toLocaleString() || '0'}</div>
              <p className="text-xs text-white/70">{assets.length} assets</p>
            </CardContent>
          </Card>

          <Card className="card-hover bg-gradient-to-br from-red-500 to-red-600 text-white shadow-finance">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Total Debts</CardTitle>
              <TrendingDown className="h-4 w-4 text-white/90" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">₹{totalDebts?.toLocaleString() || '0'}</div>
              <p className="text-xs text-white/70">{debts.length} debts</p>
            </CardContent>
          </Card>

          <Card className={`card-hover shadow-finance ${
            netWorthStatus.status === 'positive' 
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
              : netWorthStatus.status === 'negative'
              ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
              : 'bg-gradient-to-br from-gray-500 to-gray-600 text-white'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Net Worth</CardTitle>
              <netWorthStatus.icon className="h-4 w-4 text-white/90" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">₹{netWorth?.toLocaleString() || '0'}</div>
              <p className="text-xs text-white/70">{netWorthStatus.text}</p>
            </CardContent>
          </Card>

          <Card className="card-hover bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-finance">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Family Members</CardTitle>
              <Users className="h-4 w-4 text-white/90" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{familyMembers.length}</div>
              <p className="text-xs text-white/70">family members</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <Card className="p-4">
            <TabsList className="flex w-full overflow-x-auto no-scrollbar gap-2">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="assets" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Assets
              </TabsTrigger>
              <TabsTrigger value="debts" className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                Debts
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Trends
              </TabsTrigger>
            </TabsList>
          </Card>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <DonutChartComponent
                data={assetChartData}
                title="Asset Distribution"
                height={300}
                className="min-h-[300px]"
              />
              <DonutChartComponent
                data={debtChartData}
                title="Debt Distribution"
                height={300}
                className="min-h-[300px]"
              />
            </div>
            <StackedBarChartComponent
              data={monthlyData}
              keys={['assets', 'debts', 'netWorth']}
              title="Monthly Financial Overview"
              height={400}
            />
          </TabsContent>

          <TabsContent value="assets" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PieChartComponent
                data={assetChartData}
                title="Asset Types Breakdown"
                height={400}
              />
              <BarChartComponent
                data={assetChartData}
                title="Asset Values by Type"
                height={400}
              />
            </div>
          </TabsContent>

          <TabsContent value="debts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2 sm:mt-0">
              <PieChartComponent
                data={debtChartData}
                title="Debt Types Breakdown"
                height={400}
              />
              <BarChartComponent
                data={debtChartData}
                title="Debt Balances by Type"
                height={400}
              />
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <LineChartComponent
                data={monthlyData.map(item => ({ name: item.name, value: item.netWorth }))}
                title="Net Worth Trend"
                height={400}
              />
              <AreaChartComponent
                data={monthlyData.map(item => ({ name: item.name, value: item.assets }))}
                title="Assets Growth Trend"
                height={400}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Manage your financial portfolio efficiently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 button-glow"
                onClick={() => setIsAssetFormOpen(true)}
              >
                <Plus className="h-6 w-6" />
                <span className="text-sm">Add Asset</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 button-glow"
                onClick={() => setIsDebtFormOpen(true)}
              >
                <Plus className="h-6 w-6" />
                <span className="text-sm">Add Debt</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 button-glow"
                onClick={() => navigate('/assets')}
              >
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm">View Assets</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 button-glow"
                onClick={() => navigate('/debts')}
              >
                <TrendingDown className="h-6 w-6" />
                <span className="text-sm">View Debts</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 button-glow"
                onClick={() => navigate('/family')}
              >
                <Users className="h-6 w-6" />
                <span className="text-sm">Family</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest additions to your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...assets, ...debts]
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 5)
                .map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        'value' in item ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <p className="font-medium">
                          {'value' in item ? item.name : item.lender}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {'value' in item ? 'Asset' : 'Debt'} • {format(new Date(item.created_at), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ₹{('value' in item ? item.value : item.balance).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {('value' in item ? item.type : item.type).replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forms */}
      <AssetForm
        open={isAssetFormOpen}
        onOpenChange={setIsAssetFormOpen}
      />
      <DebtForm
        open={isDebtFormOpen}
        onOpenChange={setIsDebtFormOpen}
      />
    </div>
  )
}

export default Dashboard