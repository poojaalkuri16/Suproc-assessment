'use client'

import { motion } from 'framer-motion'
import { AlertCircle, ChevronDown, Zap, Check } from 'lucide-react'

export type CorrectionStep = 'failed' | 'reason' | 'correcting' | 'found' | 'passed'

interface CorrectionLoopProps {
  failureReason?: string
  currentStep?: CorrectionStep
}

export function CorrectionLoop({
  failureReason = 'Supplier does not meet delivery deadline',
  currentStep = 'failed',
}: CorrectionLoopProps) {
  const steps: { id: CorrectionStep; label: string; icon: React.ReactNode }[] = [
    { id: 'failed', label: 'Validation Failed', icon: <AlertCircle className="w-5 h-5" /> },
    { id: 'reason', label: `Reason: ${failureReason}`, icon: <AlertCircle className="w-5 h-5" /> },
    { id: 'correcting', label: 'Correction Engine', icon: <Zap className="w-5 h-5" /> },
    { id: 'found', label: 'Replacement Found', icon: <Check className="w-5 h-5" /> },
    { id: 'passed', label: 'Validation Passed', icon: <Check className="w-5 h-5" /> },
  ]

  const currentIndex = steps.findIndex((s) => s.id === currentStep)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full space-y-3 p-4 bg-red-500/5 border border-red-500/20 rounded-lg"
    >
      <p className="text-sm font-semibold text-red-400 mb-4">Correction Loop Active</p>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const isActive = index === currentIndex
          const isCompleted = index < currentIndex
          const isPending = index > currentIndex

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: Math.max(0, index - currentIndex) * 0.2 }}
            >
              {/* Connector */}
              {index > 0 && (
                <motion.div
                  className="flex justify-center"
                  animate={{
                    color: isCompleted
                      ? 'rgb(34, 197, 94)'
                      : isActive
                        ? 'rgb(59, 130, 246)'
                        : 'rgb(107, 114, 128)',
                  }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              )}

              {/* Step */}
              <motion.div
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-500/10 border border-blue-500/50'
                    : isCompleted
                      ? 'bg-green-500/10 border border-green-500/50'
                      : isPending
                        ? 'bg-muted/30 border border-border/30'
                        : 'bg-muted/30 border border-border/30'
                }`}
              >
                {/* Icon */}
                <motion.div
                  animate={{
                    color: isCompleted
                      ? 'rgb(34, 197, 94)'
                      : isActive
                        ? 'rgb(59, 130, 246)'
                        : 'rgb(107, 114, 128)',
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  {step.icon}
                </motion.div>

                {/* Label */}
                <div className="flex-1">
                  <p
                    className={`text-sm font-semibold ${
                      isCompleted
                        ? 'text-green-400'
                        : isActive
                          ? 'text-blue-400'
                          : 'text-muted-foreground'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>

                {/* Status */}
                {isCompleted && <span className="text-xs text-green-400 font-semibold">✓</span>}
                {isActive && (
                  <motion.div
                    animate={{ opacity: [0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-xs text-blue-400 font-semibold"
                  >
                    • • •
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      {/* Status Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xs text-muted-foreground mt-3 p-3 bg-black/30 rounded border border-border/50"
      >
        {currentStep === 'correcting' && 'Searching for alternative suppliers...'}
        {currentStep === 'found' && 'Found replacement supplier. Re-validating...'}
        {currentStep === 'passed' && 'All validation checks passed!'}
      </motion.div>
    </motion.div>
  )
}
