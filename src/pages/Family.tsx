import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import Header from '@/components/Header'
import { useFamilyMembers, useDeleteFamilyMember, useAllFamilyAssets, useDeleteFamilyAsset, useAllFamilyDebts, useDeleteFamilyDebt } from '@/hooks/useSupabaseData'
import { FamilyMemberForm } from '@/components/FamilyMemberForm'
import { FamilyAssetForm } from '@/components/FamilyAssetForm'
import { FamilyDebtForm } from '@/components/FamilyDebtForm'
import LastModifiedInfo from '@/components/LastModifiedInfo'
import { FamilyMember, FamilyAsset, FamilyDebt } from '@/types'
import { Plus, Edit, Trash2, Users, UserPlus, DollarSign, TrendingUp, TrendingDown, PieChart, BarChart3, Target, Activity, PiggyBank, Home, Car, CreditCard, Building2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { PieChartComponent, BarChartComponent, DonutChartComponent } from '@/components/ui/charts'

const Family = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<FamilyMember | undefined>()
  const [assetDialog, setAssetDialog] = useState<{ open: boolean, memberId: string, asset?: FamilyAsset }>({ open: false, memberId: '', asset: undefined })
  const [debtDialog, setDebtDialog] = useState<{ open: boolean, memberId: string, debt?: FamilyDebt }>({ open: false, memberId: '', debt: undefined })
  const { data: members = [], isLoading, error } = useFamilyMembers()
  const deleteMember = useDeleteFamilyMember()
  const deleteFamilyAsset = useDeleteFamilyAsset()
  const deleteFamilyDebt = useDeleteFamilyDebt()
  const { toast } = useToast()

  // Calculate last modified timestamp
  const getLastModified = () => {
    const allItems = [...members, ...(allFamilyAssets.data || []), ...(allFamilyDebts.data || [])]
    if (allItems.length === 0) return new Date()
    
    const latestItem = allItems.reduce((latest, item) => {
      const itemDate = new Date(item.updated_at || item.created_at)
      const latestDate = new Date(latest.updated_at || latest.created_at)
      return itemDate > latestDate ? item : latest
    })
    
    return new Date(latestItem.updated_at || latestItem.created_at)
  }

  // Helper functions - defined first to avoid initialization errors
  const getRelationLabel = (relation: string) => {
    const labels: Record<string, string> = {
      spouse: 'Spouse',
      child: 'Child',
      parent: 'Parent',
      sibling: 'Sibling',
      grandparent: 'Grandparent',
      grandchild: 'Grandchild',
      other: 'Other',
    }
    return labels[relation] || relation
  }

  const getRelationColor = (relation: string) => {
    const colors: Record<string, string> = {
      spouse: '#EC4899',
      child: '#3B82F6',
      parent: '#10B981',
      sibling: '#8B5CF6',
      grandparent: '#F59E0B',
      grandchild: '#FCD34D',
      other: '#6B7280',
    }
    return colors[relation] || '#6B7280'
  }

  const getAssetTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      cash: 'Cash & Savings',
      stock: 'Stocks',
      mutual_fund: 'Mutual Funds',
      property: 'Real Estate',
      home: 'Primary Home',
      fd: 'Fixed Deposits',
      rd: 'Recurring Deposits',
      foreign_stock: 'Foreign Stocks',
      rsu: 'RSUs',
      direct_investment: 'Direct Investments',
      gold: 'Gold & Precious Metals',
      crypto: 'Cryptocurrency',
      other: 'Other',
    }
    return labels[type] || type
  }

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
      other: '#6B7280',
    }
    return colors[type] || '#6B7280'
  }

  const getDebtTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      personal: 'Personal Loan',
      home_loan: 'Home Loan',
      credit_card: 'Credit Card',
      car_loan: 'Car Loan',
      education: 'Education Loan',
      business: 'Business Loan',
      other: 'Other',
    }
    return labels[type] || type
  }

  const getDebtTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      personal: '#EF4444',
      home_loan: '#F59E0B',
      credit_card: '#EC4899',
      car_loan: '#8B5CF6',
      education: '#06B6D4',
      business: '#10B981',
      other: '#6B7280',
    }
    return colors[type] || '#6B7280'
  }

  // Fetch all family assets and debts at the top level
  const allFamilyAssets = useAllFamilyAssets()
  const allFamilyDebts = useAllFamilyDebts()

  // Calculate overall family financial metrics
  const totalFamilyAssets = allFamilyAssets.data?.reduce((sum, asset) => sum + asset.value, 0) || 0
  const totalFamilyDebts = allFamilyDebts.data?.reduce((sum, debt) => sum + debt.balance, 0) || 0
  const overallFamilyNetWorth = totalFamilyAssets - totalFamilyDebts

  // Calculate per-member metrics
  const memberMetrics = members.map(member => {
    const memberAssets = allFamilyAssets.data?.filter(asset => asset.family_member_id === member.id) || []
    const memberDebts = allFamilyDebts.data?.filter(debt => debt.family_member_id === member.id) || []
    const totalAssets = memberAssets.reduce((sum, a) => sum + a.value, 0)
    const totalDebts = memberDebts.reduce((sum, d) => sum + d.balance, 0)
    const netWorth = totalAssets - totalDebts
    return { member, totalAssets, totalDebts, netWorth, assetCount: memberAssets.length, debtCount: memberDebts.length }
  })

  // Asset type breakdown for charts
  const assetTypeBreakdown = allFamilyAssets.data?.reduce((acc, asset) => {
    acc[asset.type] = (acc[asset.type] || 0) + asset.value
    return acc
  }, {} as Record<string, number>) || {}

  const assetTypeData = Object.entries(assetTypeBreakdown).map(([type, value]) => ({
    name: getAssetTypeLabel(type),
    value,
    color: getAssetTypeColor(type)
  }))

  // Member net worth comparison for charts
  const memberNetWorthData = memberMetrics
    .filter(m => m.netWorth > 0)
    .map(m => ({
      name: m.member.name,
      value: m.netWorth,
      color: getRelationColor(m.member.relation)
    }))

  // Debt type breakdown
  const debtTypeBreakdown = allFamilyDebts.data?.reduce((acc, debt) => {
    acc[debt.type] = (acc[debt.type] || 0) + debt.balance
    return acc
  }, {} as Record<string, number>) || {}

  const debtTypeData = Object.entries(debtTypeBreakdown).map(([type, value]) => ({
    name: getDebtTypeLabel(type),
    value,
    color: getDebtTypeColor(type)
  }))

  const handleEdit = (member: FamilyMember) => {
    setEditingMember(member)
    setIsFormOpen(true)
  }

  const handleDelete = async (member: FamilyMember) => {
    try {
      await deleteMember.mutateAsync(member.id)
      toast({
        title: 'Success',
        description: 'Family member deleted successfully',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete family member',
        variant: 'destructive',
      })
    }
  }

  const handleAddNew = () => {
    setEditingMember(undefined)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingMember(undefined)
  }

  const renderAssetsTable = (memberId: string) => {
    const assets = allFamilyAssets.data?.filter(asset => asset.family_member_id === memberId) || []
    const loadingAssets = allFamilyAssets.isLoading
    
    // Calculate last modified for this member's assets
    const getMemberAssetsLastModified = () => {
      if (assets.length === 0) return new Date()
      const latestAsset = assets.reduce((latest, asset) => {
        const assetDate = new Date(asset.updated_at || asset.created_at)
        const latestDate = new Date(latest.updated_at || latest.created_at)
        return assetDate > latestDate ? asset : latest
      })
      return new Date(latestAsset.updated_at || latestAsset.created_at)
    }
    
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold">Assets</h4>
          <Button size="sm" onClick={() => setAssetDialog({ open: true, memberId, asset: undefined })}>
            <Plus className="h-4 w-4 mr-1" /> Add Asset
          </Button>
        </div>
        {assets.length > 0 && (
          <div className="flex justify-end mb-2">
            <LastModifiedInfo
              lastModified={getMemberAssetsLastModified()}
              recordCount={assets.length}
              recordType="assets"
              className="text-xs"
            />
          </div>
        )}
        {loadingAssets ? (
          <div className="text-muted-foreground text-sm">Loading assets...</div>
        ) : assets.length === 0 ? (
          <div className="text-muted-foreground text-sm">No assets</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>{getAssetTypeLabel(asset.type)}</TableCell>
                  <TableCell>₹{asset.value.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => setAssetDialog({ open: true, memberId, asset })}><Edit className="h-4 w-4" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline"><Trash2 className="h-4 w-4" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Asset</AlertDialogTitle>
                            <AlertDialogDescription>Are you sure you want to delete "{asset.name}"?</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteFamilyAsset.mutateAsync({ id: asset.id, family_member_id: memberId })}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    )
  }

  const renderDebtsTable = (memberId: string) => {
    const debts = allFamilyDebts.data?.filter(debt => debt.family_member_id === memberId) || []
    const loadingDebts = allFamilyDebts.isLoading
    
    // Calculate last modified for this member's debts
    const getMemberDebtsLastModified = () => {
      if (debts.length === 0) return new Date()
      const latestDebt = debts.reduce((latest, debt) => {
        const debtDate = new Date(debt.updated_at || debt.created_at)
        const latestDate = new Date(latest.updated_at || latest.created_at)
        return debtDate > latestDate ? debt : latest
      })
      return new Date(latestDebt.updated_at || latestDebt.created_at)
    }
    
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold">Debts</h4>
          <Button size="sm" onClick={() => setDebtDialog({ open: true, memberId, debt: undefined })}>
            <Plus className="h-4 w-4 mr-1" /> Add Debt
          </Button>
        </div>
        {debts.length > 0 && (
          <div className="flex justify-end mb-2">
            <LastModifiedInfo
              lastModified={getMemberDebtsLastModified()}
              recordCount={debts.length}
              recordType="debts"
              className="text-xs"
            />
          </div>
        )}
        {loadingDebts ? (
          <div className="text-muted-foreground text-sm">Loading debts...</div>
        ) : debts.length === 0 ? (
          <div className="text-muted-foreground text-sm">No debts</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lender</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {debts.map((debt) => (
                <TableRow key={debt.id}>
                  <TableCell>{debt.lender}</TableCell>
                  <TableCell>{getDebtTypeLabel(debt.type)}</TableCell>
                  <TableCell>₹{debt.balance.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => setDebtDialog({ open: true, memberId, debt })}><Edit className="h-4 w-4" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline"><Trash2 className="h-4 w-4" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Debt</AlertDialogTitle>
                            <AlertDialogDescription>Are you sure you want to delete debt from "{debt.lender}"?</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteFamilyDebt.mutateAsync({ id: debt.id, family_member_id: memberId })}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    )
  }

  const getNetWorth = (memberId: string) => {
    const assets = allFamilyAssets.data?.filter(asset => asset.family_member_id === memberId) || []
    const debts = allFamilyDebts.data?.filter(debt => debt.family_member_id === memberId) || []
    const totalAssets = assets.reduce((sum, a) => sum + a.value, 0)
    const totalDebts = debts.reduce((sum, d) => sum + d.balance, 0)
    return totalAssets - totalDebts
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">Error loading family members: {error.message}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Family Members"
        showAddButtons={true}
        onAddMember={() => setIsFormOpen(true)}
      />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* Last Modified Info */}
        <div className="flex justify-end">
          <LastModifiedInfo
            lastModified={getLastModified()}
            recordCount={members.length + (allFamilyAssets.data?.length || 0) + (allFamilyDebts.data?.length || 0)}
            recordType="family records"
          />
        </div>
        
        {/* Family Financial Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-finance">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Total Family Assets</CardTitle>
              <PiggyBank className="h-4 w-4 text-white/90" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">₹{totalFamilyAssets.toLocaleString()}</div>
              <p className="text-xs text-white/70">{allFamilyAssets.data?.length || 0} assets</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-finance">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Total Family Debts</CardTitle>
              <CreditCard className="h-4 w-4 text-white/90" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">₹{totalFamilyDebts.toLocaleString()}</div>
              <p className="text-xs text-white/70">{allFamilyDebts.data?.length || 0} debts</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-finance">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Family Net Worth</CardTitle>
              <DollarSign className="h-4 w-4 text-white/90" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">₹{overallFamilyNetWorth.toLocaleString()}</div>
              <p className="text-xs text-white/70">Combined family wealth</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-finance">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Family Members</CardTitle>
              <Users className="h-4 w-4 text-white/90" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{members.length}</div>
              <p className="text-xs text-white/70">Total family members</p>
            </CardContent>
          </Card>
        </div>

        {/* Family Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Family Financial Analytics</CardTitle>
            <CardDescription>Comprehensive insights into your family's financial health</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <Card className="p-4">
                <TabsList className="flex w-full overflow-x-auto no-scrollbar gap-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="assets">Assets</TabsTrigger>
                  <TabsTrigger value="debts">Debts</TabsTrigger>
                  <TabsTrigger value="members">Members</TabsTrigger>
                </TabsList>
              </Card>

              <TabsContent value="overview" className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        Asset Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {assetTypeData.length > 0 ? (
                        <PieChartComponent
                          data={assetTypeData}
                          title="Family Assets by Type"
                          height={300}
                        />
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No assets data available
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Member Net Worth
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {memberNetWorthData.length > 0 ? (
                        <BarChartComponent
                          data={memberNetWorthData}
                          title="Family Members Net Worth"
                          height={300}
                        />
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No net worth data available
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="assets" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                                         <CardHeader>
                       <CardTitle className="flex items-center gap-2">
                         <PieChart className="h-5 w-5" />
                         Asset Types Breakdown
                       </CardTitle>
                     </CardHeader>
                    <CardContent>
                      {assetTypeData.length > 0 ? (
                        <DonutChartComponent
                          data={assetTypeData}
                          title="Family Assets by Type"
                          height={300}
                        />
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No assets data available
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Asset Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            ₹{Math.max(...Object.values(assetTypeBreakdown)).toLocaleString()}
                          </div>
                          <div className="text-sm text-green-600">Highest Asset Type</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {Object.keys(assetTypeBreakdown).length}
                          </div>
                          <div className="text-sm text-blue-600">Asset Categories</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Top Asset Types:</h4>
                        {Object.entries(assetTypeBreakdown)
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 3)
                          .map(([type, value]) => (
                            <div key={type} className="flex justify-between items-center">
                              <span>{getAssetTypeLabel(type)}</span>
                              <span className="font-semibold">₹{value.toLocaleString()}</span>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="debts" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        Debt Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {debtTypeData.length > 0 ? (
                        <PieChartComponent
                          data={debtTypeData}
                          title="Family Debts by Type"
                          height={300}
                        />
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No debts data available
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Debt Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                          <div className="text-2xl font-bold text-red-600">
                            ₹{Math.max(...Object.values(debtTypeBreakdown)).toLocaleString()}
                          </div>
                          <div className="text-sm text-red-600">Highest Debt Type</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">
                            {Object.keys(debtTypeBreakdown).length}
                          </div>
                          <div className="text-sm text-orange-600">Debt Categories</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Top Debt Types:</h4>
                        {Object.entries(debtTypeBreakdown)
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 3)
                          .map(([type, value]) => (
                            <div key={type} className="flex justify-between items-center">
                              <span>{getDebtTypeLabel(type)}</span>
                              <span className="font-semibold">₹{value.toLocaleString()}</span>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="members" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Family Member Financial Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {memberMetrics.map(({ member, totalAssets, totalDebts, netWorth, assetCount, debtCount }) => (
                        <Card key={member.id} className="p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            {member.avatar_url ? (
                              <img 
                                src={member.avatar_url} 
                                alt={member.name}
                                className="w-8 h-8 rounded-full"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-primary">
                                  {member.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div>
                              <div className="font-semibold">{member.name}</div>
                              <Badge className={getRelationColor(member.relation)}>
                                {getRelationLabel(member.relation)}
                              </Badge>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-green-600">Assets:</span>
                              <span className="font-semibold">₹{totalAssets.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-red-600">Debts:</span>
                              <span className="font-semibold">₹{totalDebts.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between border-t pt-2">
                              <span className="text-sm font-semibold">Net Worth:</span>
                              <span className={`font-bold ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ₹{netWorth.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{assetCount} assets</span>
                              <span>{debtCount} debts</span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Family Members Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Family</CardTitle>
            <CardDescription>Manage your family members and their financial information</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading family members...</p>
              </div>
            ) : members.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No family members yet</h3>
                <p className="text-muted-foreground mb-4">Add family members to track their assets and debts</p>
                <Button onClick={handleAddNew}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Your First Family Member
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {members.map((member) => (
                  <Card key={member.id} className="mb-8">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {member.avatar_url ? (
                          <img 
                            src={member.avatar_url} 
                            alt={member.name}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {member.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <span className="font-bold text-lg">{member.name}</span>
                        <Badge className={getRelationColor(member.relation)}>
                          {getRelationLabel(member.relation)}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(member)}><Edit className="h-4 w-4" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm"><Trash2 className="h-4 w-4" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Family Member</AlertDialogTitle>
                              <AlertDialogDescription>Are you sure you want to delete "{member.name}"? This action cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(member)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          <span className="text-sm">Assets:</span>
                          <span className="font-semibold">₹{(allFamilyAssets.data?.filter(asset => asset.family_member_id === member.id) || []).reduce((sum, a) => sum + a.value, 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrendingDown className="h-5 w-5 text-red-600" />
                          <span className="text-sm">Debts:</span>
                          <span className="font-semibold">₹{(allFamilyDebts.data?.filter(debt => debt.family_member_id === member.id) || []).reduce((sum, d) => sum + d.balance, 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-5 w-5 text-primary" />
                          <span className="text-sm">Net Worth:</span>
                          <span className="font-semibold">₹{getNetWorth(member.id).toLocaleString()}</span>
                        </div>
                      </div>
                      {renderAssetsTable(member.id)}
                      {renderDebtsTable(member.id)}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Family Member Form Dialog */}
      <FamilyMemberForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        member={editingMember}
      />
      {/* Family Asset Form Dialog */}
      <FamilyAssetForm
        open={assetDialog.open}
        onOpenChange={(open) => setAssetDialog({ ...assetDialog, open })}
        family_member_id={assetDialog.memberId}
        asset={assetDialog.asset}
      />
      {/* Family Debt Form Dialog */}
      <FamilyDebtForm
        open={debtDialog.open}
        onOpenChange={(open) => setDebtDialog({ ...debtDialog, open })}
        family_member_id={debtDialog.memberId}
        debt={debtDialog.debt}
      />
    </div>
  )
}

export default Family 