import { motion } from 'framer-motion'

interface ProgressBarProps {
  percentage: number
  label?: string
  color?: 'primary' | 'success' | 'warning' | 'error'
  animated?: boolean
}

export function ProgressBar({
  percentage,
  label,
  color = 'primary',
  animated = true,
}: ProgressBarProps) {
  const colorClasses = {
    primary: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  }

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm text-foreground">{label}</label>
          <span className="text-sm font-semibold text-foreground">{percentage}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${colorClasses[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={animated ? { duration: 0.6, ease: 'easeOut' } : { duration: 0 }}
        />
      </div>
    </div>
  )
}
