'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { motion } from 'framer-motion'
import { GitBranch, ChevronDown } from 'lucide-react'

const workflowNodes = [
  {
    name: 'Requirement Extractor',
    purpose: 'Parse and extract user requirements',
    input: 'User query',
    output: 'Structured requirements',
  },
  {
    name: 'Planning Engine',
    purpose: 'Create execution plan',
    input: 'Requirements',
    output: 'Execution steps',
  },
  {
    name: 'Search Engine',
    purpose: 'Query local dataset',
    input: 'Search criteria',
    output: 'Candidate records',
  },
  {
    name: 'Constraint Filter',
    purpose: 'Apply hard constraints',
    input: 'Candidates',
    output: 'Filtered candidates',
  },
  {
    name: 'Ranking Engine',
    purpose: 'Score and rank candidates',
    input: 'Filtered candidates',
    output: 'Ranked candidates',
  },
  {
    name: 'Validation Engine',
    purpose: 'Validate recommendations',
    input: 'Ranked candidates',
    output: 'Validation results',
  },
  {
    name: 'Retry Logic',
    purpose: 'Handle validation failures',
    input: 'Failed validations',
    output: 'Retried candidates',
  },
  {
    name: 'Recommendation Generator',
    purpose: 'Generate recommendations',
    input: 'Validated candidates',
    output: 'Recommendations',
  },
  {
    name: 'Outreach Generator',
    purpose: 'Draft outreach messages',
    input: 'Recommendations',
    output: 'Email templates',
  },
  {
    name: 'Human Approval',
    purpose: 'Get human approval',
    input: 'Recommendations',
    output: 'Approved/Rejected',
  },
]

export default function ArchitecturePage() {
  return (
    <MainLayout showActivityPanel={false}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-6">
          <GitBranch className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">AI Agent Architecture</h1>
        </div>

        <div className="space-y-3">
          {workflowNodes.map((node, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-card border border-border rounded-lg overflow-hidden group hover:border-primary/50 transition-all"
            >
              {/* Node Header */}
              <div className="p-4 bg-gradient-to-r from-card to-card/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <h3 className="font-semibold text-foreground flex-1">{node.name}</h3>
                  <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>

              {/* Details */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                whileHover={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-border/50 bg-black/20"
              >
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Purpose</p>
                    <p className="text-sm text-foreground">{node.purpose}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Input</p>
                      <p className="text-sm text-foreground/70">{node.input}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Output</p>
                      <p className="text-sm text-foreground/70">{node.output}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Connector */}
              {idx < workflowNodes.length - 1 && (
                <div className="flex justify-center py-1">
                  <ChevronDown className="w-4 h-4 text-muted-foreground/50 animate-bounce" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg"
        >
          <h3 className="font-semibold text-foreground mb-2">Key Features</h3>
          <ul className="space-y-1 text-sm text-foreground/80">
            <li>• Modular pipeline architecture with clear input/output contracts</li>
            <li>• Automatic correction loop for handling validation failures</li>
            <li>• Evidence-backed recommendations from local dataset</li>
            <li>• Human approval workflow for governance</li>
            <li>• Sequential execution with timeout handling</li>
          </ul>
        </motion.div>
      </motion.div>
    </MainLayout>
  )
}
