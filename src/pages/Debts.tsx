import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import Header from '@/components/Header'
import { useDebts, useDeleteDebt } from '@/hooks/useSupabaseData'
import { DebtForm } from '@/components/DebtForm'
import LastModifiedInfo from '@/components/LastModifiedInfo'
import { Debt } from '@/types'
import { Plus, Edit, Trash2, TrendingDown, DollarSign, CreditCard } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const Debts = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingDebt, setEditingDebt] = useState<Debt | undefined>()
  const { data: debts = [], isLoading, error } = useDebts()
  const deleteDebt = useDeleteDebt()
  const { toast } = useToast()

  // Calculate last modified timestamp
  const getLastModified = () => {
    if (debts.length === 0) return new Date()
    
    const latestDebt = debts.reduce((latest, debt) => {
      const debtDate = new Date(debt.updated_at || debt.created_at)
      const latestDate = new Date(latest.updated_at || latest.created_at)
      return debtDate > latestDate ? debt : latest
    })
    
    return new Date(latestDebt.updated_at || latestDebt.created_at)
  }

  const handleEdit = (debt: Debt) => {
    setEditingDebt(debt)
    setIsFormOpen(true)
  }

  const handleDelete = async (debt: Debt) => {
    try {
      await deleteDebt.mutateAsync(debt.id)
      toast({
        title: 'Success',
        description: 'Debt deleted successfully',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete debt',
        variant: 'destructive',
      })
    }
  }

  const handleAddNew = () => {
    setEditingDebt(undefined)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingDebt(undefined)
  }

  const getDebtTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      home_loan: 'Home Loan / Mortgage',
      credit_card: 'Credit Card',
      personal: 'Personal Loan',
      other: 'Other Debt',
    }
    return labels[type] || type
  }

  const getDebtTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      home_loan: 'bg-red-100 text-red-800',
      credit_card: 'bg-orange-100 text-orange-800',
      personal: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800',
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const totalDebts = debts.reduce((sum, debt) => sum + debt.balance, 0)
  const totalPrincipal = debts.reduce((sum, debt) => sum + debt.principal, 0)

  if (error) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">Error loading debts: {error.message}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Debts"
        showAddButtons={false}
      />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Last Modified Info */}
        <div className="flex justify-end mb-4">
          <LastModifiedInfo
            lastModified={getLastModified()}
            recordCount={debts.length}
            recordType="debts"
          />
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-8">
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-finance">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Total Debt Balance</CardTitle>
              <TrendingDown className="h-4 w-4 text-white/90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalDebts.toLocaleString()}</div>
              <p className="text-xs text-white/70">Current outstanding balance</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-finance">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Total Principal</CardTitle>
              <DollarSign className="h-4 w-4 text-white/90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalPrincipal.toLocaleString()}</div>
              <p className="text-xs text-white/70">Original loan amounts</p>
            </CardContent>
          </Card>
        </div>

        {/* Debts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Debts</CardTitle>
            <CardDescription>Manage your loans and credit obligations</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading debts...</p>
              </div>
            ) : debts.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No debts recorded</h3>
                <p className="text-muted-foreground mb-4">Track your loans and credit card balances</p>
                <Button onClick={handleAddNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Debt
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="flex justify-end mb-4">
                  <LastModifiedInfo
                    lastModified={getLastModified()}
                    recordCount={debts.length}
                    recordType="debts"
                    className="text-xs"
                  />
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lender</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Principal</TableHead>
                      <TableHead>Interest Rate</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {debts.map((debt) => (
                      <TableRow key={debt.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{debt.lender}</div>
                            {debt.metadata?.account_number && (
                              <div className="text-sm text-muted-foreground">
                                ****{debt.metadata.account_number}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getDebtTypeColor(debt.type)}>
                            {getDebtTypeLabel(debt.type)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-destructive">
                          ₹{debt.balance.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          ₹{debt.principal.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {debt.interest_rate ? `${debt.interest_rate}%` : 'N/A'}
                        </TableCell>
                        <TableCell>{debt.currency || 'INR'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(debt)}
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
                                  <AlertDialogTitle>Delete Debt</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete the debt with {debt.lender}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(debt)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
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
      </div>

      {/* Debt Form Dialog */}
      <DebtForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        debt={editingDebt}
      />
    </div>
  )
}

export default Debts 