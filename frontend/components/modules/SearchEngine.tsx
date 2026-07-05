'use client'

import { AgentModuleCard } from '@/components/agent/AgentModuleCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Search } from 'lucide-react'

interface SearchEngineProps {
  isExpanded?: boolean
  isCollapsed?: boolean
  onToggleExpand?: () => void
  searchData?: {
    candidate_count?: number
    searched_entity?: string
  }
  requirements?: any
}

export function SearchEngine({
  isExpanded = true,
  isCollapsed = false,
  onToggleExpand,
  searchData,
  requirements,
}: SearchEngineProps) {
  const queryParts = [
    requirements?.material ? `Product = ${requirements.material}` : null,
    requirements?.location ? `Location = ${requirements.location}` : null,
  ].filter(Boolean)

  return (
    <AgentModuleCard
      title="Search Engine"
      icon={<Search className="w-6 h-6" />}
      status={isCollapsed ? 'completed' : 'completed'}
      runtime="1.2s"
      isExpanded={isExpanded}
      isCollapsed={isCollapsed}
      onToggleExpand={onToggleExpand}
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Status: Searching Local Dataset</p>
          <ProgressBar percentage={100} />
        </div>

        <div className="bg-black/20 border border-border/50 rounded-lg p-4">
          <p className="text-sm font-semibold text-foreground mb-2">Results</p>
          <div className="space-y-2">
            <p className="text-sm text-foreground/80">✓ Supplier records discovered</p>
            <p className="text-2xl font-bold text-primary">
              {searchData?.candidate_count != null 
                ? `${searchData.candidate_count} suppliers found` 
                : "Search completed"}
            </p>
            {queryParts.length > 0 && (
              <p className="text-xs text-muted-foreground mt-3">
                Query: {queryParts.join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>
    </AgentModuleCard>
  )
}
