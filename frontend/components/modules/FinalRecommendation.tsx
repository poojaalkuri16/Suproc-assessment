'use client'

import { AgentModuleCard } from '@/components/agent/AgentModuleCard'
import { Badge } from '@/components/ui/Badge'
import { EvidencePanel, EvidenceData } from '@/components/ui/EvidencePanel'
import { CircularProgress } from '@/components/ui/CircularProgress'
import { Award } from 'lucide-react'

interface FinalRecommendationProps {
  isExpanded?: boolean
  isCollapsed?: boolean
  onToggleExpand?: () => void
  recommendedSuppliers?: any[]
}

export function FinalRecommendation({
  isExpanded = true,
  isCollapsed = false,
  onToggleExpand,
  recommendedSuppliers,
}: FinalRecommendationProps) {
  const recommendations = recommendedSuppliers?.length > 0
    ? recommendedSuppliers.map((rec, i) => {
        const supplierDetails = rec.supplier_details || rec
        return {
          companyName: rec.company_name || supplierDetails.company_name,
          score: rec.match_score,
          confidence: rec.confidence,
          reason: rec.recommendation_reason,
          evidence: {
            location: supplierDetails.location,
            certification: supplierDetails.certifications?.length > 0 ? supplierDetails.certifications : undefined,
            capacity: supplierDetails.production_capacity ? `${supplierDetails.production_capacity.toLocaleString()} units/month` : undefined,
            delivery: supplierDetails.lead_time_days ? `${supplierDetails.lead_time_days} days` : undefined,
            rating: supplierDetails.rating ? `${supplierDetails.rating}/5` : undefined,
            source: 'Local Supplier Dataset',
          } as EvidenceData,
          previousRating: supplierDetails.rating ? `${supplierDetails.rating}/5` : undefined,
        }
      })
    : []

  return (
    <AgentModuleCard
      title="Final Recommendation"
      icon={<Award className="w-6 h-6" />}
      status={isCollapsed ? 'completed' : 'completed'}
      runtime="0.31s"
      isExpanded={isExpanded}
      isCollapsed={isCollapsed}
      onToggleExpand={onToggleExpand}
    >
      <div className="space-y-4">
        {recommendations.length > 0 ? (
          recommendations.map((rec, idx) => (
            <div key={idx} className="bg-gradient-to-br from-card/80 to-card/40 border border-border rounded-lg overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-border/50">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {rec.companyName && <h3 className="font-semibold text-foreground">{rec.companyName}</h3>}
                      {rec.confidence && (
                        <Badge variant={rec.confidence === 'High' ? 'success' : 'warning'}>
                          {rec.confidence}
                        </Badge>
                      )}
                    </div>
                    {rec.reason && <p className="text-sm text-muted-foreground">{rec.reason}</p>}
                  </div>
                  {rec.score != null && (
                    <div className="flex-shrink-0">
                      <CircularProgress percentage={rec.score} size={80} strokeWidth={6} />
                    </div>
                  )}
                </div>
              </div>

              {/* Rating - only if available */}
              {rec.previousRating && (
                <div className="px-4 py-2 border-b border-border/50">
                  <p className="text-xs text-muted-foreground">Previous Rating</p>
                  <p className="text-sm font-semibold text-foreground">{rec.previousRating}</p>
                </div>
              )}

              {/* Evidence */}
              <EvidencePanel evidence={rec.evidence} title="View Evidence" defaultOpen={idx === 0} />
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">No recommendation data available</div>
        )}
      </div>
    </AgentModuleCard>
  )
}
