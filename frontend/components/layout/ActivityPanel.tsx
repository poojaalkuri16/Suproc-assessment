'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Clock, ChevronRight, X } from 'lucide-react'

export interface ActivityLog {
  id: string
  timestamp: string
  message: string
  status: 'info' | 'success' | 'warning' | 'error'
  details?: {
    title: string
    description: string
    items?: string[]
  }
}

interface ActivityPanelProps {
  logs: ActivityLog[]
  isLive?: boolean
}

export function ActivityPanel({ logs, isLive = false }: ActivityPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  const selectedLog = logs.find((log) => log.id === selectedLogId)

  return (
    <aside className="fixed right-0 top-0 h-screen w-80 bg-card border-l border-border flex flex-col py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pb-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Activity Log</h2>
        {isLive && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        )}
      </div>

      {/* Logs Container */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-2 mt-4 pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
      >
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center text-muted-foreground">
            <p className="text-sm">No activity yet</p>
          </div>
        ) : (
          logs.map((log, index) => (
            <motion.button
              key={`${log.id}-${index}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedLogId(selectedLogId === log.id ? null : log.id)}
              className="w-full text-left flex gap-3 px-3 py-2 rounded-lg bg-card hover:bg-muted/30 hover:border hover:border-primary/50 transition-all cursor-pointer group"
            >
              {/* Status Icon */}
              <div className="flex-shrink-0 mt-1">
                {log.status === 'success' && (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                )}
                {log.status === 'info' && (
                  <Clock className="w-4 h-4 text-blue-500" />
                )}
                {log.status === 'warning' && (
                  <Clock className="w-4 h-4 text-yellow-500" />
                )}
                {log.status === 'error' && (
                  <Clock className="w-4 h-4 text-red-500" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-mono">{log.timestamp}</p>
                <p className="text-sm text-foreground/80 leading-tight mt-1">{log.message}</p>
              </div>

              {/* Chevron */}
              {log.details && (
                <ChevronRight
                  className={`flex-shrink-0 w-4 h-4 text-muted-foreground mt-1 transition-transform group-hover:translate-x-1 ${
                    selectedLogId === log.id ? 'rotate-90' : ''
                  }`}
                />
              )}
            </motion.button>
          ))
        )}
      </div>

      {/* Detail View */}
      <AnimatePresence>
        {selectedLog && selectedLog.details && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="mt-4 p-4 bg-primary/10 border border-primary/30 rounded-lg space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground text-sm">{selectedLog.details.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{selectedLog.details.description}</p>
              </div>
              <button
                onClick={() => setSelectedLogId(null)}
                className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedLog.details.items && selectedLog.details.items.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-primary/20">
                {selectedLog.details.items.map((item, idx) => (
                  <div key={idx} className="flex gap-2 text-xs text-foreground/70">
                    <span className="text-primary font-semibold flex-shrink-0">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  )
}
