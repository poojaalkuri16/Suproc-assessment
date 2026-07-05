'use client'

import { useState } from 'react'
import { AgentModuleCard } from '@/components/agent/AgentModuleCard'
import { Button } from '@/components/ui/button'
import { Users, Check, X, Copy, Download, Send } from 'lucide-react'

interface OutreachDraft {
  supplier_id?: string
  company_name?: string
  email?: string
  phone?: string
  subject?: string
  message?: string
  status?: string
  human_approval_required?: boolean
}

interface HumanApprovalProps {
  isExpanded?: boolean
  isCollapsed?: boolean
  onToggleExpand?: () => void
  onApprovalChange?: (status: 'Pending' | 'Approved' | 'Rejected') => void
  recommendedSuppliers?: any[]
  approvalData?: {
    approval_status?: string
    human_approval_required?: boolean
    recommended_action?: string
    pending_actions?: any[]
    external_actions_executed?: any
  }
  outreachDrafts?: OutreachDraft[]
}

export function HumanApproval({
  isExpanded = true,
  isCollapsed = false,
  onToggleExpand,
  onApprovalChange,
  recommendedSuppliers,
  approvalData,
  outreachDrafts = [],
}: HumanApprovalProps) {
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleApprove = () => {
    setStatus('approved')
    onApprovalChange?.('Approved')
  }

  const handleReject = () => {
    setStatus('rejected')
    onApprovalChange?.('Rejected')
  }

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const supplierList = (recommendedSuppliers ?? []).length > 0
    ? (recommendedSuppliers ?? []).map((rec) => {
      const supplier = rec.supplier_details || rec
      return `${supplier.company_name || 'Supplier'}${rec.match_score != null ? ` (${rec.match_score}% match)` : ''}`
    })
    : []

  const displayStatus = (approvalData?.approval_status?.toLowerCase() || status) as 'pending' | 'approved' | 'rejected'

  return (
    <AgentModuleCard
      title="Human Approval"
      icon={<Users className="w-6 h-6" />}
      status={isCollapsed ? 'completed' : displayStatus === 'pending' ? 'running' : 'completed'}
      runtime={displayStatus === 'pending' ? undefined : '0.15s'}
      isExpanded={isExpanded}
      isCollapsed={isCollapsed}
      onToggleExpand={onToggleExpand}
    >
      <div className="space-y-6">
        {/* Summary - only if we have suppliers or approval data */}
        {(supplierList.length > 0 || approvalData) && (
          <div className="bg-black/20 border border-border/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-3">
              {approvalData?.recommended_action || "Ready for Review"}
            </h3>
            <div className="space-y-2 text-sm">
              {supplierList.length > 0 && (
                <>
                  <p className="text-foreground/80">
                    The agent has identified and ranked {supplierList.length} qualified suppliers:
                  </p>
                  <ul className="list-disc list-inside text-foreground/70 space-y-1">
                    {supplierList.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </>
              )}
              {(approvalData?.pending_actions ?? []).length > 0 && (
                <div className="mt-3">
                  <p className="font-semibold text-muted-foreground">Pending Actions:</p>
                  <ul className="list-disc list-inside text-foreground/70 space-y-1">
                    {(approvalData?.pending_actions ?? []).map((action: any, idx) => (
                      <li key={idx}>
                        {typeof action === 'string' 
                          ? action 
                          : `${action.action || 'Action'} for ${action.company_name || 'Supplier'} - ${action.status || 'Pending'}`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status Display */}
        {(!approvalData || displayStatus === 'pending') && status === 'pending' && (
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 text-center">
            <p className="text-sm text-primary font-semibold mb-3">
              {approvalData?.approval_status || "Awaiting Human Approval"}
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              {approvalData?.recommended_action || "Review the recommendations and approve to proceed with outreach or reject to refine"}
            </p>
          </div>
        )}

        {(displayStatus === 'approved' || status === 'approved') && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Check className="w-5 h-5 text-green-400" />
              <p className="text-sm text-green-400 font-semibold">Recommendations Approved</p>
            </div>
            <p className="text-xs text-muted-foreground">
              All {supplierList.length} recommendations approved.
            </p>
          </div>
        )}

        {(displayStatus === 'rejected' || status === 'rejected') && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <X className="w-5 h-5 text-amber-400" />
              <p className="text-sm text-amber-400 font-semibold">Recommendations Rejected</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Feedback recorded.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {status === 'pending' && (
          <div className="flex gap-3">
            <Button
              onClick={handleApprove}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2 font-semibold"
            >
              <Check className="w-4 h-4" />
              Approve Recommendations
            </Button>
            <Button
              onClick={handleReject}
              variant="outline"
              className="flex-1 gap-2"
            >
              <X className="w-4 h-4" />
              Reject & Refine
            </Button>
          </div>
        )}

        {/* Fallback if no data */}
        {!supplierList.length && !approvalData && (
          <div className="text-center py-8 text-muted-foreground">Awaiting Human Approval</div>
        )}

        {/* Outreach Drafts - only when approved */}
        {(displayStatus === 'approved' || status === 'approved') && outreachDrafts.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-base border-t border-border/50 pt-4">Outreach Drafts</h3>
            {outreachDrafts.map((draft) => {
              const fullEmail = `Subject: ${draft.subject || 'Not Available'}\n\n${draft.message || 'Not Available'}`
              
              return (
                <div key={draft.supplier_id || draft.company_name || Math.random()} className="space-y-3 border border-border/30 rounded-lg p-4 bg-black/10">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-foreground">{draft.company_name || 'Not Available'}</h4>
                    <p className="text-sm text-muted-foreground">Recipient: {draft.email || 'Not Available'}</p>
                    <p className="text-sm text-muted-foreground">Subject: {draft.subject || 'Not Available'}</p>
                    <p className="text-sm text-muted-foreground">Status: {draft.status || 'Not Available'}</p>
                  </div>
                  
                  <div className="bg-black/30 border border-border/50 rounded-lg p-3">
                    <div className="whitespace-pre-wrap text-xs text-foreground/80 font-mono">
                      {draft.message || 'Not Available'}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleCopy(fullEmail, draft.supplier_id || draft.company_name || '')}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      {copiedId === (draft.supplier_id || draft.company_name) ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button
                      onClick={() => handleDownload(fullEmail, `outreach-${draft.company_name || 'supplier'}.txt`)}
                      variant="outline"
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                    <Button
                      disabled
                      variant="outline"
                      className="gap-2 opacity-50 cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                      Send
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AgentModuleCard>
  )
}
