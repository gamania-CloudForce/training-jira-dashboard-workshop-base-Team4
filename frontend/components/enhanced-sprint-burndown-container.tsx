"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSprintBurndown } from "@/hooks/use-sprint-burndown";
import { BurndownChart } from "./burndown-chart";

interface EnhancedSprintBurndownContainerProps {
  selectedSprint: string;
  className?: string;
}

/**
 * 增強版 Sprint 燃盡圖容器組件
 * 符合 AC01-AC04 完整規格要求
 */
export function EnhancedSprintBurndownContainer({ 
  selectedSprint, 
  className 
}: EnhancedSprintBurndownContainerProps) {
  const { 
    enhancedData,
    healthStatus,
    sprintInfoEnhanced,
    dailyProgressEnhanced,
    loading, 
    error, 
    refetch 
  } = useSprintBurndown({
    sprintName: selectedSprint === 'All' ? undefined : selectedSprint,
    useEnhancedApi: true  // 使用增強版 API
  });

  // 如果選擇 "All" 或未選擇 Sprint，顯示提示
  if (!selectedSprint || selectedSprint === 'All') {
    return (
      <div className={className}>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sprint 燃盡圖分析</h3>
            <p className="text-muted-foreground text-center max-w-md">
              請選擇一個特定的 Sprint 來查看燃盡圖分析、健康狀態和警示資訊
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 載入狀態
  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <EnhancedLoadingSkeleton />
      </div>
    );
  }

  // 錯誤狀態
  if (error) {
    return (
      <div className={className}>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-red-600 mb-4">
              <BarChart3 className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-red-800">載入失敗</h3>
            <p className="text-red-600 text-center max-w-md mb-4">{error}</p>
            <Button 
              variant="outline" 
              onClick={refetch}
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              重試
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 無資料狀態
  if (!enhancedData || !healthStatus || !sprintInfoEnhanced) {
    return (
      <div className={className}>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">無可用資料</h3>
            <p className="text-muted-foreground text-center max-w-md">
              目前選擇的 Sprint "{selectedSprint}" 沒有可用的燃盡圖資料
            </p>
            <Button 
              variant="outline" 
              onClick={refetch}
              className="mt-4"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              重新載入
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 計算完成率
  const completionPercentage = sprintInfoEnhanced.total_story_points > 0 
    ? Math.round((sprintInfoEnhanced.completed_story_points / sprintInfoEnhanced.total_story_points) * 100)
    : 0;

  // 轉換資料供燃盡圖使用
  const chartData = dailyProgressEnhanced?.map(day => ({
    day: day.day,
    date: day.date,
    ideal: day.ideal_remaining,
    actual: day.actual_remaining ?? 0  // 將 null 轉為 0 以供圖表顯示
  })) || [];

  const legacySprintData = {
    sprint_name: sprintInfoEnhanced.sprint_name,
    total_story_points: sprintInfoEnhanced.total_story_points,
    completed_story_points: sprintInfoEnhanced.completed_story_points,
    remaining_story_points: sprintInfoEnhanced.remaining_story_points,
    completion_rate: completionPercentage,
    status: healthStatus.status,
    total_working_days: sprintInfoEnhanced.total_working_days,
    days_elapsed: sprintInfoEnhanced.current_working_day,
    remaining_working_days: sprintInfoEnhanced.total_working_days - sprintInfoEnhanced.current_working_day
  };

  // 健康狀態顏色
  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'danger': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // 健康狀態文字
  const getHealthStatusText = (status: string) => {
    switch (status) {
      case 'normal': return '正常';
      case 'warning': return '注意';
      case 'danger': return '危險';
      default: return '未知';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 健康狀態警示 */}
      {healthStatus.status !== 'normal' && (
        <div className={`p-4 rounded-lg border ${
          healthStatus.status === 'warning' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start">
            <div className={`mt-0.5 ${
              healthStatus.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {healthStatus.status === 'warning' ? '⚠️' : '🚨'}
            </div>
            <div className="ml-3">
              <p className={`font-medium ${
                healthStatus.status === 'warning' ? 'text-yellow-800' : 'text-red-800'
              }`}>
                {healthStatus.status === 'warning' 
                  ? 'Sprint 進度稍微落後' 
                  : 'Sprint 進度嚴重落後！'
                }
              </p>
              <p className={`text-sm mt-1 ${
                healthStatus.status === 'warning' ? 'text-yellow-700' : 'text-red-700'
              }`}>
                {healthStatus.status === 'warning' 
                  ? '建議檢視是否有阻礙因素影響團隊velocity'
                  : '建議立即召集團隊討論並採取行動'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sprint 概要卡片 */}
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* 標題與健康狀態 */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {sprintInfoEnhanced.sprint_name}
              </h3>
              <p className="text-sm text-muted-foreground">
                Day {sprintInfoEnhanced.current_working_day} / {sprintInfoEnhanced.total_working_days}
                {" "}• 剩餘 {sprintInfoEnhanced.total_working_days - sprintInfoEnhanced.current_working_day} 個工作日
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthStatusColor(healthStatus.status)}`}>
                {getHealthStatusText(healthStatus.status)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={refetch}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="sr-only">重新整理</span>
              </Button>
            </div>
          </div>

          {/* 簡化進度條 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">完成進度</span>
              <span className="text-2xl font-bold text-gray-900">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  healthStatus.status === 'normal' ? 'bg-green-500' :
                  healthStatus.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* 故事點數統計 */}
          <div className="grid grid-cols-3 gap-6 pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {sprintInfoEnhanced.completed_story_points.toFixed(1)}
              </p>
              <p className="text-sm text-muted-foreground">已完成 SP</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {sprintInfoEnhanced.remaining_story_points.toFixed(1)}
              </p>
              <p className="text-sm text-muted-foreground">剩餘 SP</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {sprintInfoEnhanced.total_story_points.toFixed(1)}
              </p>
              <p className="text-sm text-muted-foreground">總計 SP</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 燃盡圖 */}
      <BurndownChart 
        chartData={chartData}
        sprintData={legacySprintData}
      />
    </div>
  );
}

// 增強版載入骨架組件
function EnhancedLoadingSkeleton() {
  return (
    <>
      {/* 警示區域骨架 */}
      <div className="space-y-3">
        <Skeleton className="h-16 w-full rounded-lg" />
      </div>

      {/* Sprint 概要卡片骨架 */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* 標題與健康狀態 */}
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>

            {/* 進度條骨架 */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-3 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>

            {/* 故事點數統計骨架 */}
            <div className="grid grid-cols-3 gap-6 pt-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="text-center space-y-2">
                  <Skeleton className="h-8 w-16 mx-auto" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 燃盡圖骨架 */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-32" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <Skeleton className="h-80 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
