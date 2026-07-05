'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export type ExecutionStep =
  | 'idle'
  | 'understanding'
  | 'planning'
  | 'searching'
  | 'constraints'
  | 'filtering'
  | 'ranking'
  | 'validation'
  | 'preparing'
  | 'completed'

const steps: { id: ExecutionStep; label: string; description?: string }[] = [
  { id: 'idle', label: 'Idle' },
  { id: 'understanding', label: 'Understanding Request' },
  { id: 'planning', label: 'Planning' },
  { id: 'searching', label: 'Searching Dataset' },
  { id: 'constraints', label: 'Constraints Checked' },
  { id: 'filtering', label: 'Filtering Candidates' },
  { id: 'ranking', label: 'Ranking Results' },
  { id: 'validation', label: 'Validation' },
  { id: 'preparing', label: 'Preparing Recommendation' },
  { id: 'completed', label: 'Completed' },
]

interface ExecutionTimelineProps {
  currentStep: ExecutionStep
  approvalStatus?: 'Pending' | 'Approved' | 'Rejected'
}

export function ExecutionTimeline({ currentStep, approvalStatus }: ExecutionTimelineProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep)
  // Last step (completed) should show as completed if approval is approved or rejected
  const lastStepCompleted = approvalStatus && approvalStatus !== 'Pending'

  return (
    <div className="w-full mb-8">
      <div className="flex items-center gap-2 mb-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex || (index === steps.length - 1 && lastStepCompleted)
          const isActive = index === currentIndex && !(index === steps.length - 1 && lastStepCompleted)
          const isPending = index > currentIndex

          return (
            <motion.div
              key={step.id}
              className="flex-1 flex items-center"
            >
              {/* Step Circle */}
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.2 : 1,
                  backgroundColor: isCompleted ? '#10b981' : isActive ? '#3b82f6' : '#374151',
                }}
                transition={{ duration: 0.3 }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 relative"
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}

                {/* Pulse Animation for Active Step */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    animate={{ scale: [1, 1.3], opacity: [1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <motion.div
                  className="flex-1 h-1 mx-1"
                  animate={{
                    backgroundColor: isCompleted ? '#10b981' : '#e5e7eb',
                  }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Step Labels - Show only current and next few */}
      <div className="text-center">
        <motion.p
          key={currentStep}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="text-lg font-semibold text-foreground"
        >
          {steps[currentIndex].label}
        </motion.p>
      </div>
    </div>
  )
}
