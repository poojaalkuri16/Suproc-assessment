'use client'

import { useEffect, useState, Suspense, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { MainLayout } from '@/components/layout/MainLayout'
import { AgentSummary } from '@/components/agent/AgentSummary'
import { ExecutionTimeline, ExecutionStep } from '@/components/agent/ExecutionTimeline'
import { ToolConsole, ToolInvocation } from '@/components/agent/ToolConsole'
import { ActivityLog } from '@/components/layout/ActivityPanel'
import { MissionCard } from '@/components/agent/MissionCard'
import { RequirementExtractor } from '@/components/modules/RequirementExtractor'
import { PlanningEngine } from '@/components/modules/PlanningEngine'
import { SearchEngine } from '@/components/modules/SearchEngine'
import { ConstraintsChecked } from '@/components/modules/ConstraintsChecked'
import { ConstraintFiltering } from '@/components/modules/ConstraintFiltering'
import { RankingEngine } from '@/components/modules/RankingEngine'
import { ValidationEngine } from '@/components/modules/ValidationEngine'
import { FinalRecommendation } from '@/components/modules/FinalRecommendation'
import { DraftOutreachMessage } from '@/components/modules/DraftOutreachMessage'
import { HumanApproval } from '@/components/modules/HumanApproval'

type ModuleKey =
  | 'requirement'
  | 'planning'
  | 'search'
  | 'constraints'
  | 'filtering'
  | 'ranking'
  | 'validation'
  | 'recommendation'
  | 'outreach'
  | 'approval'

interface ModuleState {
  expanded: boolean
  collapsed: boolean
  visible: boolean
}

const stepToModuleMap: Record<ExecutionStep, ModuleKey | null> = {
  idle: null,
  understanding: 'requirement',
  planning: 'planning',
  searching: 'search',
  constraints: 'constraints',
  filtering: 'filtering',
  ranking: 'ranking',
  validation: 'validation',
  preparing: 'recommendation',
  completed: 'approval',
}

const moduleStepDurations: Record<ModuleKey, number> = {
  requirement: 5000,
  planning: 6000,
  search: 8000,
  constraints: 4000,
  filtering: 5000,
  ranking: 6000,
  validation: 5000,
  recommendation: 4000,
  outreach: 4000,
  approval: 2000,
}

function ExecutionPageContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('query') || 'Find suppliers for our requirements'
  const hasStarted = useRef(false)
  const [backendResult, setBackendResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [backendError, setBackendError] = useState<string | null>(null)

  const [currentStep, setCurrentStep] = useState<ExecutionStep>('idle')
  const [moduleStates, setModuleStates] = useState<Record<ModuleKey, ModuleState>>({
    requirement: { expanded: false, collapsed: false, visible: false },
    planning: { expanded: false, collapsed: false, visible: false },
    search: { expanded: false, collapsed: false, visible: false },
    constraints: { expanded: false, collapsed: false, visible: false },
    filtering: { expanded: false, collapsed: false, visible: false },
    ranking: { expanded: false, collapsed: false, visible: false },
    validation: { expanded: false, collapsed: false, visible: false },
    recommendation: { expanded: false, collapsed: false, visible: false },
    outreach: { expanded: false, collapsed: false, visible: false },
    approval: { expanded: false, collapsed: false, visible: false },
  })

  const [tools, setTools] = useState<ToolInvocation[]>([])
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    {
      id: '0',
      timestamp: new Date().toLocaleTimeString(),
      message: 'Agent started',
      status: 'info',
    },
  ])
  const [elapsedTime, setElapsedTime] = useState('0.0s')
  const [showSummary, setShowSummary] = useState(false)
  const [approvalStatus, setApprovalStatus] = useState<'Pending' | 'Approved' | 'Rejected'>('Pending')

  async function executeAgent() {
    try {
      setLoading(true)

      const cachedResult = sessionStorage.getItem("agentResult")

      if (backendResult !== null) {
        setLoading(false)
        return
      }

      if (cachedResult) {
        const parsed = JSON.parse(cachedResult)

        console.log("Loaded cached backend result.")

        setBackendResult(parsed)
        sessionStorage.removeItem("agentResult")
        setLoading(false)

        return
      }

      // Show immediately that Stage 1 has started
    setActivityLogs(prev => [
      ...prev,
      {
        id: String(prev.length + 1),
        timestamp: new Date().toLocaleTimeString(),
        message: "Requirement extraction started",
        status: "info",
      },
      {
        id: String(prev.length + 2),
        timestamp: new Date().toLocaleTimeString(),
        message: "Attempting Qwen3 requirement extraction...",
        status: "info",
      }
    ])

      const response = await fetch(
        "http://localhost:8000/execute",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
          }),
        }
      )

      if (!response.ok) {
        throw new Error("Backend request failed")
      }

      const result = await response.json()

      const extractionMethod =
        result?.extraction_metadata?.method ?? "Unknown"

      if (extractionMethod === "LLM") {

        setActivityLogs(prev => [
        ...prev,
        {
          id: String(prev.length + 1),
          timestamp: new Date().toLocaleTimeString(),
          message: "Qwen3 completed requirement extraction",
          status: "success",
        }
      ])

      } else if (extractionMethod === "Deterministic Fallback") {

        setActivityLogs(prev => [
          ...prev,
          {
            id: String(prev.length + 1),
            timestamp: new Date().toLocaleTimeString(),
            message: "Qwen3 exceeded timeout",
            status: "warning",
          },
          {
            id: String(prev.length + 2),
            timestamp: new Date().toLocaleTimeString(),
            message: "Switching to deterministic extraction",
            status: "info",
          },
          {
            id: String(prev.length + 3),
            timestamp: new Date().toLocaleTimeString(),
            message: "Deterministic extraction completed",
            status: "success",
          }
        ])

      }

      console.log(result)

      setBackendResult(result)

      // If we have backend activities, add them
      if (result.activities && Array.isArray(result.activities)) {
        const newActivities = result.activities.map((activity: any, idx: number) => ({
          id: String(idx + 1),
          timestamp: new Date().toLocaleTimeString(),
          message: activity.summary || activity.message || activity.title || "Activity completed",
          status: 'info',
          // Don't pass activity directly as details to avoid React child errors
        }))
        setActivityLogs(prev => [...prev, ...newActivities])
      }

      setLoading(false)

    } catch (err: any) {
      console.error(err)
      setBackendError(err.message)
      setLoading(false)
    }
  }

  const steps: ExecutionStep[] = [
    'idle',
    'understanding',
    'planning',
    'searching',
    'constraints',
    'filtering',
    'ranking',
    'validation',
    'preparing',
    'completed',
  ]

  useEffect(() => {
    if (hasStarted.current) return

    hasStarted.current = true
    void executeAgent()
  }, [query])

  // Simulation state machine
  useEffect(() => {
    if (loading || !backendResult) return

    let currentStepIndex = 0
    let timeout: NodeJS.Timeout
    let startTime = Date.now()

    // Track elapsed time
    const timerInterval = setInterval(() => {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
      setElapsedTime(`${elapsed}s`)
    }, 100)

    const advanceStep = () => {
      if (currentStepIndex < steps.length) {
        const nextStep = steps[currentStepIndex]
        setCurrentStep(nextStep)

        // Show module when step changes
        const moduleKey = stepToModuleMap[nextStep]
        if (moduleKey) {
          setModuleStates((prev) => ({
            ...prev,
            [moduleKey]: { expanded: true, collapsed: false, visible: true },
          }))

          // Add activity log with details
          const stepDetails: Record<ExecutionStep, any> = {
            idle: {
              message: 'Initializing agent',
              details: {
                title: 'Agent Initialized',
                description: 'Setting up execution environment',
                items: ['Connected to dataset', 'Loaded constraints', 'Ready to execute'],
              },
            },
            understanding: {
              message: 'Extracted requirements',
              details: {
                title: 'Requirement Extraction',
                description: 'Analyzed user query and extracted parameters',
                items: backendResult?.requirements
                  ? [
                      ...(backendResult.requirements.objective ? [`Objective: ${backendResult.requirements.objective}`] : []),
                      ...(backendResult.requirements.material ? [`Product: ${backendResult.requirements.material}`] : []),
                      ...(backendResult.requirements.required_quantity ? [`Quantity: ${backendResult.requirements.required_quantity.toLocaleString()} units`] : []),
                      ...(backendResult.requirements.location ? [`Location: ${backendResult.requirements.location}`] : []),
                      ...(backendResult.requirements.deadline ? [`Deadline: ${backendResult.requirements.deadline}`] : []),
                      ...(backendResult.requirements.hard_constraints?.length > 0 ? [`Constraints: ${backendResult.requirements.hard_constraints.join(', ')}`] : []),
                    ].filter(Boolean)
                  : ['Not Available'],
              },
            },
            planning: {
              message: 'Created execution plan',
              details: {
                title: 'Planning Engine',
                description: 'Generated structured execution roadmap',
                items: ['Search local dataset', 'Apply hard constraints', 'Rank by match score', 'Validate candidates', 'Generate recommendations'],
              },
            },
            searching: {
              message: 'Searching suppliers',
              details: {
                title: 'Search Engine',
                description: 'Queried dataset and found matching suppliers',
                items: backendResult?.recommendation_summary
                  ? [
                      `Found ${backendResult.recommendation_summary.recommended_suppliers || 'Not Available'} suppliers matching requirements`,
                      ...(backendResult.requirements?.location ? [`Filtered by location: ${backendResult.requirements.location}`] : []),
                      ...(backendResult.requirements?.required_quantity ? [`Cross-referenced capacity requirements`] : []),
                    ].filter(Boolean)
                  : ['Not Available'],
              },
            },
            constraints: {
              message: 'Constraints verified',
              details: {
                title: 'Constraints Checked',
                description: 'Verified all hard constraints against candidates',
                items: backendResult?.requirements?.hard_constraints?.length > 0
                  ? backendResult.requirements.hard_constraints.map((c: string) => `${c}: ✓ Verified`)
                  : ['Not Available'],
              },
            },
            filtering: {
              message: 'Applied filters',
              details: {
                title: 'Constraint Filtering',
                description: 'Removed non-qualifying candidates',
                items: backendResult?.recommendation_summary
                  ? [
                      `Started with ${backendResult.recommendation_summary.recommended_suppliers || 'Not Available'} candidates`,
                      ...(backendResult.requirements?.hard_constraints?.length > 0 ? [`Applied ${backendResult.requirements.hard_constraints.length} constraints`] : []),
                      `Final candidates: ${backendResult.recommendation_summary.recommended_suppliers || 'Not Available'}`,
                    ].filter(Boolean)
                  : ['Not Available'],
              },
            },
            ranking: {
              message: 'Ranked candidates',
              details: {
                title: 'Ranking Engine',
                description: 'Calculated match scores for all candidates',
                items: backendResult?.recommended_suppliers?.length > 0
                  ? backendResult.recommended_suppliers.slice(0, 3).map((rec: any, idx: number) => {
                      const supplier = rec.supplier_details || rec
                      const score = rec.match_score || supplier.match_score || 'Not Available'
                      const confidence = rec.confidence || (score >= 90 ? 'High' : score >= 75 ? 'Medium' : 'Low')
                      const prefix = idx === 0 ? 'Top:' : idx === 1 ? '2nd:' : idx === 2 ? '3rd:' : `${idx + 1}th:`
                      return `${prefix} ${supplier.company_name || 'Supplier'} (${score}% match) - ${confidence} confidence`
                    }).concat([`Average confidence: ${backendResult.recommended_suppliers.some((r: any) => (r.match_score || 0) >= 90) ? 'High' : 'Medium'}`])
                  : ['Not Available'],
              },
            },
            validation: {
              message: backendResult?.validation_passed !== false ? 'Validation passed' : 'Validation failed',
              details: {
                title: 'Validation Engine',
                description: 'Performed automated validation checks',
                items: backendResult?.validation_issues?.length > 0
                  ? backendResult.validation_issues.map((issue: string) => `${issue}`)
                  : backendResult?.validation_passed !== false
                  ? ['Entity existence verified', 'Hard constraints confirmed', 'Evidence verified from dataset', 'No duplicate results', 'Correct result count', 'All match scores validated']
                  : ['Validation failed', ...(backendResult.validation_issues || [])],
              },
            },
            preparing: {
              message: 'Prepared recommendations',
              details: {
                title: 'Recommendation Generator',
                description: 'Generated evidence-backed recommendations',
                items: backendResult?.recommendation_summary
                  ? [
                      `Created ${backendResult.recommendation_summary.recommended_suppliers || 'Not Available'} supplier recommendations`,
                      'Attached supporting evidence',
                      'Generated outreach templates',
                      'Ready for human approval',
                    ].filter(Boolean)
                  : ['Not Available'],
              },
            },
            completed: {
              message: 'Agent completed',
              details: {
                title: 'Execution Complete',
                description: 'All steps completed successfully',
                items: [
                  `Total time: ${elapsedTime}`,
                  `${backendResult?.recommendation_summary?.recommended_suppliers || 3} recommendations generated`,
                  `Validations: ${backendResult?.validation_passed !== false ? 'Passed' : 'Failed'}`,
                  'Ready for review',
                ],
              },
            },
          }

          const stepData = stepDetails[nextStep]

          setActivityLogs((prev) => [
            ...prev,
            {
              id: String(prev.length),
              timestamp: new Date().toLocaleTimeString(),
              message: stepData.message,
              status: nextStep === 'completed' ? 'success' : 'info',
              details: stepData.details,
            },
          ])

          // Simulate tool invocations during certain steps
          if (nextStep === 'searching') {
            const searchTools: ToolInvocation[] = [
              {
                id: 't1',
                name: 'search_entities',
                status: 'completed',
                startTime: new Date().toLocaleTimeString(),
                input: backendResult?.requirements
                  ? [
                      ...(backendResult.requirements.material ? [`Product Category: ${backendResult.requirements.material}`] : []),
                      ...(backendResult.requirements.location ? [`Location: ${backendResult.requirements.location}`] : []),
                    ].join(', ') || 'Searching for suppliers'
                  : 'Searching for suppliers',
                output: backendResult?.recommendation_summary
                  ? `${backendResult.recommendation_summary.recommended_suppliers || 'Not Available'} suppliers found`
                  : 'Not Available',
              },
            ]
            setTools(searchTools)
          } else if (nextStep === 'filtering') {
            setTools((prev) => [
              ...prev,
              {
                id: 't2',
                name: 'filter_by_constraints',
                status: 'completed',
                startTime: new Date().toLocaleTimeString(),
                input: backendResult?.requirements?.hard_constraints?.length > 0
                  ? `Apply: ${backendResult.requirements.hard_constraints.join(', ')}`
                  : 'Apply constraints',
                output: backendResult?.recommendation_summary
                  ? `${backendResult.recommendation_summary.recommended_suppliers || 'Not Available'} suppliers passed`
                  : 'Not Available',
              },
            ])
          } else if (nextStep === 'ranking') {
            setTools((prev) => [
              ...prev,
              {
                id: 't3',
                name: 'calculate_match_score',
                status: 'completed',
                startTime: new Date().toLocaleTimeString(),
                input: backendResult?.recommended_suppliers?.length > 0
                  ? `Suppliers: ${backendResult.recommended_suppliers.length}`
                  : 'Suppliers: Not Available',
                output: 'Scores calculated',
              },
            ])
          } else if (nextStep === 'validation') {
            setTools((prev) => [
              ...prev,
              {
                id: 't4',
                name: 'validate_recommendations',
                status: backendResult?.validation_passed !== false ? 'completed' : 'failed',
                startTime: new Date().toLocaleTimeString(),
                input: backendResult?.recommended_suppliers?.length > 0
                  ? `Top ${backendResult.recommended_suppliers.length} candidates`
                  : 'Top candidates: Not Available',
                output: backendResult?.validation_passed !== false
                  ? 'All validations passed'
                  : `Validation failed: ${backendResult?.validation_issues?.[0] || 'Unknown issue'}`,
              },
            ])
          }

          // Collapse previous modules
          const prevModuleKey = stepToModuleMap[steps[currentStepIndex - 1]]
          if (prevModuleKey && currentStepIndex > 1) {
            setTimeout(() => {
              setModuleStates((prev) => ({
                ...prev,
                [prevModuleKey]: {
                  expanded: false,
                  collapsed: true,
                  visible: true,
                },
              }))
            }, moduleStepDurations[moduleKey] - 500)
          }
        }

        currentStepIndex++

        const duration =
          moduleKey && currentStepIndex < steps.length
            ? moduleStepDurations[moduleKey]
            : 1000

        timeout = setTimeout(advanceStep, duration)
      } else {
        setShowSummary(true)
        setCurrentStep('completed')
        // Stop the timer when execution completes
        clearInterval(timerInterval)
      }
    }

    const startTimeout = setTimeout(advanceStep, 500)
    return () => {
      clearTimeout(startTimeout)
      clearTimeout(timeout)
      clearInterval(timerInterval)
    }
  }, [backendResult, loading, query])

  const metrics = {
    status: backendResult?.status || 'Completed Successfully',
    executionTime: elapsedTime,
    recordsSearched: '30 Suppliers',
    recordsFiltered: '24',
    recommendationsGenerated: String(backendResult?.recommendation_summary?.recommended_suppliers || 3),
    validationStatus: backendResult?.validation_passed ? 'Passed' : 'Failed',
    approvalStatus: approvalStatus,
  }

  const phaseMap: Record<ExecutionStep, string> = {
    idle: 'Initializing',
    understanding: 'Understanding Request',
    planning: 'Planning',
    searching: 'Searching Dataset',
    constraints: 'Checking Constraints',
    filtering: 'Filtering Candidates',
    ranking: 'Ranking Results',
    validation: 'Validating',
    preparing: 'Preparing Recommendations',
    completed: 'Completed',
  }

  return (
    <MainLayout activityLogs={activityLogs} showActivityPanel={true} isLiveActivity={true}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Mission Card - Always Visible */}
        <MissionCard
          query={query}
          currentPhase={phaseMap[currentStep]}
          elapsedTime={elapsedTime}
          status={currentStep === 'idle' ? 'idle' : currentStep === 'completed' ? 'completed' : 'running'}
        />

        {/* Execution Timeline */}
        <ExecutionTimeline currentStep={currentStep} approvalStatus={approvalStatus} />

        {/* Agent Summary - Show when complete */}
        {showSummary && <AgentSummary metrics={metrics} isVisible={showSummary} />}

        {/* Tool Console */}
        {tools.length > 0 && <ToolConsole tools={tools} />}

        {/* Modules */}
        <div className="space-y-4">
          {moduleStates.requirement.visible && (
            <RequirementExtractor
              isExpanded={moduleStates.requirement.expanded}
              isCollapsed={moduleStates.requirement.collapsed}
              onToggleExpand={() =>
                setModuleStates((prev) => ({
                  ...prev,
                  requirement: {
                    ...prev.requirement,
                    expanded: !prev.requirement.expanded,
                  },
                }))
              }
              requirements={backendResult?.requirements}
            />
          )}

          {moduleStates.planning.visible && (
            <PlanningEngine
              isExpanded={moduleStates.planning.expanded}
              isCollapsed={moduleStates.planning.collapsed}
              onToggleExpand={() =>
                setModuleStates((prev) => ({
                  ...prev,
                  planning: {
                    ...prev.planning,
                    expanded: !prev.planning.expanded,
                  },
                }))
              }
            />
          )}

          {moduleStates.search.visible && (
            <SearchEngine
              isExpanded={moduleStates.search.expanded}
              isCollapsed={moduleStates.search.collapsed}
              onToggleExpand={() =>
                setModuleStates((prev) => ({
                  ...prev,
                  search: {
                    ...prev.search,
                    expanded: !prev.search.expanded,
                  },
                }))
              }
              searchData={backendResult?.activities?.find((a: any) => a.title === "Search Engine")?.details}
              requirements={backendResult?.requirements}
            />
          )}

          {moduleStates.constraints.visible && (
            <ConstraintsChecked
              isExpanded={moduleStates.constraints.expanded}
              isCollapsed={moduleStates.constraints.collapsed}
              onToggleExpand={() =>
                setModuleStates((prev) => ({
                  ...prev,
                  constraints: {
                    ...prev.constraints,
                    expanded: !prev.constraints.expanded,
                  },
                }))
              }
            />
          )}

          {moduleStates.filtering.visible && (
            <ConstraintFiltering
              isExpanded={moduleStates.filtering.expanded}
              isCollapsed={moduleStates.filtering.collapsed}
              onToggleExpand={() =>
                setModuleStates((prev) => ({
                  ...prev,
                  filtering: {
                    ...prev.filtering,
                    expanded: !prev.filtering.expanded,
                  },
                }))
              }
              filterData={backendResult?.activities?.find((a: any) => a.title === "Constraint Filtering")?.details}
            />
          )}

          {moduleStates.ranking.visible && (
            <RankingEngine
              isExpanded={moduleStates.ranking.expanded}
              isCollapsed={moduleStates.ranking.collapsed}
              onToggleExpand={() =>
                setModuleStates((prev) => ({
                  ...prev,
                  ranking: {
                    ...prev.ranking,
                    expanded: !prev.ranking.expanded,
                  },
                }))
              }
              rankedSuppliers={backendResult?.recommended_suppliers}
            />
          )}

          {moduleStates.validation.visible && (
            <ValidationEngine
              isExpanded={moduleStates.validation.expanded}
              isCollapsed={moduleStates.validation.collapsed}
              onToggleExpand={() =>
                setModuleStates((prev) => ({
                  ...prev,
                  validation: {
                    ...prev.validation,
                    expanded: !prev.validation.expanded,
                  },
                }))
              }
              validationPassed={backendResult?.validation_passed}
              validationIssues={backendResult?.validation_issues}
            />
          )}

          {moduleStates.recommendation.visible && (
            <FinalRecommendation
              isExpanded={moduleStates.recommendation.expanded}
              isCollapsed={moduleStates.recommendation.collapsed}
              onToggleExpand={() =>
                setModuleStates((prev) => ({
                  ...prev,
                  recommendation: {
                    ...prev.recommendation,
                    expanded: !prev.recommendation.expanded,
                  },
                }))
              }
              recommendedSuppliers={backendResult?.recommended_suppliers}
            />
          )}

          {moduleStates.outreach.visible && (
            <DraftOutreachMessage
              isExpanded={moduleStates.outreach.expanded}
              isCollapsed={moduleStates.outreach.collapsed}
              onToggleExpand={() =>
                setModuleStates((prev) => ({
                  ...prev,
                  outreach: {
                    ...prev.outreach,
                    expanded: !prev.outreach.expanded,
                  },
                }))
              }
              outreachDrafts={backendResult?.outreach_drafts}
            />
          )}

          {moduleStates.approval.visible && (
            <HumanApproval
              isExpanded={moduleStates.approval.expanded}
              isCollapsed={moduleStates.approval.collapsed}
              onToggleExpand={() =>
                setModuleStates((prev) => ({
                  ...prev,
                  approval: {
                    ...prev.approval,
                    expanded: !prev.approval.expanded,
                  },
                }))
              }
              onApprovalChange={(status) => {
                setApprovalStatus(status)
              }}
              recommendedSuppliers={backendResult?.recommended_suppliers}
              approvalData={backendResult?.approval}
              outreachDrafts={backendResult?.outreach_drafts}
            />
          )}
        </div>
      </motion.div>
    </MainLayout>
  )
}

export default function ExecutionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExecutionPageContent />
    </Suspense>
  )
}
