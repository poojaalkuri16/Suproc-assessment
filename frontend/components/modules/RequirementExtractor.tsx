'use client'

import { AgentModuleCard } from '@/components/agent/AgentModuleCard'
import { Zap } from 'lucide-react'

interface RequirementExtractorProps {
  isExpanded?: boolean
  isCollapsed?: boolean
  onToggleExpand?: () => void
  requirements?: any
}

export function RequirementExtractor({
  isExpanded = true,
  isCollapsed = false,
  onToggleExpand,
  requirements,
}: RequirementExtractorProps) {
  const defaultRequirements = [
    { label: 'Objective', value: 'Not Available' },
    { label: 'Entity Type', value: 'Not Available' },
    { label: 'Product', value: 'Not Available' },
    { label: 'Hard Constraints', value: 'Not Available' },
    { label: 'Location', value: 'Not Available' },
    { label: 'Capacity', value: 'Not Available' },
    { label: 'Delivery Deadline', value: 'Not Available' },
    { label: 'Requested Results', value: 'Not Available' },
  ]

  const reqList = requirements
    ? [
        { label: 'Objective', value: requirements.objective || 'Not Available' },
        { label: 'Entity Type', value: requirements.entity_type || 'Not Available' },
        ...(requirements.material ? [{ label: 'Product', value: requirements.material }] : []),
        ...(requirements.location ? [{ label: 'Location', value: requirements.location }] : []),
        ...(requirements.required_quantity
          ? [{ label: 'Required Quantity', value: requirements.required_quantity.toString() }]
          : []),
        ...(requirements.deadline ? [{ label: 'Delivery Deadline', value: requirements.deadline }] : []),
        ...(requirements.supplier_count
          ? [{ label: 'Requested Results', value: `${requirements.supplier_count} recommendations` }]
          : []),
        ...(requirements.hard_constraints?.length > 0
          ? [{ label: 'Hard Constraints', value: requirements.hard_constraints.join(', ') }]
          : []),
      ].filter(req => req.value !== 'Not Available' || req.label) // Keep labels even if value is Not Available? Wait, no, just filter empty
    : defaultRequirements

  return (
    <AgentModuleCard
      title="Requirement Extractor"
      icon={<Zap className="w-6 h-6" />}
      status={isCollapsed ? 'completed' : 'completed'}
      runtime="0.42s"
      isExpanded={isExpanded}
      isCollapsed={isCollapsed}
      onToggleExpand={onToggleExpand}
    >
      <div className="space-y-3">
        {reqList.map((req, idx) => (
          <div key={idx} className="flex justify-between items-start py-2 border-b border-border/30 last:border-0">
            <span className="text-sm text-muted-foreground font-semibold">{req.label}</span>
            <span className="text-sm text-foreground text-right">{req.value}</span>
          </div>
        ))}
      </div>
    </AgentModuleCard>
  )
}
