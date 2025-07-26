export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
      }
      assets: {
        Row: {
          id: string
          user_id: string
          type: 'home' | 'fd' | 'rd' | 'stock' | 'mutual_fund' | 'property' | 'foreign_stock' | 'rsu' | 'direct_investment' | 'gold' | 'crypto' | 'cash' | 'other'
          subtype: string | null
          name: string
          value: number
          currency: string
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'home' | 'fd' | 'rd' | 'stock' | 'mutual_fund' | 'property' | 'foreign_stock' | 'rsu' | 'direct_investment' | 'gold' | 'crypto' | 'cash' | 'other'
          subtype?: string | null
          name: string
          value: number
          currency?: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'home' | 'fd' | 'rd' | 'stock' | 'mutual_fund' | 'property' | 'foreign_stock' | 'rsu' | 'direct_investment' | 'gold' | 'crypto' | 'cash' | 'other'
          subtype?: string | null
          name?: string
          value?: number
          currency?: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      debts: {
        Row: {
          id: string
          user_id: string
          type: 'personal' | 'home_loan' | 'credit_card' | 'other'
          lender: string
          principal: number
          interest_rate: number | null
          term_years: number | null
          balance: number
          currency: string
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'personal' | 'home_loan' | 'credit_card' | 'other'
          lender: string
          principal: number
          interest_rate?: number | null
          term_years?: number | null
          balance: number
          currency?: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'personal' | 'home_loan' | 'credit_card' | 'other'
          lender?: string
          principal?: number
          interest_rate?: number | null
          term_years?: number | null
          balance?: number
          currency?: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      family_members: {
        Row: {
          id: string
          user_id: string
          name: string
          relation: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          relation: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          relation?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      family_assets: {
        Row: {
          id: string
          user_id: string
          family_member_id: string
          type: 'home' | 'fd' | 'rd' | 'stock' | 'mutual_fund' | 'property' | 'foreign_stock' | 'rsu' | 'direct_investment' | 'gold' | 'crypto' | 'cash' | 'other'
          subtype: string | null
          name: string
          value: number
          currency: string
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          family_member_id: string
          type: 'home' | 'fd' | 'rd' | 'stock' | 'mutual_fund' | 'property' | 'foreign_stock' | 'rsu' | 'direct_investment' | 'gold' | 'crypto' | 'cash' | 'other'
          subtype?: string | null
          name: string
          value: number
          currency?: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          family_member_id?: string
          type?: 'home' | 'fd' | 'rd' | 'stock' | 'mutual_fund' | 'property' | 'foreign_stock' | 'rsu' | 'direct_investment' | 'gold' | 'crypto' | 'cash' | 'other'
          subtype?: string | null
          name?: string
          value?: number
          currency?: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      family_debts: {
        Row: {
          id: string
          user_id: string
          family_member_id: string
          type: 'personal' | 'home_loan' | 'credit_card' | 'other'
          lender: string
          principal: number
          interest_rate: number | null
          term_years: number | null
          balance: number
          currency: string
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          family_member_id: string
          type: 'personal' | 'home_loan' | 'credit_card' | 'other'
          lender: string
          principal: number
          interest_rate?: number | null
          term_years?: number | null
          balance: number
          currency?: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          family_member_id?: string
          type?: 'personal' | 'home_loan' | 'credit_card' | 'other'
          lender?: string
          principal?: number
          interest_rate?: number | null
          term_years?: number | null
          balance?: number
          currency?: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}