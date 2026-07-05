'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export interface EvidenceData {
  location?: string
  certification?: string | string[]
  capacity?: string
  delivery?: string
  rating?: string
  source?: string
}

interface EvidencePanelProps {
  evidence: EvidenceData
  title?: string
  defaultOpen?: boolean
}

export function EvidencePanel({
  evidence,
  title = 'Evidence',
  defaultOpen = false,
}: EvidencePanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const evidenceItems = [
    { label: 'Location', value: evidence.location },
    { label: 'Certification', value: evidence.certification },
    { label: 'Capacity', value: evidence.capacity },
    { label: 'Delivery', value: evidence.delivery },
    { label: 'Rating', value: evidence.rating },
    { label: 'Source', value: evidence.source },
  ].filter((item) => item.value)

  return (
    <motion.div className="w-full border-t border-border/50 mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 text-sm font-semibold text-foreground hover:bg-black/20 transition-colors px-2"
      >
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          {title}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-black/20 border-t border-border/50"
          >
            <div className="p-4 space-y-3">
              {evidenceItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                      {item.label}
                    </p>
                    {Array.isArray(item.value) ? (
                      <div className="space-y-1">
                        {item.value.map((v, i) => (
                          <p key={i} className="text-sm text-foreground">
                            • {v}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-foreground">{item.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
