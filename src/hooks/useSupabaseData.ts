import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { Asset, Debt, FamilyMember, FamilyAsset, FamilyDebt } from '@/types'

export type AssetType = 'home' | 'fd' | 'rd' | 'stock' | 'mutual_fund' | 'property' | 'foreign_stock' | 'rsu' | 'direct_investment' | 'gold' | 'crypto' | 'cash' | 'other'
export type DebtType = 'personal' | 'home_loan' | 'credit_card' | 'other'

// Asset hooks
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

export const useCreateAsset = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  return useMutation({
    mutationFn: async (asset: Omit<Asset, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated')
      const assetWithCurrency = { ...asset, currency: asset.currency || 'INR' }
      const { data, error } = await supabase
        .from('assets')
        .insert([{ ...assetWithCurrency, user_id: user.id }])
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['financial-summary', user?.id] })
    },
  })
}

export const useUpdateAsset = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  return useMutation({
    mutationFn: async ({ id, ...asset }: Partial<Asset> & { id: string }) => {
      const { data, error } = await supabase
        .from('assets')
        .update(asset)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['financial-summary', user?.id] })
    },
  })
}

export const useDeleteAsset = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['financial-summary', user?.id] })
    },
  })
}

// Debt hooks
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

export const useCreateDebt = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  return useMutation({
    mutationFn: async (debt: Omit<Debt, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated')
      const debtWithCurrency = { ...debt, currency: debt.currency || 'INR' }
      const { data, error } = await supabase
        .from('debts')
        .insert([{ ...debtWithCurrency, user_id: user.id }])
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['financial-summary', user?.id] })
    },
  })
}

export const useUpdateDebt = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  return useMutation({
    mutationFn: async ({ id, ...debt }: Partial<Debt> & { id: string }) => {
      const { data, error } = await supabase
        .from('debts')
        .update(debt)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['financial-summary', user?.id] })
    },
  })
}

export const useDeleteDebt = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('debts')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['financial-summary', user?.id] })
    },
  })
}

// Family member hooks
export const useFamilyMembers = () => {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['family-members', user?.id],
    queryFn: async () => {
      if (!user) return []
      
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as FamilyMember[]
    },
    enabled: !!user,
  })
}

export const useCreateFamilyMember = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  return useMutation({
    mutationFn: async (member: Omit<FamilyMember, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('family_members')
        .insert([{ ...member, user_id: user.id }])
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-members', user?.id] })
    },
  })
}

export const useUpdateFamilyMember = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  return useMutation({
    mutationFn: async ({ id, ...member }: Partial<FamilyMember> & { id: string }) => {
      const { data, error } = await supabase
        .from('family_members')
        .update(member)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-members', user?.id] })
    },
  })
}

export const useDeleteFamilyMember = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-members', user?.id] })
    },
  })
}

// Family asset hooks
export const useFamilyAssets = (family_member_id?: string) => {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['family-assets', user?.id, family_member_id],
    queryFn: async () => {
      if (!user || !family_member_id) return []
      const { data, error } = await supabase
        .from('family_assets')
        .select('*')
        .eq('user_id', user.id)
        .eq('family_member_id', family_member_id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as FamilyAsset[]
    },
    enabled: !!user && !!family_member_id,
  })
}

export const useAllFamilyAssets = () => {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['all-family-assets', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('family_assets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as FamilyAsset[]
    },
    enabled: !!user,
  })
}

export const useCreateFamilyAsset = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  return useMutation({
    mutationFn: async (asset: Omit<FamilyAsset, 'id' | 'user_id' | 'created_at' | 'updated_at'> & { family_member_id: string }) => {
      if (!user) throw new Error('User not authenticated')
      const assetWithCurrency = { ...asset, currency: asset.currency || 'INR' }
      const { data, error } = await supabase
        .from('family_assets')
        .insert([{ ...assetWithCurrency, user_id: user.id }])
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['family-assets', user?.id, variables.family_member_id] })
      queryClient.invalidateQueries({ queryKey: ['all-family-assets', user?.id] })
    },
  })
}

export const useUpdateFamilyAsset = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  return useMutation({
    mutationFn: async ({ id, family_member_id, ...asset }: Partial<FamilyAsset> & { id: string, family_member_id: string }) => {
      const { data, error } = await supabase
        .from('family_assets')
        .update(asset)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['family-assets', user?.id, variables.family_member_id] })
      queryClient.invalidateQueries({ queryKey: ['all-family-assets', user?.id] })
    },
  })
}

export const useDeleteFamilyAsset = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  return useMutation({
    mutationFn: async ({ id, family_member_id }: { id: string, family_member_id: string }) => {
      const { error } = await supabase
        .from('family_assets')
        .delete()
        .eq('id', id)
      if (error) throw error
      return id
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['family-assets', user?.id, variables.family_member_id] })
      queryClient.invalidateQueries({ queryKey: ['all-family-assets', user?.id] })
    },
  })
}

// Family debt hooks
export const useFamilyDebts = (family_member_id?: string) => {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['family-debts', user?.id, family_member_id],
    queryFn: async () => {
      if (!user || !family_member_id) return []
      const { data, error } = await supabase
        .from('family_debts')
        .select('*')
        .eq('user_id', user.id)
        .eq('family_member_id', family_member_id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as FamilyDebt[]
    },
    enabled: !!user && !!family_member_id,
  })
}

export const useAllFamilyDebts = () => {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['all-family-debts', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('family_debts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as FamilyDebt[]
    },
    enabled: !!user,
  })
}

export const useCreateFamilyDebt = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  return useMutation({
    mutationFn: async (debt: Omit<FamilyDebt, 'id' | 'user_id' | 'created_at' | 'updated_at'> & { family_member_id: string }) => {
      if (!user) throw new Error('User not authenticated')
      const debtWithCurrency = { ...debt, currency: debt.currency || 'INR' }
      const { data, error } = await supabase
        .from('family_debts')
        .insert([{ ...debtWithCurrency, user_id: user.id }])
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['family-debts', user?.id, variables.family_member_id] })
      queryClient.invalidateQueries({ queryKey: ['all-family-debts', user?.id] })
    },
  })
}

export const useUpdateFamilyDebt = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  return useMutation({
    mutationFn: async ({ id, family_member_id, ...debt }: Partial<FamilyDebt> & { id: string, family_member_id: string }) => {
      const { data, error } = await supabase
        .from('family_debts')
        .update(debt)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['family-debts', user?.id, variables.family_member_id] })
      queryClient.invalidateQueries({ queryKey: ['all-family-debts', user?.id] })
    },
  })
}

export const useDeleteFamilyDebt = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  return useMutation({
    mutationFn: async ({ id, family_member_id }: { id: string, family_member_id: string }) => {
      const { error } = await supabase
        .from('family_debts')
        .delete()
        .eq('id', id)
      if (error) throw error
      return id
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['family-debts', user?.id, variables.family_member_id] })
      queryClient.invalidateQueries({ queryKey: ['all-family-debts', user?.id] })
    },
  })
}

// Financial summary hook
export const useFinancialSummary = () => {
  const { data: assets = [] } = useAssets()
  const { data: debts = [] } = useDebts()
  
  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0)
  const totalDebts = debts.reduce((sum, debt) => sum + debt.balance, 0)
  const netWorth = totalAssets - totalDebts
  
  // Calculate asset breakdown by type
  const assetBreakdown = assets.reduce((acc, asset) => {
    const type = asset.type
    acc[type] = (acc[type] || 0) + asset.value
    return acc
  }, {} as Record<string, number>)
  
  // Calculate debt breakdown by type
  const debtBreakdown = debts.reduce((acc, debt) => {
    const type = debt.type
    acc[type] = (acc[type] || 0) + debt.balance
    return acc
  }, {} as Record<string, number>)
  
  return {
    totalAssets,
    totalDebts,
    netWorth,
    assets,
    debts,
    assetBreakdown,
    debtBreakdown,
  }
}