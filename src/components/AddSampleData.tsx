import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, Plus, Sparkles } from 'lucide-react'

const AddSampleData = () => {
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const addSampleData = async () => {
    if (!user) return

    setLoading(true)
    try {
      // Sample assets
      const sampleAssets = [
        {
          user_id: user.id,
          type: 'stock',
          name: 'Tesla Inc',
          value: 15420,
          currency: 'USD',
          metadata: { symbol: 'TSLA', shares: 50 }
        },
        {
          user_id: user.id,
          type: 'cash',
          name: 'Emergency Fund',
          value: 25000,
          currency: 'USD',
          metadata: { account_type: 'savings' }
        },
        {
          user_id: user.id,
          type: 'property',
          name: 'Primary Residence',
          value: 450000,
          currency: 'USD',
          metadata: { property_type: 'house', location: 'San Francisco' }
        },
        {
          user_id: user.id,
          type: 'mutual_fund',
          name: 'S&P 500 Index Fund',
          value: 45000,
          currency: 'USD',
          metadata: { fund_symbol: 'VFIAX' }
        }
      ]

      // Sample debts
      const sampleDebts = [
        {
          user_id: user.id,
          type: 'home_loan',
          lender: 'Wells Fargo',
          principal: 350000,
          interest_rate: 3.2,
          term_years: 30,
          balance: 320000,
          currency: 'USD'
        },
        {
          user_id: user.id,
          type: 'credit_card',
          lender: 'Chase Sapphire',
          principal: 5000,
          interest_rate: 18.9,
          balance: 2500,
          currency: 'USD'
        }
      ]

      // Insert sample data
      const { error: assetsError } = await supabase
        .from('assets')
        .insert(sampleAssets)

      const { error: debtsError } = await supabase
        .from('debts')
        .insert(sampleDebts)

      if (assetsError || debtsError) {
        throw new Error(assetsError?.message || debtsError?.message)
      }

      toast({
        title: 'Success!',
        description: 'Sample financial data has been added to your account.',
      })

      // Refresh the page to show new data
      window.location.reload()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add sample data',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mb-8 border-dashed border-2 border-primary/30">
      <CardHeader className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-xl mb-4 mx-auto">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <CardTitle>Get Started Quickly</CardTitle>
        <CardDescription>
          Add sample financial data to explore the dashboard features
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button onClick={addSampleData} disabled={loading} size="lg">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding Sample Data...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Sample Data
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground mt-3">
          This will add sample assets and debts to your account for demo purposes
        </p>
      </CardContent>
    </Card>
  )
}

export default AddSampleData