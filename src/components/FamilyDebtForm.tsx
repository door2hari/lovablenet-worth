import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CurrencyInput } from '@/components/ui/currency-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { useCreateFamilyDebt, useUpdateFamilyDebt } from '@/hooks/useSupabaseData'
import { FamilyDebt } from '@/types'
import { Loader2 } from 'lucide-react'

const debtSchema = z.object({
  type: z.enum(['personal', 'home_loan', 'credit_card', 'other']),
  lender: z.string().min(1, 'Lender is required'),
  principal: z.number().min(0, 'Principal must be positive'),
  interest_rate: z.number().min(0, 'Interest rate must be positive').optional(),
  term_years: z.number().min(1, 'Term must be at least 1 year').optional(),
  balance: z.number().min(0, 'Balance must be positive'),
  currency: z.string().default('INR'),
  metadata: z.object({
    notes: z.string().optional(),
  }).optional(),
})

type DebtFormData = z.infer<typeof debtSchema>

interface FamilyDebtFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  family_member_id: string
  debt?: FamilyDebt
}

const debtTypes = [
  { value: 'home_loan', label: 'Home Loan / Mortgage' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'personal', label: 'Personal Loan' },
  { value: 'other', label: 'Other Debt' },
]

const currencies = [
  { value: 'INR', label: 'INR (₹)' },
]

export const FamilyDebtForm: React.FC<FamilyDebtFormProps> = ({ open, onOpenChange, family_member_id, debt }) => {
  const { toast } = useToast()
  const createDebt = useCreateFamilyDebt()
  const updateDebt = useUpdateFamilyDebt()
  
  const form = useForm<DebtFormData>({
    resolver: zodResolver(debtSchema),
    defaultValues: {
      type: 'personal',
      lender: '',
      principal: 0,
      balance: 0,
      currency: 'INR',
      metadata: {},
      ...debt,
    },
  })

  React.useEffect(() => {
    if (debt) {
      form.reset({
        type: debt.type || 'personal',
        lender: debt.lender || '',
        principal: debt.principal ?? 0,
        balance: debt.balance ?? 0,
        currency: debt.currency || 'INR',
        metadata: debt.metadata || {},
        interest_rate: debt.interest_rate ?? 0,
        term_years: debt.term_years ?? 1,
      })
    } else {
      form.reset({
        type: 'personal',
        lender: '',
        principal: 0,
        balance: 0,
        currency: 'INR',
        metadata: {},
        interest_rate: 0,
        term_years: 1,
      })
    }
  }, [debt, open])

  const onSubmit = async (data: DebtFormData) => {
    try {
      const safeData = {
        ...data,
        type: data.type || 'personal',
        principal: typeof data.principal === 'number' ? data.principal : 0,
        balance: typeof data.balance === 'number' ? data.balance : 0,
        lender: data.lender || '',
        currency: data.currency || 'INR',
      }
      if (debt) {
        await updateDebt.mutateAsync({ id: debt.id, family_member_id, ...safeData })
        toast({
          title: 'Success',
          description: 'Family debt updated successfully',
        })
      } else {
        await createDebt.mutateAsync({ ...safeData, family_member_id })
        toast({
          title: 'Success',
          description: 'Family debt added successfully',
        })
      }
      onOpenChange(false)
      form.reset()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save debt',
        variant: 'destructive',
      })
    }
  }

  const isLoading = createDebt.isPending || updateDebt.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto mx-2">
        <DialogHeader>
          <DialogTitle>{debt ? 'Edit Family Debt' : 'Add Family Debt'}</DialogTitle>
          <DialogDescription>
            {debt ? 'Update debt information for this family member' : 'Add a new debt for this family member'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Debt Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select debt type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {debtTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lender / Institution</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Wells Fargo, Chase Bank" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="principal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Principal</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        value={field.value}
                        onChange={field.onChange}
                        currency={form.watch('currency')}
                        placeholder="0.00"
                        min={0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Balance</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        value={field.value}
                        onChange={field.onChange}
                        currency={form.watch('currency')}
                        placeholder="0.00"
                        min={0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="interest_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interest Rate (%)</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="0.00"
                        min={0}
                        max={100}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="term_years"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Term (Years)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="30"
                        step="1"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metadata.notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes about this debt..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {debt ? 'Update Debt' : 'Add Debt'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 