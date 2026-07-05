'use client'

import { motion } from 'framer-motion'
import { Loader, Check, AlertCircle } from 'lucide-react'

export interface ToolInvocation {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  input?: string
  output?: string
  error?: string
  startTime?: string
  endTime?: string
}

interface ToolConsoleProps {
  tools: ToolInvocation[]
  title?: string
}

export function ToolConsole({ tools, title = 'Tool Console' }: ToolConsoleProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          {title}
        </h3>

        <div className="space-y-3">
          {tools.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-4">
              No tools invoked yet
            </div>
          ) : (
            tools.map((tool) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-black/30 border border-border/50 rounded-lg overflow-hidden"
              >
                {/* Tool Header */}
                <div className="flex items-center gap-3 p-3 border-b border-border/50">
                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {tool.status === 'running' && (
                      <Loader className="w-4 h-4 text-blue-400 animate-spin" />
                    )}
                    {tool.status === 'completed' && (
                      <Check className="w-4 h-4 text-green-400" />
                    )}
                    {tool.status === 'failed' && (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    )}
                    {tool.status === 'pending' && (
                      <div className="w-4 h-4 rounded-full border border-muted-foreground/50"></div>
                    )}
                  </div>

                  {/* Tool Name and Status */}
                  <div className="flex-1">
                    <code className="text-xs font-mono text-foreground">
                      {tool.name}()
                    </code>
                    <p className="text-xs text-muted-foreground mt-1">
                      {tool.status === 'running' && 'Running...'}
                      {tool.status === 'completed' && 'Completed'}
                      {tool.status === 'failed' && `Failed: ${tool.error || 'Unknown error'}`}
                      {tool.status === 'pending' && 'Pending'}
                    </p>
                  </div>

                  {/* Time Info */}
                  {tool.startTime && (
                    <div className="text-xs text-muted-foreground text-right">
                      {tool.startTime}
                    </div>
                  )}
                </div>

                {/* Tool Details - Show if completed or has output */}
                {(tool.output || tool.input) && tool.status === 'completed' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="p-3 bg-black/20 border-t border-border/50 space-y-2"
                  >
                    {tool.input && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Input:</p>
                        <code className="text-xs text-foreground/70 font-mono block bg-black/30 p-2 rounded border border-border/30">
                          {tool.input}
                        </code>
                      </div>
                    )}
                    {tool.output && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Output:</p>
                        <code className="text-xs text-foreground/70 font-mono block bg-black/30 p-2 rounded border border-border/30 max-h-24 overflow-y-auto">
                          {tool.output}
                        </code>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  )
}
