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
import { useCreateDebt, useUpdateDebt } from '@/hooks/useSupabaseData'
import { Debt } from '@/types'
import { Loader2 } from 'lucide-react'

const debtSchema = z.object({
  type: z.enum(['personal', 'home_loan', 'credit_card', 'other']),
  lender: z.string().min(1, 'Lender is required'),
  principal: z.number().min(0, 'Principal must be positive'),
  interest_rate: z.number().min(0, 'Interest rate must be positive').optional(),
  term_years: z.number().min(1, 'Term must be at least 1 year').optional(),
  balance: z.number().min(0, 'Balance must be positive'),
  currency: z.string().default('USD'),
  metadata: z.object({
    account_number: z.string().optional(),
    payment_frequency: z.string().optional(),
    next_payment_date: z.string().optional(),
    notes: z.string().optional(),
  }).optional(),
})

type DebtFormData = z.infer<typeof debtSchema>

interface DebtFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  debt?: Debt
}

const debtTypes = [
  { value: 'home_loan', label: 'Home Loan / Mortgage' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'personal', label: 'Personal Loan' },
  { value: 'other', label: 'Other Debt' },
]

const currencies = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'INR', label: 'INR (₹)' },
  { value: 'CAD', label: 'CAD (C$)' },
  { value: 'AUD', label: 'AUD (A$)' },
]

const paymentFrequencies = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'bi-weekly', label: 'Bi-weekly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually', label: 'Annually' },
]

export const DebtForm: React.FC<DebtFormProps> = ({ open, onOpenChange, debt }) => {
  const { toast } = useToast()
  const createDebt = useCreateDebt()
  const updateDebt = useUpdateDebt()
  
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
      if (debt) {
        await updateDebt.mutateAsync({ id: debt.id, ...data })
        toast({
          title: 'Success',
          description: 'Debt updated successfully',
        })
      } else {
        await createDebt.mutateAsync(data as Omit<Debt, 'id' | 'user_id' | 'created_at' | 'updated_at'>)
        toast({
          title: 'Success',
          description: 'Debt added successfully',
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
          <DialogTitle>{debt ? 'Edit Debt' : 'Add New Debt'}</DialogTitle>
          <DialogDescription>
            {debt ? 'Update your debt information' : 'Add a new debt to your portfolio'}
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
              name="metadata.account_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Last 4 digits or account number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metadata.payment_frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Frequency (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentFrequencies.map((freq) => (
                        <SelectItem key={freq.value} value={freq.value}>
                          {freq.label}
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