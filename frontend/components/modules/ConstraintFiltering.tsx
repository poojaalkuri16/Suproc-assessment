'use client'

import { AgentModuleCard } from '@/components/agent/AgentModuleCard'
import { Filter } from 'lucide-react'

interface ConstraintFilteringProps {
  isExpanded?: boolean
  isCollapsed?: boolean
  onToggleExpand?: () => void
  filterData?: {
    initial_candidates?: number
    remaining_candidates?: number
    applied_constraints?: string[]
  }
}

export function ConstraintFiltering({
  isExpanded = true,
  isCollapsed = false,
  onToggleExpand,
  filterData,
}: ConstraintFilteringProps) {
  return (
    <AgentModuleCard
      title="Constraint Filtering"
      icon={<Filter className="w-6 h-6" />}
      status={isCollapsed ? 'completed' : 'completed'}
      runtime="0.28s"
      isExpanded={isExpanded}
      isCollapsed={isCollapsed}
      onToggleExpand={onToggleExpand}
    >
      <div className="space-y-3">
        {(filterData?.initial_candidates != null || filterData?.remaining_candidates != null) && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {filterData?.initial_candidates != null && (
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Total Suppliers</p>
                <p className="text-2xl font-bold text-primary">{filterData.initial_candidates}</p>
              </div>
            )}
            {filterData?.remaining_candidates != null && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Remaining</p>
                <p className="text-2xl font-bold text-green-400">{filterData.remaining_candidates}</p>
              </div>
            )}
          </div>
        )}

        {filterData?.applied_constraints?.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Applied Constraints</p>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
              {filterData.applied_constraints.map((constraint, idx) => (
                <li key={idx}>{constraint}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AgentModuleCard>
  )
}
