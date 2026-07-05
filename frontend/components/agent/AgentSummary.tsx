'use client'

import { motion } from 'framer-motion'
import { Check, AlertCircle, Clock } from 'lucide-react'

interface AgentSummaryMetrics {
  status: string
  executionTime: string
  recordsSearched: string
  recordsFiltered: string
  recommendationsGenerated: string
  validationStatus: string
  approvalStatus: string
}

interface AgentSummaryProps {
  metrics: AgentSummaryMetrics
  isVisible?: boolean
}

export function AgentSummary({ metrics, isVisible = true }: AgentSummaryProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  const summaryItems = [
    { label: 'Status', value: metrics.status, icon: Check, color: 'text-green-400' },
    { label: 'Execution Time', value: metrics.executionTime, icon: Clock, color: 'text-blue-400' },
    { label: 'Records Searched', value: metrics.recordsSearched, icon: null, color: null },
    { label: 'Records Filtered', value: metrics.recordsFiltered, icon: null, color: null },
    { label: 'Recommendations', value: metrics.recommendationsGenerated, icon: Check, color: 'text-green-400' },
    { label: 'Validation', value: metrics.validationStatus, icon: Check, color: 'text-green-400' },
    { label: 'Approval', value: metrics.approvalStatus, icon: AlertCircle, color: 'text-yellow-400' },
  ]

  if (!isVisible) return null

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full mb-8"
    >
      <motion.div
        variants={itemVariants}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-foreground mb-1">Agent Summary</h2>
        <p className="text-muted-foreground text-sm">Execution completed successfully</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {summaryItems.map((item, idx) => {
          const Icon = item.icon
          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="bg-gradient-to-br from-card/80 to-card/40 border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs text-muted-foreground font-semibold">{item.label}</p>
                {Icon && (
                  <Icon className={`w-4 h-4 ${item.color}`} />
                )}
              </div>
              <p className="text-lg font-bold text-foreground">{item.value}</p>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
