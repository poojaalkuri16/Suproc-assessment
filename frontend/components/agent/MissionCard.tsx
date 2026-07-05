'use client'

import { motion } from 'framer-motion'
import { Zap, Clock, TrendingUp } from 'lucide-react'

export interface MissionCardProps {
  query: string
  currentPhase: string
  elapsedTime: string
  status: 'idle' | 'running' | 'completed' | 'error'
}

export function MissionCard({ query, currentPhase, elapsedTime, status }: MissionCardProps) {
  const statusConfig = {
    idle: { bg: 'bg-background', icon: '●', label: 'Initializing', color: 'text-muted-foreground' },
    running: { bg: 'bg-background', icon: '◐', label: 'Processing', color: 'text-primary' },
    completed: { bg: 'bg-background', icon: '✓', label: 'Completed', color: 'text-green-500' },
    error: { bg: 'bg-background', icon: '✕', label: 'Error', color: 'text-red-500' },
  }

  const config = statusConfig[status]

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-10 p-6 rounded-xl border ${config.bg} border-border space-y-4`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <motion.span
              animate={status === 'running' ? { rotate: 360 } : {}}
              transition={status === 'running' ? { duration: 2, repeat: Infinity, ease: 'linear' } : {}}
              className={`text-lg ${config.color} font-bold`}
            >
              {config.icon}
            </motion.span>
            <span className={`text-sm font-semibold ${config.color}`}>{config.label}</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground text-balance">{query}</h2>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted">
          <Zap className="w-4 h-4 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Current Phase</p>
            <p className="text-sm font-semibold text-foreground">{currentPhase}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted">
          <Clock className="w-4 h-4 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Elapsed Time</p>
            <p className="text-sm font-semibold text-foreground">{elapsedTime}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted">
          <TrendingUp className="w-4 h-4 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <p className="text-sm font-semibold text-foreground">
              {status === 'running' ? 'In Progress' : status === 'completed' ? 'Done' : 'Ready'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
