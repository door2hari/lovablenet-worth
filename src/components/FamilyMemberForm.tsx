import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { useCreateFamilyMember, useUpdateFamilyMember } from '@/hooks/useSupabaseData'
import { FamilyMember } from '@/types'
import { Loader2 } from 'lucide-react'

const familyMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  relation: z.string().min(1, 'Relation is required'),
  avatar_url: z.string().optional(),
})

type FamilyMemberFormData = z.infer<typeof familyMemberSchema>

interface FamilyMemberFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member?: FamilyMember
}

const relations = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'child', label: 'Child' },
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'grandparent', label: 'Grandparent' },
  { value: 'grandchild', label: 'Grandchild' },
  { value: 'other', label: 'Other' },
]

export const FamilyMemberForm: React.FC<FamilyMemberFormProps> = ({ open, onOpenChange, member }) => {
  const { toast } = useToast()
  const createMember = useCreateFamilyMember()
  const updateMember = useUpdateFamilyMember()
  
  const form = useForm<FamilyMemberFormData>({
    resolver: zodResolver(familyMemberSchema),
    defaultValues: {
      name: '',
      relation: '',
      avatar_url: '',
      ...member,
    },
  })

  const onSubmit = async (data: FamilyMemberFormData) => {
    try {
      if (member) {
        await updateMember.mutateAsync({ id: member.id, ...data })
        toast({
          title: 'Success',
          description: 'Family member updated successfully',
        })
      } else {
        await createMember.mutateAsync(data as Omit<FamilyMember, 'id' | 'user_id' | 'created_at' | 'updated_at'>)
        toast({
          title: 'Success',
          description: 'Family member added successfully',
        })
      }
      onOpenChange(false)
      form.reset()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save family member',
        variant: 'destructive',
      })
    }
  }

  const isLoading = createMember.isPending || updateMember.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[400px] max-h-[90vh] overflow-y-auto mx-2">
        <DialogHeader>
          <DialogTitle>{member ? 'Edit Family Member' : 'Add Family Member'}</DialogTitle>
          <DialogDescription>
            {member ? 'Update family member information' : 'Add a new family member to your portfolio'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="relation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relation</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {relations.map((relation) => (
                        <SelectItem key={relation.value} value={relation.value}>
                          {relation.label}
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
              name="avatar_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/avatar.jpg" {...field} />
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
                {member ? 'Update Member' : 'Add Member'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 