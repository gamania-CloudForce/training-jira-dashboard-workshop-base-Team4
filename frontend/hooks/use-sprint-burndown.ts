import { useState, useEffect, useCallback } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Enhanced types for AC01-AC04 compliance
export interface HealthStatus {
  status: 'normal' | 'warning' | 'danger'
  color: string
  message: string
  progress_ratio: number
}

export interface SprintInfo {
  sprint_name: string
  total_working_days: number
  current_working_day: number
  total_story_points: number
  completed_story_points: number
  remaining_story_points: number
}

export interface DailyProgress {
  day: number
  date: string
  ideal_remaining: number
  actual_remaining: number | null  // AC04: null for future days
  is_working_day: boolean
  is_future: boolean
}

export interface SprintBurndownApiResponse {
  sprint_info: SprintInfo
  daily_progress: DailyProgress[]
  health_status: HealthStatus
}

// Legacy types for backward compatibility
export interface SprintBurndownData {
  sprint_name: string
  total_story_points: number
  completed_story_points: number
  remaining_story_points: number
  completion_rate: number
  status: 'normal' | 'warning' | 'danger'
  total_working_days: number
  days_elapsed: number
  remaining_working_days: number
}

export interface DayProgress {
  day: number
  date: string
  ideal_remaining: number
  actual_remaining: number
  is_working_day: boolean
}

export interface ChartDataPoint {
  day: number
  date: string
  ideal: number
  actual: number
}

export interface SprintBurndownResponse {
  sprint_data: SprintBurndownData
  daily_progress: DayProgress[]
  chart_data: ChartDataPoint[]
}

export interface SprintInfoDetails {
  sprint_name: string
  sprint_id: number
  board_name: string
  state: string
  start_date: string | null
  end_date: string | null
  complete_date: string | null
  goal: string
}

export interface UseSprintBurndownParams {
  sprintName?: string
  useEnhancedApi?: boolean  // Flag to choose between old and new API
}

export function useSprintBurndown(params: UseSprintBurndownParams = {}) {
  // Enhanced API states
  const [enhancedData, setEnhancedData] = useState<SprintBurndownApiResponse | null>(null)
  
  // Legacy API states (for backward compatibility)
  const [burndownData, setBurndownData] = useState<SprintBurndownResponse | null>(null)
  const [sprintInfo, setSprintInfo] = useState<SprintInfoDetails | null>(null)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { sprintName, useEnhancedApi = true } = params

  // Enhanced API fetch (AC01-AC04 compliant)
  const fetchEnhancedBurndownData = useCallback(async (sprint: string) => {
    if (!sprint || sprint === 'All') {
      setEnhancedData(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const encodedSprintName = encodeURIComponent(sprint)
      const response = await fetch(`${API_BASE_URL}/api/dashboard/sprint-burndown/${encodedSprintName}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Sprint "${sprint}" not found`)
        }
        throw new Error(`Failed to fetch sprint burndown data: ${response.status} ${response.statusText}`)
      }
      
      const data: SprintBurndownApiResponse = await response.json()
      setEnhancedData(data)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      setEnhancedData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // Legacy API fetch (for backward compatibility)
  const fetchLegacyBurndownData = useCallback(async (sprint: string) => {
    if (!sprint || sprint === 'All') {
      setBurndownData(null)
      setSprintInfo(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const encodedSprintName = encodeURIComponent(sprint)
      
      // Fetch burndown data
      const burndownResponse = await fetch(`${API_BASE_URL}/api/sprint/burndown/${encodedSprintName}`)
      if (!burndownResponse.ok) {
        if (burndownResponse.status === 404) {
          throw new Error(`Sprint "${sprint}" not found`)
        }
        throw new Error('Failed to fetch sprint burndown data')
      }
      const burndownData = await burndownResponse.json()
      setBurndownData(burndownData)

      // Fetch sprint info
      const infoResponse = await fetch(`${API_BASE_URL}/api/sprint/info/${encodedSprintName}`)
      if (infoResponse.ok) {
        const infoData = await infoResponse.json()
        setSprintInfo(infoData)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      setBurndownData(null)
      setSprintInfo(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch data when sprint name changes
  useEffect(() => {
    if (sprintName) {
      if (useEnhancedApi) {
        fetchEnhancedBurndownData(sprintName)
      } else {
        fetchLegacyBurndownData(sprintName)
      }
    } else {
      setEnhancedData(null)
      setBurndownData(null)
      setSprintInfo(null)
      setLoading(false)
    }
  }, [sprintName, useEnhancedApi, fetchEnhancedBurndownData, fetchLegacyBurndownData])

  // Refetch function for manual refresh
  const refetch = useCallback(() => {
    if (sprintName) {
      if (useEnhancedApi) {
        fetchEnhancedBurndownData(sprintName)
      } else {
        fetchLegacyBurndownData(sprintName)
      }
    }
  }, [sprintName, useEnhancedApi, fetchEnhancedBurndownData, fetchLegacyBurndownData])

  // Return enhanced data if using new API, otherwise legacy data
  return {
    // Enhanced API data
    enhancedData,
    healthStatus: enhancedData?.health_status,
    sprintInfoEnhanced: enhancedData?.sprint_info,
    dailyProgressEnhanced: enhancedData?.daily_progress,
    
    // Legacy API data (for backward compatibility)
    burndownData,
    sprintInfo,
    
    // Common states
    loading,
    error,
    refetch,
    
    // Helper to determine which API is being used
    isUsingEnhancedApi: useEnhancedApi
  }
}
