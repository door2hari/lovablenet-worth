import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

export type Asset = {
  id: string
  user_id: string
  type: 'home' | 'fd' | 'rd' | 'stock' | 'mutual_fund' | 'property' | 'foreign_stock' | 'rsu' | 'direct_investment' | 'gold' | 'crypto' | 'cash' | 'other'
  subtype?: string
  name: string
  value: number
  currency: string
  metadata?: any
  created_at: string
  updated_at: string
}

export type Debt = {
  id: string
  user_id: string
  type: 'personal' | 'home_loan' | 'credit_card' | 'other'
  lender: string
  principal: number
  interest_rate?: number
  term_years?: number
  balance: number
  currency: string
  metadata?: any
  created_at: string
  updated_at: string
}

export const useAssets = () => {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['assets', user?.id],
    queryFn: async () => {
      if (!user) return []
      
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Asset[]
    },
    enabled: !!user,
  })
}

export const useDebts = () => {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['debts', user?.id],
    queryFn: async () => {
      if (!user) return []
      
      const { data, error } = await supabase
        .from('debts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Debt[]
    },
    enabled: !!user,
  })
}

export const useFinancialSummary = () => {
  const { data: assets = [] } = useAssets()
  const { data: debts = [] } = useDebts()
  
  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0)
  const totalDebts = debts.reduce((sum, debt) => sum + debt.balance, 0)
  const netWorth = totalAssets - totalDebts
  
  return {
    totalAssets,
    totalDebts,
    netWorth,
    assets,
    debts,
  }
}