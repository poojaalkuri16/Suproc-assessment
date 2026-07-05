'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { motion } from 'framer-motion'
import { Database } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

const tabs = ['Suppliers', 'Businesses', 'Professionals', 'Opportunities', 'Interactions'] as const

export default function DatasetPage() {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('Suppliers')
  const [selectedRecordId, setSelectedRecordId] = useState<string | number | null>(null)
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [businesses, setBusinesses] = useState<any[]>([])
  const [professionals, setProfessionals] = useState<any[]>([])
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [interactions, setInteractions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [supRes, busRes, proRes, oppRes, intRes] = await Promise.all([
          fetch('http://localhost:8000/datasets/suppliers'),
          fetch('http://localhost:8000/datasets/businesses'),
          fetch('http://localhost:8000/datasets/professionals'),
          fetch('http://localhost:8000/datasets/opportunities'),
          fetch('http://localhost:8000/datasets/interactions'),
        ])
        const supData = await supRes.json()
        const busData = await busRes.json()
        const proData = await proRes.json()
        const oppData = await oppRes.json()
        const intData = await intRes.json()
        
        setSuppliers(supData)
        setBusinesses(busData)
        setProfessionals(proData)
        setOpportunities(oppData)
        setInteractions(intData)
      } catch (e) {
        console.error('Failed to load datasets', e)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  let records: any[] = []
  let tableHeaders: string[] = []
  if (activeTab === 'Suppliers') {
    records = suppliers
    tableHeaders = ['Name', 'Location', 'Capacity', 'Rating']
  } else if (activeTab === 'Businesses') {
    records = businesses
    tableHeaders = ['Name', 'Location']
  } else if (activeTab === 'Professionals') {
    records = professionals
    tableHeaders = ['Name', 'Location']
  } else if (activeTab === 'Opportunities') {
    records = opportunities
    tableHeaders = ['Title', 'Location']
  } else if (activeTab === 'Interactions') {
    records = interactions
    tableHeaders = ['Interaction ID', 'Type', 'Status']
  }

  const selectedRecordData = records.find(r => 
    String(r.id) === String(selectedRecordId) || 
    String(r.supplier_id) === String(selectedRecordId) || 
    String(r.interaction_id) === String(selectedRecordId) ||
    String(r.professional_id) === String(selectedRecordId) ||
    String(r.opportunity_id) === String(selectedRecordId)
  )

  return (
    <MainLayout showActivityPanel={false}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-8">
          <Database className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dataset Explorer</h1>
            <p className="text-sm text-muted-foreground">Query local records used by the AI agent</p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Records', value: suppliers.length + businesses.length + professionals.length + opportunities.length + interactions.length },
            { label: 'Suppliers', value: suppliers.length },
            { label: 'Businesses', value: businesses.length },
            { label: 'Professionals', value: professionals.length },
            { label: 'Interactions', value: interactions.length },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card border border-border rounded-lg p-4"
            >
              <p className="text-xs text-muted-foreground mb-2">{item.label}</p>
              <p className="text-2xl font-bold text-primary">{item.value.toLocaleString()}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-border pb-4">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab)
                    setSelectedRecordId(null)
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeTab === tab
                      ? 'bg-primary/20 text-primary border border-primary/50'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-black/20">
                      {tableHeaders.map((header, idx) => (
                        <th key={idx} className="text-left p-4 text-sm font-semibold text-foreground">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={tableHeaders.length} className="p-4 text-center text-muted-foreground">
                          Loading...
                        </td>
                      </tr>
                    ) : records.length === 0 ? (
                      <tr>
                        <td colSpan={tableHeaders.length} className="p-4 text-center text-muted-foreground">
                          No records available
                        </td>
                      </tr>
                    ) : (
                      records.map((record, idx) => {
                        const recordId = record.id || record.supplier_id || record.interaction_id || record.professional_id || record.opportunity_id
                        return (
                        <motion.tr
                          key={recordId}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => setSelectedRecordId(recordId)}
                          className="border-b border-border/30 hover:bg-primary/5 cursor-pointer transition-colors"
                        >
                          {activeTab === 'Interactions' ? (
                            <>
                              <td className="p-4 text-sm text-foreground font-medium">
                                {record.interaction_id || 'Not Available'}
                              </td>
                              <td className="p-4 text-sm text-foreground/70">
                                {record.interaction_type || 'Not Available'}
                              </td>
                              <td className="p-4 text-sm text-foreground/70">
                                {record.status || 'Not Available'}
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="p-4 text-sm text-foreground font-medium">
                                {record.company_name || record.name || record.title || 'Not Available'}
                              </td>
                              <td className="p-4 text-sm text-foreground/70">{record.location || 'Not Available'}</td>
                              {activeTab === 'Suppliers' && (
                                <>
                                  <td className="p-4 text-sm text-foreground/70">
                                    {record.production_capacity ? `${record.production_capacity.toLocaleString()}/mo` : 'Not Available'}
                                  </td>
                                  <td className="p-4 text-sm">
                                    <span className="text-yellow-400">★ {record.rating ?? 'N/A'}</span>
                                  </td>
                                </>
                              )}
                            </>
                          )}
                        </motion.tr>
                      )})
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div>
            {selectedRecordData ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card border border-border rounded-lg p-6 sticky top-20 max-h-[70vh] overflow-y-auto"
              >
                <h3 className="font-bold text-foreground mb-4">
                  {selectedRecordData.company_name || selectedRecordData.name || selectedRecordData.title || selectedRecordData.interaction_id || 'Not Available'}
                </h3>
                <div className="space-y-4 text-sm">
                  {Object.entries(selectedRecordData).map(([key, value], idx) => (
                    <div key={idx}>
                      <p className="text-muted-foreground mb-1 capitalize">
                        {key.replace(/_/g, ' ')}
                      </p>
                      {Array.isArray(value) ? (
                        <div className="flex flex-wrap gap-1">
                          {value.map((item, i) => (
                            typeof item === 'string' || typeof item === 'number' ? (
                              <Badge key={i} variant="success" className="text-xs">{String(item)}</Badge>
                            ) : (
                              <span key={i} className="text-foreground text-xs">{JSON.stringify(item)}</span>
                            )
                          ))}
                        </div>
                      ) : (
                        <p className="text-foreground">
                          {value === null ? 'Not Available' : String(value)}
                        </p>
                      )}
                    </div>
                  ))}
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground">
                      This record is part of the local dataset used by the AI agent.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-card/50 border border-border rounded-lg p-6 text-center sticky top-20">
                <p className="text-sm text-muted-foreground">Select a record to view details</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-8 text-center">
          All AI agent recommendations originate from this dataset. Records are queried, filtered by constraints, ranked by match score, and validated before recommendations.
        </p>
      </motion.div>
    </MainLayout>
  )
}
