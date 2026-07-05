'use client'

import { AgentModuleCard } from '@/components/agent/AgentModuleCard'
import { ChecklistItem } from '@/components/ui/ChecklistItem'
import { GitBranch } from 'lucide-react'

interface PlanningEngineProps {
  isExpanded?: boolean
  isCollapsed?: boolean
  onToggleExpand?: () => void
}

export function PlanningEngine({
  isExpanded = true,
  isCollapsed = false,
  onToggleExpand,
}: PlanningEngineProps) {
  const steps = [
    'Understand user request',
    'Create execution plan',
    'Search local dataset',
    'Inspect candidate records',
    'Apply constraints and filters',
    'Rank candidates by match',
    'Validate results',
    'Prepare recommendations',
  ]

  return (
    <AgentModuleCard
      title="Planning Engine"
      icon={<GitBranch className="w-6 h-6" />}
      status={isCollapsed ? 'completed' : 'completed'}
      runtime="0.15s"
      isExpanded={isExpanded}
      isCollapsed={isCollapsed}
      onToggleExpand={onToggleExpand}
    >
      <div className="space-y-1">
        {steps.map((step, idx) => (
          <ChecklistItem key={idx} label={step} checked={true} animated={true} />
        ))}
      </div>
    </AgentModuleCard>
  )
}
