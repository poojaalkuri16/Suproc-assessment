'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  Home,
  Play,
  Database,
  GitBranch,
  Info,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/', icon: <Home className="w-5 h-5" /> },
  { label: 'Agent Execution', href: '/execution', icon: <Play className="w-5 h-5" /> },
  { label: 'Dataset', href: '/dataset', icon: <Database className="w-5 h-5" /> },
  { label: 'Architecture', href: '/architecture', icon: <GitBranch className="w-5 h-5" /> },
  { label: 'About', href: '/about', icon: <Info className="w-5 h-5" /> },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col py-6 px-4 gap-8">
      {/* Logo/Title */}
      <div className="px-4">
        <h1 className="text-2xl font-bold text-sidebar-foreground">Suproc</h1>
        <p className="text-xs text-sidebar-foreground/60 mt-1">AI Business Agent</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              )}
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border pt-4">
        <p className="text-xs text-sidebar-foreground/50 px-4">v1.0.0</p>
      </div>
    </aside>
  )
}
