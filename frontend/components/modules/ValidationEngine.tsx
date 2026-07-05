'use client'

import { AgentModuleCard } from '@/components/agent/AgentModuleCard'
import { CheckCircle } from 'lucide-react'

interface ValidationEngineProps {
  isExpanded?: boolean
  isCollapsed?: boolean
  onToggleExpand?: () => void
  validationPassed?: boolean
  validationIssues?: Array<{ supplier_id?: string; issues?: string[] }>
}

export function ValidationEngine({
  isExpanded = true,
  isCollapsed = false,
  onToggleExpand,
  validationPassed = true,
  validationIssues = [],
}: ValidationEngineProps) {
  return (
    <AgentModuleCard
      title="Validation Engine"
      icon={<CheckCircle className="w-6 h-6" />}
      status={isCollapsed ? 'completed' : 'completed'}
      runtime="0.19s"
      isExpanded={isExpanded}
      isCollapsed={isCollapsed}
      onToggleExpand={onToggleExpand}
    >
      <div className="space-y-4">
        {/* Validation Status */}
        <div className="bg-black/20 border border-border/50 rounded-lg p-4">
          <p className="text-sm font-semibold text-foreground mb-2">
            {validationPassed ? "Validation Passed" : "Validation Failed"}
          </p>
          {(validationIssues ?? []).length > 0 ? (
            <div className="space-y-3">
              {(validationIssues ?? []).map((issueGroup, idx) => (
                <div key={idx} className="text-sm text-foreground/80">
                  {issueGroup.supplier_id && <p className="font-semibold mb-1">{issueGroup.supplier_id}</p>}
                  {(issueGroup.issues ?? []).length > 0 && (
                    <ul className="list-disc list-inside space-y-1">
                      {(issueGroup.issues ?? []).map((issue, i) => (
                        <li key={i} className="text-muted-foreground">{issue}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No issues found</p>
          )}
        </div>
      </div>
    </AgentModuleCard>
  )
}
