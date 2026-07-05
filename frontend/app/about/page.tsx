'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { motion } from 'framer-motion'
import { Info } from 'lucide-react'

export default function AboutPage() {
  return (
    <MainLayout showActivityPanel={false}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-6">
          <Info className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">About Suproc</h1>
        </div>

        <div className="space-y-6">
          {[
            {
              title: 'Project Purpose',
              content:
                'Suproc is an AI-powered Business Agent that automates the supplier discovery, matching, and recommendation process. It demonstrates production-quality AI orchestration with transparency, explainability, and evidence-backed decision making.',
            },
            {
              title: 'Problem Statement',
              content:
                'Finding qualified suppliers is time-consuming, manual, and prone to bias. Organizations need a scalable, transparent AI system that can search databases, apply constraints, rank candidates, and prepare recommendations with audit trails.',
            },
            {
              title: 'AI Agent Workflow',
              content:
                'The agent follows a 10-step execution pipeline: (1) Extract requirements, (2) Plan execution, (3) Search dataset, (4) Check constraints, (5) Filter candidates, (6) Rank by match score, (7) Validate results, (8) Generate recommendations, (9) Prepare outreach, (10) Human approval. Each step is transparent and produces evidence.',
            },
            {
              title: 'Technology Stack',
              content:
                'Built with Next.js 16, React 19, Tailwind CSS 4, Framer Motion, Lucide Icons, and TypeScript. The frontend showcases professional AI UX patterns inspired by Perplexity, Cursor, Claude, and LangGraph Studio.',
            },
            {
              title: 'Key Features',
              content:
                '• Sequential execution with auto-advancing state machine • Runtime metrics and execution timeline • Tool console for backend invocations • Constraints checked module • Evidence panels on recommendations • Correction loop for validation failures • Activity log for audit trail • Expandable/collapsible modules • Premium dark theme • Smooth Framer Motion animations',
            },
            {
              title: 'Assignment Objectives',
              content:
                '✓ Build reusable component architecture (AgentModuleCard) ✓ Implement execution state machine ✓ Separate Tool Console from Activity Log ✓ Add runtime metrics ✓ Include confidence indicators ✓ Create Agent Summary dashboard ✓ Build interactive architecture diagram ✓ Demonstrate correction loop ✓ Show evidence-backed recommendations ✓ Polish motion and interactions',
            },
          ].map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <h2 className="text-xl font-bold text-foreground mb-3">{section.title}</h2>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg text-center"
        >
          <h3 className="text-lg font-bold text-foreground mb-2">Production Quality</h3>
          <p className="text-foreground/80">
            This application is designed to be interview-ready and demonstrates professional software engineering practices including component reusability, state management, performance optimization, accessibility, and modern UX patterns.
          </p>
        </motion.div>
      </motion.div>
    </MainLayout>
  )
}
