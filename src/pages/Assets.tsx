import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Header from '@/components/Header'

import { PieChartComponent, BarChartComponent, DonutChartComponent } from '@/components/ui/charts'
import { useAssets, useDeleteAsset } from '@/hooks/useSupabaseData'
import { AssetForm } from '@/components/AssetForm'
import LastModifiedInfo from '@/components/LastModifiedInfo'

import { Asset } from '@/types'
import { Plus, Edit, Trash2, PiggyBank, BarChart3, PieChart, Download, TrendingUp, Target, Activity } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'

const Assets = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAsset, setEditingAsset] = useState<Asset | undefined>()


  const { data: assets = [], isLoading, error } = useAssets()
  const deleteAsset = useDeleteAsset()
  const { toast } = useToast()

  // Calculate last modified timestamp
  const getLastModified = () => {
    if (assets.length === 0) return new Date()
    
    const latestAsset = assets.reduce((latest, asset) => {
      const assetDate = new Date(asset.updated_at || asset.created_at)
      const latestDate = new Date(latest.updated_at || latest.created_at)
      return assetDate > latestDate ? asset : latest
    })
    
    return new Date(latestAsset.updated_at || latestAsset.created_at)
  }

  // Use all assets without filtering
  const filteredAssets = assets

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset)
    setIsFormOpen(true)
  }

  const handleDelete = async (asset: Asset) => {
    try {
      await deleteAsset.mutateAsync(asset.id)
      toast({
        title: 'Success',
        description: 'Asset deleted successfully',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete asset',
        variant: 'destructive',
      })
    }
  }

  const handleAddNew = () => {
    setEditingAsset(undefined)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingAsset(undefined)
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

  // Prepare chart data
  const assetTypeData = Object.entries(
    filteredAssets.reduce((acc, asset) => {
      acc[asset.type] = (acc[asset.type] || 0) + asset.value
      return acc
    }, {} as Record<string, number>)
  ).map(([type, value]) => ({
    name: getAssetTypeLabel(type),
    value,
    color: getAssetTypeColor(type)
  }))

  const totalValue = filteredAssets.reduce((sum, asset) => sum + asset.value, 0)
  const averageValue = filteredAssets.length > 0 ? totalValue / filteredAssets.length : 0
  const highestValue = Math.max(...filteredAssets.map(asset => asset.value), 0)

  if (error) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">Error loading assets: {error.message}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header 
        title="Assets Management"
        showAddButtons={false}
      />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* Last Modified Info */}
        <div className="flex justify-end">
          <LastModifiedInfo
            lastModified={getLastModified()}
            recordCount={assets.length}
            recordType="assets"
          />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card className="card-hover bg-gradient-to-br from-green-500 to-green-600 text-white shadow-finance">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Total Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-white/90" />
            </CardHeader>
            <CardContent>
                              <div className="text-lg sm:text-2xl font-bold">₹{totalValue.toLocaleString()}</div>
              <p className="text-xs text-white/70">{filteredAssets.length} assets</p>
            </CardContent>
          </Card>

          <Card className="card-hover bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-finance">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Average Value</CardTitle>
              <Target className="h-4 w-4 text-white/90" />
            </CardHeader>
            <CardContent>
                              <div className="text-lg sm:text-2xl font-bold">₹{averageValue.toLocaleString()}</div>
              <p className="text-xs text-white/70">per asset</p>
            </CardContent>
          </Card>

          <Card className="card-hover bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-finance">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Highest Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-white/90" />
            </CardHeader>
            <CardContent>
                              <div className="text-lg sm:text-2xl font-bold">₹{highestValue.toLocaleString()}</div>
              <p className="text-xs text-white/70">single asset</p>
            </CardContent>
          </Card>

          <Card className="card-hover bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-finance">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Asset Types</CardTitle>
              <BarChart3 className="h-4 w-4 text-white/90" />
            </CardHeader>
            <CardContent>
                              <div className="text-lg sm:text-2xl font-bold">{new Set(filteredAssets.map(a => a.type)).size}</div>
              <p className="text-xs text-white/70">different types</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Table */}
        <Tabs defaultValue="table" className="space-y-4 sm:space-y-6">
          <Card className="p-4">
            <TabsList className="flex w-full overflow-x-auto no-scrollbar gap-2">
              <TabsTrigger value="table" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Table View
              </TabsTrigger>
              <TabsTrigger value="charts" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Charts
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>
          </Card>

          <TabsContent value="table" className="space-y-6">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PiggyBank className="h-5 w-5" />
                  Your Assets
                </CardTitle>
                <CardDescription>Manage and track all your assets in one place</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Loading assets...</p>
                  </div>
                ) : filteredAssets.length === 0 ? (
                  <div className="text-center py-8">
                    <PiggyBank className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No assets found</h3>
                    <p className="text-muted-foreground mb-4">
                      {assets.length === 0 ? 'Start building your portfolio by adding your first asset' : 'No assets match your current filters'}
                    </p>
                    {assets.length === 0 && (
                      <Button onClick={handleAddNew}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Asset
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <div className="flex justify-end mb-4">
                      <LastModifiedInfo
                        lastModified={getLastModified()}
                        recordCount={filteredAssets.length}
                        recordType="assets"
                        className="text-xs"
                      />
                    </div>
                    <Table className="min-w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Subtype</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Currency</TableHead>
                          <TableHead>Added</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAssets.map((asset) => (
                          <TableRow key={asset.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">{asset.name}</TableCell>
                            <TableCell>
                              <Badge className={getAssetTypeColor(asset.type)}>
                                {getAssetTypeLabel(asset.type)}
                              </Badge>
                            </TableCell>
                            <TableCell>{asset.subtype || '-'}</TableCell>
                            <TableCell className="font-medium">
                              ₹{asset.value.toLocaleString()}
                            </TableCell>
                            <TableCell>{asset.currency || 'INR'}</TableCell>
                            <TableCell>{format(new Date(asset.created_at), 'MMM dd, yyyy')}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(asset)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Asset</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{asset.name}"? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete(asset)}>
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DonutChartComponent
                data={assetTypeData}
                title="Asset Distribution by Type"
                height={400}
              />
              <BarChartComponent
                data={assetTypeData}
                title="Asset Values by Type"
                height={400}
              />
            </div>
            <PieChartComponent
              data={assetTypeData}
              title="Detailed Asset Breakdown"
              height={400}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="text-lg">Top Asset Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assetTypeData
                      .sort((a, b) => b.value - a.value)
                      .slice(0, 5)
                      .map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-sm font-medium">{item.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">₹{item.value.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">
                              {((item.value / totalValue) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="text-lg">Asset Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Assets:</span>
                      <span className="font-medium">{filteredAssets.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Asset Types:</span>
                      <span className="font-medium">{new Set(filteredAssets.map(a => a.type)).size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg Value:</span>
                      <span className="font-medium">₹{averageValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Max Value:</span>
                      <span className="font-medium">₹{highestValue.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredAssets
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .slice(0, 5)
                      .map((asset, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div>
                            <p className="text-sm font-medium">{asset.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(asset.created_at), 'MMM dd')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">₹{asset.value.toLocaleString()}</p>
                            <Badge variant="outline" className="text-xs">
                              {getAssetTypeLabel(asset.type)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Asset Form Dialog */}
      <AssetForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        asset={editingAsset}
      />
    </div>
  )
}

export default Assets 