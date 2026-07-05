'use client'

import { useState } from 'react'
import { AgentModuleCard } from '@/components/agent/AgentModuleCard'
import { Button } from '@/components/ui/button'
import { Mail, Copy, Download, Send } from 'lucide-react'

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

interface DraftOutreachMessageProps {
  isExpanded?: boolean
  isCollapsed?: boolean
  onToggleExpand?: () => void
  outreachDrafts?: OutreachDraft[]
}

export function DraftOutreachMessage({
  isExpanded = true,
  isCollapsed = false,
  onToggleExpand,
  outreachDrafts = [],
}: DraftOutreachMessageProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

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

  const drafts = outreachDrafts ?? []

  return (
    <AgentModuleCard
      title="Outreach Drafts"
      icon={<Mail className="w-6 h-6" />}
      status={isCollapsed ? 'completed' : 'completed'}
      runtime="0.25s"
      isExpanded={isExpanded}
      isCollapsed={isCollapsed}
      onToggleExpand={onToggleExpand}
    >
      <div className="space-y-6">
        {drafts.map((draft) => {
          const fullEmail = `Subject: ${draft.subject || 'Not Available'}

${draft.message || 'Not Available'}`

          return (
            <div key={draft.supplier_id || draft.company_name || Math.random()} className="space-y-4 border border-border/30 rounded-lg p-4 bg-black/10">
              {/* Supplier Info */}
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground text-base">Supplier: {draft.company_name || 'Not Available'}</h3>
                <p className="text-sm text-muted-foreground">Recipient: {draft.email || 'Not Available'}</p>
                <p className="text-sm text-muted-foreground">Subject: {draft.subject || 'Not Available'}</p>
                <p className="text-sm text-muted-foreground">Message: {draft.message || 'Not Available'}</p>
                <p className="text-sm text-muted-foreground">Status: {draft.status || 'Pending'}</p>
              </div>

              {/* Email Preview */}
              <div className="bg-black/30 border border-border/50 rounded-lg p-4">
                <div className="whitespace-pre-wrap text-sm text-foreground/80 font-mono text-xs">
                  {draft.message || 'Not Available'}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2">
                  Approve
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  Reject
                </Button>
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
        {drafts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No outreach drafts available</div>
        )}
      </div>
    </AgentModuleCard>
  )
}
