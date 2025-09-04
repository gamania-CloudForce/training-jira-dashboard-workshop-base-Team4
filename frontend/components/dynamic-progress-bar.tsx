"use client"

import React from "react"
import { cn } from "@/lib/utils"
import type { HealthStatus } from "./health-status-badge"

interface DynamicProgressBarProps {
  percentage: number
  healthStatus: HealthStatus
  animated?: boolean
  height?: 'sm' | 'md' | 'lg'
  showPercentage?: boolean
  className?: string
}

/**
 * 動態色彩進度條組件
 * 符合 AC01-AC03 規格要求的進度條顯示
 * - 根據健康狀態動態變更顏色
 * - 支援流暢的動畫過渡效果
 * - 精確的百分比顯示
 */
export function DynamicProgressBar({ 
  percentage, 
  healthStatus, 
  animated = true,
  height = 'md',
  showPercentage = true,
  className 
}: DynamicProgressBarProps) {
  const getHeightClass = () => {
    switch (height) {
      case 'sm':
        return 'h-2'
      case 'md':
        return 'h-3'
      case 'lg':
        return 'h-4'
      default:
        return 'h-3'
    }
  }

  const clampedPercentage = Math.min(Math.max(percentage, 0), 100)
  
  return (
    <div className={cn("w-full space-y-2", className)}>
      {/* 百分比顯示 */}
      {showPercentage && (
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium text-muted-foreground">Sprint 進度</span>
          <span 
            className="font-bold text-lg"
            style={{ color: healthStatus.color }}
          >
            {clampedPercentage.toFixed(1)}%
          </span>
        </div>
      )}
      
      {/* 進度條容器 */}
      <div className={cn(
        "relative w-full overflow-hidden rounded-full bg-secondary/30",
        getHeightClass()
      )}>
        {/* 進度條填充 */}
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-in-out",
            animated && "transition-all"
          )}
          style={{
            width: `${clampedPercentage}%`,
            backgroundColor: healthStatus.color,
            // 添加漸變效果讓視覺更豐富
            background: `linear-gradient(90deg, ${healthStatus.color}, ${healthStatus.color}dd)`
          }}
        />
        
        {/* 進度條光澤效果 */}
        {animated && (
          <div 
            className="absolute inset-0 h-full rounded-full opacity-30"
            style={{
              width: `${clampedPercentage}%`,
              background: `linear-gradient(90deg, transparent, ${healthStatus.color}40, transparent)`,
              animation: clampedPercentage > 0 ? 'shimmer 2s infinite' : 'none'
            }}
          />
        )}
      </div>
      
      {/* 進度描述 */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>開始</span>
        <span style={{ color: healthStatus.color }}>
          {healthStatus.message}
        </span>
        <span>完成</span>
      </div>

      {/* CSS 動畫定義 */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
