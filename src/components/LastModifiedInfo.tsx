import React from 'react'
import { format } from 'date-fns'
import { Clock, RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface LastModifiedInfoProps {
  lastModified: string | Date
  recordCount?: number
  recordType?: string
  className?: string
}

const LastModifiedInfo: React.FC<LastModifiedInfoProps> = ({
  lastModified,
  recordCount,
  recordType = 'records',
  className = ''
}) => {
  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return format(dateObj, 'MMM dd, yyyy HH:mm')
  }

  const getTimeAgo = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffInMs = now.getTime() - dateObj.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInDays < 7) return `${diffInDays}d ago`
    return formatDate(dateObj)
  }

  return (
    <TooltipProvider>
      <div className={`flex items-center gap-2 text-xs text-muted-foreground ${className}`}>
        <Clock className="h-3 w-3" />
        <span>Last updated: {getTimeAgo(lastModified)}</span>
        {recordCount !== undefined && (
          <>
            <span className="text-muted-foreground/50">•</span>
            <span>{recordCount} {recordType}</span>
          </>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <RefreshCw className="h-3 w-3 cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Last modified: {formatDate(lastModified)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Consider updating your data if it's been a while
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

export default LastModifiedInfo 