"use client"

import React, { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { X, AlertTriangle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActionButton {
  text: string
  action: () => void
  variant?: 'default' | 'outline' | 'secondary'
}

interface SprintAlertProps {
  type: 'warning' | 'danger'
  message: string
  dismissible?: boolean
  actionButtons?: ActionButton[]
  className?: string
  onDismiss?: () => void
}

/**
 * Sprint 警示訊息組件
 * 符合 AC02-AC03 規格要求
 * - AC02: 警示狀態 (黃色背景, ⚠️ 圖示, 可關閉)
 * - AC03: 危險狀態 (紅色背景, 🚨 圖示, 不可關閉, 行動按鈕)
 */
export function SprintAlert({ 
  type, 
  message, 
  dismissible = false, 
  actionButtons = [],
  className,
  onDismiss 
}: SprintAlertProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  const handleDismiss = () => {
    setIsDismissed(true)
    onDismiss?.()
  }

  // 如果已被關閉且可關閉，不顯示
  if (isDismissed && dismissible) {
    return null
  }

  const getAlertConfig = () => {
    switch (type) {
      case 'warning':
        return {
          containerClass: 'border-yellow-200 bg-yellow-50',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          icon: AlertTriangle,
          emoji: '⚠️'
        }
      case 'danger':
        return {
          containerClass: 'border-red-200 bg-red-50',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
          icon: AlertCircle,
          emoji: '🚨'
        }
    }
  }

  const config = getAlertConfig()
  const AlertIcon = config.icon

  return (
    <Alert 
      className={cn(
        "border-2 shadow-sm transition-all duration-200",
        config.containerClass,
        config.textColor,
        !dismissible && "mb-4", // AC03: 危險警示不可關閉，保持顯著
        className
      )}
    >
      <div className="flex items-start justify-between">
        {/* 左側：圖示和訊息 */}
        <div className="flex items-center gap-3 flex-1">
          {/* 表情符號 */}
          <span className="text-lg flex-shrink-0" role="img" aria-label={type}>
            {config.emoji}
          </span>
          
          {/* 圖示 */}
          <AlertIcon className={cn("h-4 w-4 flex-shrink-0", config.iconColor)} />
          
          {/* 訊息內容 */}
          <div className="flex-1 min-w-0">
            <AlertDescription className={cn("font-medium", config.textColor)}>
              {message}
            </AlertDescription>
          </div>
        </div>

        {/* 右側：關閉按鈕 (僅在可關閉時顯示) */}
        {dismissible && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className={cn(
              "h-6 w-6 p-0 hover:bg-transparent flex-shrink-0",
              config.textColor,
              "hover:opacity-70"
            )}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">關閉警示</span>
          </Button>
        )}
      </div>

      {/* 行動按鈕區域 (主要用於 AC03 危險狀態) */}
      {actionButtons.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {actionButtons.map((button, index) => (
            <Button
              key={index}
              variant={button.variant || 'outline'}
              size="sm"
              onClick={button.action}
              className={cn(
                "text-xs",
                type === 'warning' && "border-yellow-300 text-yellow-700 hover:bg-yellow-100",
                type === 'danger' && "border-red-300 text-red-700 hover:bg-red-100"
              )}
            >
              {button.text}
            </Button>
          ))}
        </div>
      )}
    </Alert>
  )
}

/**
 * Sprint 警示容器組件
 * 管理多個警示的顯示優先級
 */
interface SprintAlertsContainerProps {
  warnings: string[]
  dangers: string[]
  onWarningDismiss?: (index: number) => void
  actionButtons?: ActionButton[]
  className?: string
}

export function SprintAlertsContainer({
  warnings = [],
  dangers = [],
  onWarningDismiss,
  actionButtons = [],
  className
}: SprintAlertsContainerProps) {
  if (warnings.length === 0 && dangers.length === 0) {
    return null
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* 危險警示優先顯示 */}
      {dangers.map((danger, index) => (
        <SprintAlert
          key={`danger-${index}`}
          type="danger"
          message={danger}
          dismissible={false} // AC03: 危險警示不可關閉
          actionButtons={actionButtons}
        />
      ))}

      {/* 警示訊息 */}
      {warnings.map((warning, index) => (
        <SprintAlert
          key={`warning-${index}`}
          type="warning"
          message={warning}
          dismissible={true} // AC02: 警示可關閉
          onDismiss={() => onWarningDismiss?.(index)}
        />
      ))}
    </div>
  )
}
