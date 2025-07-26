import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string
  description?: string
  icon?: LucideIcon
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'primary'
  className?: string
}

const variantStyles = {
  default: 'bg-card text-card-foreground',
  success: 'bg-gradient-success text-white',
  warning: 'bg-gradient-to-r from-warning to-amber-500 text-white', 
  destructive: 'bg-gradient-to-r from-destructive to-red-600 text-white',
  primary: 'bg-gradient-primary text-white',
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  variant = 'default',
  className
}) => {
  const isColored = variant !== 'default'
  
  return (
    <Card className={cn(
      variantStyles[variant],
      'shadow-card',
      isColored && 'shadow-finance',
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={cn(
          "text-sm font-medium",
          isColored ? "text-white/90" : "text-muted-foreground"
        )}>
          {title}
        </CardTitle>
        {Icon && (
          <Icon className={cn(
            "h-4 w-4",
            isColored ? "text-white/90" : "text-muted-foreground"
          )} />
        )}
      </CardHeader>
      <CardContent>
        <div className={cn(
          "text-2xl font-bold",
          isColored ? "text-white" : "text-foreground"
        )}>
          {value}
        </div>
        {description && (
          <p className={cn(
            "text-xs mt-1",
            isColored ? "text-white/70" : "text-muted-foreground"
          )}>
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export { StatCard }