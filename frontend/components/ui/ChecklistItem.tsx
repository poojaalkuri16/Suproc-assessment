import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

interface ChecklistItemProps {
  label: string
  checked?: boolean
  error?: boolean
  detail?: string
  animated?: boolean
}

export function ChecklistItem({
  label,
  checked = false,
  error = false,
  detail,
  animated = true,
}: ChecklistItemProps) {
  return (
    <motion.div
      initial={animated ? { opacity: 0, x: -10 } : { opacity: 1 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-3 py-2"
    >
      {/* Checkbox */}
      <motion.div
        initial={animated ? { scale: 0 } : { scale: 1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: animated ? 0.1 : 0 }}
        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
          error
            ? 'border-red-500/50 bg-red-500/10'
            : checked
              ? 'border-green-500 bg-green-500/10'
              : 'border-muted-foreground/30'
        }`}
      >
        {checked && <Check className="w-3 h-3 text-green-400" />}
        {error && <X className="w-3 h-3 text-red-400" />}
      </motion.div>

      {/* Content */}
      <div className="flex-1">
        <p className={`text-sm font-medium ${error ? 'text-red-400' : 'text-foreground'}`}>
          {label}
        </p>
        {detail && <p className="text-xs text-muted-foreground mt-1">{detail}</p>}
      </div>
    </motion.div>
  )
}
