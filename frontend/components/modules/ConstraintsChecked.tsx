'use client'

import { AgentModuleCard } from '@/components/agent/AgentModuleCard'
import { ChecklistItem } from '@/components/ui/ChecklistItem'
import { CheckCircle2 } from 'lucide-react'

interface ConstraintsCheckedProps {
  isExpanded?: boolean
  isCollapsed?: boolean
  onToggleExpand?: () => void
}

export function ConstraintsChecked({
  isExpanded = true,
  isCollapsed = false,
  onToggleExpand,
}: ConstraintsCheckedProps) {
  const constraints = [
    'Product Category',
    'Location',
    'Minimum Capacity',
    'Delivery Deadline',
    'Certification',
    'Availability',
    'Requested Results Count',
  ]

  return (
    <AgentModuleCard
      title="Constraints Checked"
      icon={<CheckCircle2 className="w-6 h-6" />}
      status={isCollapsed ? 'completed' : 'completed'}
      runtime="0.12s"
      isExpanded={isExpanded}
      isCollapsed={isCollapsed}
      onToggleExpand={onToggleExpand}
    >
      <div className="space-y-1">
        {constraints.map((constraint, idx) => (
          <ChecklistItem key={idx} label={constraint} checked={true} animated={true} />
        ))}
      </div>
    </AgentModuleCard>
  )
}
