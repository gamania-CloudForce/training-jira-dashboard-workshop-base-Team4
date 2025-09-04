import { useState, useEffect, useCallback } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

export interface TableColumn {
  name: string
  type: string
}

export interface TableSummary {
  sheetId: string
  sheetName: string
  totalRows: number
  totalColumns: number
  columns: TableColumn[]
  lastUpdated: string
}

export interface TableRow {
  [key: string]: any  // 動態欄位，可以接受任何欄位名稱和值
}

export interface PaginationInfo {
  currentPage: number
  pageSize: number
  totalPages: number
  totalRecords: number
  hasNext: boolean
  hasPrev: boolean
}

export interface TableDataResponse {
  data: TableRow[]
  pagination: PaginationInfo
}

export interface UseGoogleSheetsParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  sprint?: string
}

export function useGoogleSheets(params: UseGoogleSheetsParams = {}) {
  const [data, setData] = useState<TableRow[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [summary, setSummary] = useState<TableSummary | null>(null)
  const [sprintOptions, setSprintOptions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    page = 1,
    pageSize = 100,
    sortBy = 'Key',
    sortOrder = 'asc',
    sprint
  } = params

  // Fetch table summary
  const fetchSummary = useCallback(async () => {
    try {
      console.log('Fetching summary from:', `${API_BASE_URL}/api/table/summary`)
      const response = await fetch(`${API_BASE_URL}/api/table/summary`)
      console.log('Summary response status:', response.status)
      if (!response.ok) throw new Error(`Failed to fetch table summary: ${response.status} ${response.statusText}`)
      const data = await response.json()
      console.log('Summary data:', data)
      setSummary(data)
    } catch (err) {
      console.error('Error fetching summary:', err)
      throw err
    }
  }, [])

  // Fetch sprint options
  const fetchSprintOptions = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/table/sprints`)
      if (!response.ok) throw new Error('Failed to fetch sprint options')
      const data = await response.json()
      setSprintOptions(data.sprints || [])
    } catch (err) {
      console.error('Error fetching sprint options:', err)
    }
  }, [])

  // Fetch table data
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        sort_by: sortBy,
        sort_order: sortOrder,
      })

      if (sprint) {
        queryParams.append('sprint', sprint)
      }


      const url = `${API_BASE_URL}/api/table/data?${queryParams}`
      console.log('Fetching data from:', url)
      const response = await fetch(url)
      console.log('Data response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`)
      }

      const result: TableDataResponse = await response.json()
      setData(result.data)
      setPagination(result.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, sortBy, sortOrder, sprint])

  // Initial load
  useEffect(() => {
    fetchSummary()
    fetchSprintOptions()
  }, [fetchSummary, fetchSprintOptions])

  // Fetch data when params change
  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = () => {
    fetchData()
  }

  return {
    data,
    pagination,
    summary,
    sprintOptions,
    loading,
    error,
    refetch
  }
}