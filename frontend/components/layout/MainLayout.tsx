'use client'

import { Sidebar } from './Sidebar'
import { ActivityPanel, ActivityLog } from './ActivityPanel'

interface MainLayoutProps {
  children: React.ReactNode
  activityLogs?: ActivityLog[]
  showActivityPanel?: boolean
  isLiveActivity?: boolean
}

export function MainLayout({
  children,
  activityLogs = [],
  showActivityPanel = true,
  isLiveActivity = false,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64 mr-80 min-h-screen py-8 px-8">
        {children}
      </main>

      {/* Activity Panel */}
      {showActivityPanel && (
        <ActivityPanel logs={activityLogs} isLive={isLiveActivity} />
      )}
    </div>
  )
}
