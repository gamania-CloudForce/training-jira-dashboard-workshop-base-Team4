"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertTriangle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface HealthStatus {
  status: 'normal' | 'warning' | 'danger'
  color: string
  message: string
  progress_ratio: number
}

interface HealthStatusBadgeProps {
  healthStatus: HealthStatus
  animated?: boolean
  className?: string
}

/**
 * 健康狀態指示組件
 * 符合 AC01-AC03 規格要求
 * - AC01: 正常狀態 (綠色, #10B981)
 * - AC02: 警示狀態 (黃色, #F59E0B, ⚠️ 圖示)
 * - AC03: 危險狀態 (紅色, #EF4444, 🚨 圖示, 脈動動畫)
 */
export function HealthStatusBadge({ 
  healthStatus, 
  animated = false, 
  className 
}: HealthStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (healthStatus.status) {
      case 'normal':
        return {
          icon: TrendingUp,
          iconColor: 'text-green-700',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          emoji: null
        }
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-yellow-700',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
          emoji: '⚠️'
        }
      case 'danger':
        return {
          icon: AlertCircle,
          iconColor: 'text-red-700',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
          emoji: '🚨'
        }
    }
  }

  const config = getStatusConfig()
  const StatusIcon = config.icon

  return (
    <Badge 
      variant="outline"
      className={cn(
        "px-3 py-1.5 text-sm font-semibold border transition-all duration-200",
        config.bgColor,
        config.textColor,
        config.borderColor,
        // AC03: 危險狀態脈動動畫
        animated && healthStatus.status === 'danger' && "animate-pulse",
        className
      )}
      style={{ 
        backgroundColor: `${healthStatus.color}15`, // 15% opacity
        borderColor: healthStatus.color,
        color: healthStatus.color
      }}
    >
      <div className="flex items-center gap-1.5">
        {config.emoji && (
          <span className="text-sm" role="img" aria-label={healthStatus.status}>
            {config.emoji}
          </span>
        )}
        <StatusIcon className={cn("w-3.5 h-3.5", config.iconColor)} />
        <span>{healthStatus.message}</span>
      </div>
    </Badge>
  )
}
