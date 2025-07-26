export type AssetType = 'home' | 'fd' | 'rd' | 'stock' | 'mutual_fund' | 'property' | 'foreign_stock' | 'rsu' | 'direct_investment' | 'gold' | 'crypto' | 'cash' | 'other'
export type DebtType = 'personal' | 'home_loan' | 'credit_card' | 'other'

export interface Asset {
  id: string
  user_id: string
  type: AssetType
  subtype?: string
  name: string
  value: number
  currency: string
  metadata?: any
  created_at: string
  updated_at: string
}

export interface Debt {
  id: string
  user_id: string
  type: DebtType
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

export interface FamilyMember {
  id: string
  user_id: string
  name: string
  relation: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface FamilyAsset extends Omit<Asset, 'user_id'> {
  user_id: string
  family_member_id: string
}

export interface FamilyDebt extends Omit<Debt, 'user_id'> {
  user_id: string
  family_member_id: string
}

export interface User {
  id: string
  email: string
}