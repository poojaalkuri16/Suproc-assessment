'use client'

import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check, Loader } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AgentModuleCardProps {
  title: string
  icon?: ReactNode
  status: 'idle' | 'running' | 'completed' | 'error'
  runtime?: string
  children: ReactNode
  isExpanded?: boolean
  isCollapsed?: boolean
  onToggleExpand?: () => void
}

export function AgentModuleCard({
  title,
  icon,
  status,
  runtime,
  children,
  isExpanded = true,
  isCollapsed = false,
  onToggleExpand,
}: AgentModuleCardProps) {
  const statusConfig = {
    idle: { color: 'bg-muted/50', textColor: 'text-muted-foreground', label: 'Pending' },
    running: { color: 'bg-primary/10', textColor: 'text-primary', label: 'Running' },
    completed: { color: 'bg-green-500/10', textColor: 'text-green-500', label: 'Completed' },
    error: { color: 'bg-red-500/10', textColor: 'text-red-500', label: 'Error' },
  }

  const config = statusConfig[status]

  if (isCollapsed) {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'rounded-lg border overflow-hidden transition-all',
          config.color,
          'border-border'
        )}
      >
        {/* Collapsed Header - Still Expandable */}
        <div
          className={cn(
            'flex items-center justify-between p-4 cursor-pointer hover:bg-black/5 transition-colors',
            status === 'completed' && 'bg-green-500/5'
          )}
          onClick={onToggleExpand}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {icon && <div className="text-lg">{icon}</div>}
            <div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className={cn('text-xs', config.textColor)}>✓ {config.label}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {runtime && <span className="text-xs text-muted-foreground">{runtime}</span>}
            {isExpanded !== undefined && (
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Expandable Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-border bg-black/20"
            >
              <div className="p-4">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'rounded-lg border overflow-hidden transition-all',
        config.color,
        'border-border'
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between p-5 cursor-pointer hover:bg-black/5 transition-colors',
          status === 'completed' && 'bg-green-500/5'
        )}
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Status Indicator */}
          <div className="flex-shrink-0">
            {status === 'running' && (
              <Loader className="w-5 h-5 text-primary animate-spin" />
            )}
            {status === 'completed' && (
              <Check className="w-5 h-5 text-green-500" />
            )}
            {status === 'idle' && (
              <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30"></div>
            )}
            {status === 'error' && (
              <div className="w-5 h-5 rounded-full bg-red-500"></div>
            )}
          </div>

          {/* Icon */}
          {icon && <div className="flex-shrink-0 text-2xl">{icon}</div>}

          {/* Title and Status */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{title}</h3>
            <p className={cn('text-sm', config.textColor)}>
              {status === 'running' && 'Processing...'}
              {status === 'completed' && 'Completed'}
              {status === 'idle' && 'Pending'}
              {status === 'error' && 'Error'}
            </p>
          </div>
        </div>

        {/* Right Side Info */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {runtime && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Runtime</p>
              <p className="text-sm font-mono text-foreground">{runtime}</p>
            </div>
          )}
          {isExpanded !== undefined && (
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-border bg-black/20"
          >
            <div className="p-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
