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
import { useCreateFamilyAsset, useUpdateFamilyAsset } from '@/hooks/useSupabaseData'
import { FamilyAsset } from '@/types'
import { Loader2 } from 'lucide-react'

const assetSchema = z.object({
  type: z.enum(['home', 'fd', 'rd', 'stock', 'mutual_fund', 'property', 'foreign_stock', 'rsu', 'direct_investment', 'gold', 'crypto', 'cash', 'other']),
  subtype: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  value: z.number().min(0, 'Value must be positive'),
  currency: z.string().default('INR'),
  metadata: z.object({
    notes: z.string().optional(),
  }).optional(),
})

type AssetFormData = z.infer<typeof assetSchema>

interface FamilyAssetFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  family_member_id: string
  asset?: FamilyAsset
}

const assetTypes = [
  { value: 'cash', label: 'Cash & Savings' },
  { value: 'stock', label: 'Stocks' },
  { value: 'mutual_fund', label: 'Mutual Funds' },
  { value: 'property', label: 'Real Estate' },
  { value: 'home', label: 'Primary Home' },
  { value: 'fd', label: 'Fixed Deposits' },
  { value: 'rd', label: 'Recurring Deposits' },
  { value: 'foreign_stock', label: 'Foreign Stocks' },
  { value: 'rsu', label: 'RSUs' },
  { value: 'direct_investment', label: 'Direct Investments' },
  { value: 'gold', label: 'Gold & Precious Metals' },
  { value: 'crypto', label: 'Cryptocurrency' },
  { value: 'other', label: 'Other' },
]

const currencies = [
  { value: 'INR', label: 'INR (₹)' },
]

export const FamilyAssetForm: React.FC<FamilyAssetFormProps> = ({ open, onOpenChange, family_member_id, asset }) => {
  const { toast } = useToast()
  const createAsset = useCreateFamilyAsset()
  const updateAsset = useUpdateFamilyAsset()
  
  const form = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      type: 'cash',
      name: '',
      value: 0,
      currency: 'INR',
      metadata: {},
      ...asset,
    },
  })

  React.useEffect(() => {
    if (asset) {
      form.reset({
        type: asset.type || 'cash',
        name: asset.name || '',
        value: asset.value ?? 0,
        currency: asset.currency || 'INR',
        metadata: asset.metadata || {},
        subtype: asset.subtype || '',
      })
    } else {
      form.reset({
        type: 'cash',
        name: '',
        value: 0,
        currency: 'INR',
        metadata: {},
        subtype: '',
      })
    }
  }, [asset, open])

  const onSubmit = async (data: AssetFormData) => {
    try {
      const safeData = {
        ...data,
        type: data.type || 'cash',
        value: typeof data.value === 'number' ? data.value : 0,
        name: data.name || '',
        currency: data.currency || 'INR',
      }
      if (asset) {
        await updateAsset.mutateAsync({ id: asset.id, family_member_id, ...safeData })
        toast({
          title: 'Success',
          description: 'Family asset updated successfully',
        })
      } else {
        await createAsset.mutateAsync({ ...safeData, family_member_id })
        toast({
          title: 'Success',
          description: 'Family asset added successfully',
        })
      }
      onOpenChange(false)
      form.reset()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save asset',
        variant: 'destructive',
      })
    }
  }

  const isLoading = createAsset.isPending || updateAsset.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto mx-2">
        <DialogHeader>
          <DialogTitle>{asset ? 'Edit Family Asset' : 'Add Family Asset'}</DialogTitle>
          <DialogDescription>
            {asset ? 'Update asset information for this family member' : 'Add a new asset for this family member'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select asset type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {assetTypes.map((type) => (
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Tesla Inc, Emergency Fund" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
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
            </div>

            <FormField
              control={form.control}
              name="subtype"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtype (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Savings Account, Blue Chip" {...field} />
                  </FormControl>
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
                      placeholder="Additional notes about this asset..."
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
                {asset ? 'Update Asset' : 'Add Asset'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 