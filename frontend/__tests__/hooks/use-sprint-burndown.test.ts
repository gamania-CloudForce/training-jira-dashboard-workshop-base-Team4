/**
 * useSprintBurndown Hook Unit Tests
 * 測試增強版 Sprint 燃盡圖資料獲取 Hook
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useSprintBurndown } from '@/hooks/use-sprint-burndown';

// Mock fetch function
global.fetch = jest.fn();

const mockEnhancedResponse = {
  sprint_info: {
    sprint_name: "Sprint 2024-09",
    total_story_points: 50.0,
    completed_story_points: 35.5,
    remaining_story_points: 14.5,
    total_working_days: 10,
    current_working_day: 7
  },
  health_status: {
    status: "warning",
    color: "#F59E0B",
    message: "Sprint 進度稍微落後",
    progress_ratio: 0.71
  },
  daily_progress: [
    {
      day: 1,
      date: "2024-09-01",
      ideal_remaining: 45.0,
      actual_remaining: 48.0,
      is_future: false
    },
    {
      day: 2,
      date: "2024-09-02", 
      ideal_remaining: 40.0,
      actual_remaining: 42.5,
      is_future: false
    },
    {
      day: 8,
      date: "2024-09-10",
      ideal_remaining: 10.0,
      actual_remaining: null,
      is_future: true
    }
  ]
};

describe('useSprintBurndown Hook', () => {
  
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('Enhanced API Usage', () => {
    it('should fetch enhanced burndown data successfully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEnhancedResponse
      });

      const { result } = renderHook(() => 
        useSprintBurndown({ 
          sprintName: 'Sprint 2024-09', 
          useEnhancedApi: true 
        })
      );

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.enhancedData).toEqual(mockEnhancedResponse);
      expect(result.current.sprintInfoEnhanced).toEqual(mockEnhancedResponse.sprint_info);
      expect(result.current.healthStatus).toEqual(mockEnhancedResponse.health_status);
      expect(result.current.dailyProgressEnhanced).toEqual(mockEnhancedResponse.daily_progress);
      expect(result.current.error).toBeNull();
    });

    it('should call correct enhanced API endpoint', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEnhancedResponse
      });

      renderHook(() => 
        useSprintBurndown({ 
          sprintName: 'Sprint 2024-09', 
          useEnhancedApi: true 
        })
      );

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:8001/api/dashboard/sprint-burndown/Sprint 2024-09'
        );
      });
    });

    it('should handle 404 error for non-existent sprint', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: "Sprint not found" })
      });

      const { result } = renderHook(() => 
        useSprintBurndown({ 
          sprintName: 'NonExistent Sprint', 
          useEnhancedApi: true 
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toContain('Sprint not found');
      expect(result.current.enhancedData).toBeNull();
    });

    it('should handle network errors gracefully', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => 
        useSprintBurndown({ 
          sprintName: 'Sprint 2024-09', 
          useEnhancedApi: true 
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toContain('Network error');
      expect(result.current.enhancedData).toBeNull();
    });
  });

  describe('Legacy API Usage', () => {
    const mockLegacyResponse = {
      sprint_data: {
        sprint_name: "Sprint 2024-09",
        total_story_points: 50.0,
        completed_story_points: 35.5,
        remaining_story_points: 14.5,
        completion_rate: 71,
        status: "warning" as const,
        total_working_days: 10,
        days_elapsed: 7,
        remaining_working_days: 3
      },
      daily_progress: [
        {
          day: 1,
          date: "2024-09-01",
          ideal_remaining: 45.0,
          actual_remaining: 48.0,
          is_working_day: true
        }
      ],
      chart_data: [
        {
          day: 1,
          date: "2024-09-01",
          ideal: 45.0,
          actual: 48.0
        }
      ]
    };

    it('should fetch legacy burndown data when useEnhancedApi=false', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockLegacyResponse
      }).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ sprint_name: "Sprint 2024-09", sprint_id: 123 })
      });

      const { result } = renderHook(() => 
        useSprintBurndown({ 
          sprintName: 'Sprint 2024-09', 
          useEnhancedApi: false 
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.burndownData).toEqual(mockLegacyResponse);
      expect(result.current.error).toBeNull();
    });

    it('should call legacy API endpoints when useEnhancedApi=false', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({})
      });

      renderHook(() => 
        useSprintBurndown({ 
          sprintName: 'Sprint 2024-09', 
          useEnhancedApi: false 
        })
      );

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:8001/api/sprint/burndown/Sprint%202024-09'
        );
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:8001/api/sprint/info/Sprint%202024-09'
        );
      });
    });
  });

  describe('Hook Configuration', () => {
    it('should not fetch when sprintName is undefined', () => {
      renderHook(() => 
        useSprintBurndown({ 
          sprintName: undefined, 
          useEnhancedApi: true 
        })
      );

      expect(fetch).not.toHaveBeenCalled();
    });

    it('should default to enhanced API when useEnhancedApi not specified', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEnhancedResponse
      });

      renderHook(() => 
        useSprintBurndown({ 
          sprintName: 'Sprint 2024-09'
        })
      );

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:8001/api/dashboard/sprint-burndown/Sprint%202024-09'
        );
      });
    });

    it('should refetch data when refetch is called', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockEnhancedResponse
      });

      const { result } = renderHook(() => 
        useSprintBurndown({ 
          sprintName: 'Sprint 2024-09', 
          useEnhancedApi: true 
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Clear previous calls
      (fetch as jest.Mock).mockClear();

      // Call refetch
      result.current.refetch();

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Loading States', () => {
    it('should set loading to true initially', () => {
      (fetch as jest.Mock).mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: async () => mockEnhancedResponse
        }), 100))
      );

      const { result } = renderHook(() => 
        useSprintBurndown({ 
          sprintName: 'Sprint 2024-09', 
          useEnhancedApi: true 
        })
      );

      expect(result.current.loading).toBe(true);
    });

    it('should set loading to false after successful fetch', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEnhancedResponse
      });

      const { result } = renderHook(() => 
        useSprintBurndown({ 
          sprintName: 'Sprint 2024-09', 
          useEnhancedApi: true 
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should set loading to false after error', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Test error'));

      const { result } = renderHook(() => 
        useSprintBurndown({ 
          sprintName: 'Sprint 2024-09', 
          useEnhancedApi: true 
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
    });
  });

  describe('Data Processing', () => {
    it('should process health status correctly', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEnhancedResponse
      });

      const { result } = renderHook(() => 
        useSprintBurndown({ 
          sprintName: 'Sprint 2024-09', 
          useEnhancedApi: true 
        })
      );

      await waitFor(() => {
        expect(result.current.healthStatus?.status).toBe('warning');
        expect(result.current.healthStatus?.color).toBe('#F59E0B');
        expect(result.current.healthStatus?.progress_ratio).toBe(0.71);
      });
    });

    it('should handle future dates in daily progress', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEnhancedResponse
      });

      const { result } = renderHook(() => 
        useSprintBurndown({ 
          sprintName: 'Sprint 2024-09', 
          useEnhancedApi: true 
        })
      );

      await waitFor(() => {
        const futureDays = result.current.dailyProgressEnhanced?.filter(day => day.is_future);
        expect(futureDays).toHaveLength(1);
        expect(futureDays?.[0].actual_remaining).toBe(null);
      });
    });
  });

  describe('API Response Validation', () => {
    it('should handle malformed response gracefully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ invalid: 'data' })
      });

      const { result } = renderHook(() => 
        useSprintBurndown({ 
          sprintName: 'Sprint 2024-09', 
          useEnhancedApi: true 
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Should handle invalid response without crashing
      expect(result.current.error).toBeTruthy();
    });

    it('should handle empty response gracefully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => null
      });

      const { result } = renderHook(() => 
        useSprintBurndown({ 
          sprintName: 'Sprint 2024-09', 
          useEnhancedApi: true 
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.enhancedData).toBe(null);
    });
  });
});
