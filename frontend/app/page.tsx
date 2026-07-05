'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Sidebar } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

const examplePrompts = [
  'Find a supplier for 10,000 units of food-grade plastic in Bengaluru by Q4 2024',
  'Search for ISO 9001 certified manufacturers in Mumbai with 5000+ unit capacity',
  'Find suppliers offering 30-day delivery in Delhi for electronics components',
]

export default function HomePage() {
  const [prompt, setPrompt] = useState('')
  const router = useRouter()

  const handleRun = () => {
    console.log("1. Run Agent clicked")

    if (!prompt.trim()) {
      console.log("2. Prompt is empty")
      return
    }

    console.log("3. Prompt:", prompt)

    // Save the query for the execution page
    sessionStorage.setItem("pendingQuery", prompt)

    // Remove previous result if any
    sessionStorage.removeItem("agentResult")

    console.log("4. Opening execution page immediately...")

    router.push(
      `/execution?query=${encodeURIComponent(prompt)}`
    )
  }

  const handleExampleClick = (example: string) => {
    setPrompt(example)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="ml-64 min-h-screen py-8 px-8">
        <motion.div
          className="max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          <motion.div
            variants={itemVariants}
            className="text-center mb-12"
          >

            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-sm font-semibold text-primary">
                Enterprise Explainable AI Agent
              </span>
            </div>

            <h1 className="text-6xl font-bold text-balance text-foreground mb-6">
              Suproc AI Business Agent
            </h1>

            <p className="text-2xl font-medium text-balance text-primary/90 mb-3">
              Understand • Search • Verify • Recommend
            </p>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Intelligent supplier discovery with transparent reasoning.
              Watch the AI think through each step as it searches your dataset,
              validates constraints, and generates evidence-backed recommendations.
            </p>

          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mb-8"
          >

            <div className="relative">

              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl blur-xl -z-10"></div>

              <div className="bg-card border border-border rounded-xl p-2 flex gap-2">

                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (
                      e.key === 'Enter' &&
                      !e.nativeEvent.isComposing
                    ) {
                      handleRun()
                    }
                  }}
                  placeholder="Describe your supplier requirements..."
                  className="flex-1 bg-transparent px-4 py-3 text-foreground placeholder-muted-foreground outline-none"
                />

                <Button
                  onClick={handleRun}
                  disabled={!prompt.trim()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 gap-2 rounded-lg"
                >
                  Run Agent
                  <ArrowRight className="w-4 h-4" />
                </Button>

              </div>

            </div>

          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mb-12"
          >

            <p className="text-sm text-muted-foreground mb-3">
              Try an example:
            </p>

            <div className="grid gap-3">

              {examplePrompts.map((example, idx) => (

                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02, x: 4 }}
                  onClick={() => handleExampleClick(example)}
                  className="text-left p-4 bg-card border border-border rounded-lg hover:border-primary/50 hover:bg-card/80 transition-all text-sm text-foreground/80 hover:text-foreground"
                >
                  {example}
                </motion.button>

              ))}

            </div>

          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-4 gap-3 mt-20 pt-8 border-t border-border/30"
          >

            {[
              { label: 'Understand', desc: 'Extract requirements' },
              { label: 'Search', desc: 'Query dataset' },
              { label: 'Verify', desc: 'Validation checks' },
              { label: 'Recommend', desc: 'Backed by evidence' },
            ].map((item, idx) => (

              <motion.div
                key={idx}
                whileHover={{ y: -2 }}
                className="p-4 bg-gradient-to-br from-card/50 to-card/25 border border-border/40 rounded-lg text-center hover:border-primary/30 transition-all"
              >
                <h3 className="font-semibold text-foreground mb-1 text-sm">
                  {item.label}
                </h3>

                <p className="text-xs text-muted-foreground">
                  {item.desc}
                </p>

              </motion.div>

            ))}

          </motion.div>

        </motion.div>

      </main>

    </div>
  )
}