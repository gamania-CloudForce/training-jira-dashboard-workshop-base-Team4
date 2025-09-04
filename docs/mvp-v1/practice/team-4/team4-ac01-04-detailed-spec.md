# Team4-Sprint燃盡圖AC驗收標準-詳細規格

> **檔案編號**: SPEC-AC01-04-sprint-burndown-acceptance-criteria  
> **建立日期**: 2025-09-04  
> **最後更新**: 2025-09-04  
> **Team**: Team4  
> **狀態**: 規格制定中  
> **關聯功能**: [SPEC-001-Sprint進度視覺化](../../example/spec01-progress-v2.md)

## 📋 概述

本文件詳細定義 **Sprint 燃盡圖視覺化功能** 中四個核心驗收標準 (AC01-AC04) 的技術規格與實作細節。

### 相關 User Story
**US001**: 作為 Scrum Master，我希望能在儀表板上看到即時更新的 Sprint 燃盡圖，並根據進度健康狀態顯示不同顏色的進度條和燃盡線，以便在每日站會中快速識別進度是否落後於預期，並引導團隊討論真正的障礙。

---

## ✅ AC01: Sprint 燃盡圖正常顯示與健康狀態

### 📝 驗收標準描述
```gherkin
場景：Scrum Master 查看正常進度的 Sprint
Given 有一個正在進行的 Sprint
And 實際進度符合或超前理想進度
When Scrum Master 進入儀表板頁面
Then 應顯示完整的 Sprint 燃盡圖
And 燃盡圖顯示灰色虛線理想線
And 燃盡圖顯示綠色實際線（僅到當前工作日）
And 進度條顯示綠色
And 右上角顯示綠色 "正常進度" 健康狀態
And 顯示完成率百分比和故事點數統計
```

### 🎯 詳細實作規格

#### 資料條件定義
- **正常進度條件**: `實際完成率 >= 理想完成率 * 0.9`
- **實際完成率計算**: `(總故事點數 - 剩餘故事點數) / 總故事點數 * 100%`
- **理想完成率計算**: `工作日經過比例 * 100%`

#### 視覺化元素規格

**燃盡圖基礎設定:**
```typescript
interface BurndownChartConfig {
  // 理想線 (灰色虛線)
  idealLine: {
    color: '#9CA3AF',        // 灰色
    strokeDasharray: '5,5',  // 虛線
    strokeWidth: 2,
    opacity: 0.8
  },
  
  // 實際線 (綠色實線)
  actualLine: {
    color: '#10B981',        // 綠色 (正常狀態)
    strokeWidth: 3,
    opacity: 1.0,
    dataEndPoint: 'currentWorkingDay' // 僅到當前工作日
  }
}
```

**進度條規格:**
```typescript
interface ProgressBarConfig {
  backgroundColor: '#F3F4F6', // 背景淺灰
  fillColor: '#10B981',       // 綠色填充
  height: '8px',
  borderRadius: '4px',
  animationDuration: '0.5s'
}
```

**健康狀態 Badge:**
```typescript
interface HealthBadgeConfig {
  position: 'top-right',
  text: '正常進度',
  backgroundColor: '#10B981', // 綠色
  textColor: '#FFFFFF',
  fontSize: '12px',
  padding: '4px 8px',
  borderRadius: '12px'
}
```

#### 資料展示格式
```typescript
interface SprintSummaryDisplay {
  completionPercentage: string;  // "65%" 格式
  completedStoryPoints: number;  // 已完成故事點數
  remainingStoryPoints: number;  // 剩餘故事點數
  totalStoryPoints: number;      // 總故事點數
  displayFormat: "已完成: {completed} SP | 剩餘: {remaining} SP | 總計: {total} SP"
}
```

---

## ⚠️ AC02: 進度落後時的黃色警示狀態

### 📝 驗收標準描述
```gherkin
場景：Sprint 進度稍微落後的警示
Given 有一個正在進行的 Sprint
And 實際進度落後理想進度 10-25% 之間
When Scrum Master 查看儀表板
Then 進度條應顯示黃色
And 右上角健康狀態 badge 顯示黃色 "稍微落後"
And 燃盡圖實際線應為黃色
And 系統提供適當的警示提醒
```

### 🎯 詳細實作規格

#### 警示條件定義
- **稍微落後條件**: `0.75 <= (實際完成率 / 理想完成率) < 0.9`
- **落後百分比計算**: `(理想完成率 - 實際完成率) / 理想完成率 * 100%`
- **觸發範圍**: 落後 10% ~ 25% 之間

#### 視覺化變更規格

**色彩調整:**
```typescript
interface YellowWarningTheme {
  // 實際線變為黃色
  actualLineColor: '#F59E0B',    // 黃色
  
  // 進度條變為黃色
  progressBarColor: '#F59E0B',   // 黃色
  
  // 健康狀態 Badge
  healthBadge: {
    backgroundColor: '#F59E0B',  // 黃色背景
    text: '稍微落後',
    iconClass: 'warning-icon'
  }
}
```

**警示提醒規格:**
```typescript
interface WarningAlert {
  type: 'warning',
  message: '⚠️ Sprint 進度稍微落後，建議檢視是否有阻礙因素',
  position: 'below-burndown-chart',
  backgroundColor: '#FEF3C7',   // 淺黃色背景
  borderColor: '#F59E0B',       // 黃色邊框
  textColor: '#92400E',         // 深黃色文字
  dismissible: true,            // 可關閉
  autoHide: false              // 不自動隱藏
}
```

#### 計算邏輯範例
```typescript
function calculateHealthStatus(actualProgress: number, idealProgress: number): HealthStatus {
  const progressRatio = actualProgress / idealProgress;
  
  if (progressRatio >= 0.9) {
    return { status: 'normal', color: 'green', message: '正常進度' };
  } else if (progressRatio >= 0.75) {
    return { status: 'warning', color: 'yellow', message: '稍微落後' };
  } else {
    return { status: 'danger', color: 'red', message: '嚴重落後' };
  }
}
```

---

## 🔴 AC03: 嚴重落後時的紅色危險警示

### 📝 驗收標準描述
```gherkin
場景：Sprint 進度嚴重落後的危險警示
Given 有一個正在進行的 Sprint
And 實際進度落後理想進度 25% 以上
When Scrum Master 查看儀表板
Then 進度條應顯示紅色
And 右上角健康狀態 badge 顯示紅色 "嚴重落後"
And 燃盡圖實際線應為紅色
And 系統提供明顯的危險警示
```

### 🎯 詳細實作規格

#### 危險條件定義
- **嚴重落後條件**: `(實際完成率 / 理想完成率) < 0.75`
- **危險程度**: 落後超過 25%
- **緊急程度**: 需要立即關注和行動

#### 視覺化變更規格

**紅色危險主題:**
```typescript
interface RedDangerTheme {
  // 實際線變為紅色
  actualLineColor: '#EF4444',      // 紅色
  strokeWidth: 4,                  // 加粗線條
  
  // 進度條變為紅色
  progressBarColor: '#EF4444',     // 紅色
  
  // 健康狀態 Badge (更醒目)
  healthBadge: {
    backgroundColor: '#EF4444',    // 紅色背景
    text: '嚴重落後',
    iconClass: 'danger-icon',
    animation: 'pulse',            // 脈動動畫
    fontSize: '13px',              // 稍大字體
    fontWeight: 'bold'             // 粗體
  }
}
```

**危險警示規格:**
```typescript
interface DangerAlert {
  type: 'danger',
  prominence: 'high',
  message: '🚨 Sprint 進度嚴重落後！建議立即召集團隊討論並採取行動',
  position: 'prominent-banner',     // 顯著位置
  backgroundColor: '#FEE2E2',      // 淺紅色背景
  borderColor: '#EF4444',          // 紅色邊框
  borderWidth: '2px',              // 加粗邊框
  textColor: '#991B1B',            // 深紅色文字
  fontSize: '14px',                // 較大字體
  fontWeight: 'semibold',          // 半粗體
  dismissible: false,              // 不可關閉
  actionButtons: [                 // 行動按鈕
    {
      text: '查看阻礙因素',
      action: 'navigate-to-blockers'
    },
    {
      text: '檢視任務分配',
      action: 'view-task-distribution'
    }
  ]
}
```

#### 額外警示機制
```typescript
interface AdditionalWarnings {
  // 瀏覽器通知
  browserNotification: {
    enabled: true,
    title: 'Sprint 進度警示',
    message: 'Sprint 進度嚴重落後，請查看儀表板',
    icon: 'warning-icon.png'
  },
  
  // 視覺化強化
  visualEnhancement: {
    chartGlow: '#EF4444',          // 圖表紅色光暈
    backgroundTint: '#FFF5F5',     // 整體背景微紅
    iconPulse: true                // 圖示脈動效果
  }
}
```

---

## ⏰ AC04: 燃盡圖時間邊界正確處理

### 📝 驗收標準描述
```gherkin
場景：實際燃盡線只顯示到當前工作日
Given Sprint 為期 10 個工作日
And 今天是第 8 個工作日
When 系統生成燃盡圖資料
Then 理想線應顯示完整的 Day 1 到 Day 10
And 實際線應只顯示 Day 1 到 Day 8 的數據
And Day 9 和 Day 10 不應有實際數據點
And hover 未來日期時應顯示 "實際剩餘: 未來日期"
```

### 🎯 詳細實作規格

#### 時間邊界計算邏輯
```typescript
interface TimeBoundaryLogic {
  // Sprint 工作日計算
  calculateWorkingDays(startDate: Date, endDate: Date): number[];
  
  // 當前工作日判定
  getCurrentWorkingDay(sprintStartDate: Date, today: Date): number;
  
  // 未來工作日識別
  getFutureWorkingDays(currentDay: number, totalDays: number): number[];
}

// 實作範例
class SprintTimeBoundary {
  static calculateWorkingDays(startDate: Date, endDate: Date): Date[] {
    const workingDays = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      // 排除週末 (0=Sunday, 6=Saturday)
      if (current.getDay() !== 0 && current.getDay() !== 6) {
        workingDays.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    
    return workingDays;
  }
}
```

#### 資料點顯示邏輯
```typescript
interface DataPointDisplay {
  // 理想線資料 - 完整顯示
  idealLineData: Array<{
    day: number;              // 1 to 10
    date: string;             // 實際日期
    idealRemaining: number;   // 理想剩餘故事點數
    isWorkingDay: boolean;    // 是否為工作日
  }>;
  
  // 實際線資料 - 僅到當前日
  actualLineData: Array<{
    day: number;              // 1 to 8 (當前日)
    date: string;             // 實際日期
    actualRemaining: number;  // 實際剩餘故事點數
    hasData: boolean;         // 是否有真實數據
  }>;
}
```

#### 圖表渲染規格
```typescript
interface ChartRenderingRules {
  // 理想線 - 完整渲染
  idealLine: {
    renderDays: 'all',        // Day 1 ~ Day 10 全部
    style: 'dashed-line',
    color: '#9CA3AF',
    dataPoints: 'hidden'      // 不顯示資料點
  },
  
  // 實際線 - 限制渲染
  actualLine: {
    renderDays: 'up-to-current',  // 僅到當前工作日
    style: 'solid-line',
    color: 'dynamic',             // 根據健康狀態變色
    dataPoints: 'visible',        // 顯示資料點
    futureData: null              // 未來日期無數據
  }
}
```

#### Tooltip 互動規格
```typescript
interface TooltipBehavior {
  // 當前及過去工作日
  pastAndCurrentDays: {
    displayFormat: {
      day: 'Day {dayNumber}',
      date: '{YYYY-MM-DD}',
      ideal: '理想剩餘: {idealRemaining} SP',
      actual: '實際剩餘: {actualRemaining} SP',
      status: '進度狀態: {healthStatus}'
    }
  },
  
  // 未來工作日
  futureDays: {
    displayFormat: {
      day: 'Day {dayNumber}',
      date: '{YYYY-MM-DD}',
      ideal: '理想剩餘: {idealRemaining} SP',
      actual: '實際剩餘: 未來日期',    // 固定文字
      note: '※ 此為未來日期，尚無實際數據'
    },
    style: {
      backgroundColor: '#F9FAFB',   // 淺灰背景
      borderColor: '#D1D5DB',       // 灰色邊框
      textColor: '#6B7280'          // 灰色文字
    }
  }
}
```

#### 邊界案例處理
```typescript
interface EdgeCaseHandling {
  // Sprint 第一天
  firstDay: {
    actualRemaining: 'equal-to-total',  // 等於總故事點數
    progressPercentage: 0,              // 0% 完成
    healthStatus: 'normal'              // 預設正常狀態
  },
  
  // Sprint 最後一天
  lastDay: {
    showCompletionWarning: boolean;     // 是否顯示完成提醒
    urgencyLevel: 'high',               // 緊急程度
    recommendedAction: 'focus-on-remaining-tasks'
  },
  
  // 週末處理
  weekends: {
    includeInChart: false,              // 不包含在圖表中
    skipInCalculation: true,            // 計算時跳過
    tooltipMessage: '週末不計入工作日'
  }
}
```

---

## 🔗 技術整合規格

### API 資料格式
```typescript
interface SprintBurndownApiResponse {
  sprintInfo: {
    sprintName: string;
    totalWorkingDays: number;
    currentWorkingDay: number;
    totalStoryPoints: number;
  };
  
  dailyProgress: Array<{
    day: number;
    date: string;
    idealRemaining: number;
    actualRemaining: number | null;  // null for future days
    isWorkingDay: boolean;
    isFuture: boolean;
  }>;
  
  healthStatus: {
    status: 'normal' | 'warning' | 'danger';
    color: string;
    message: string;
    progressRatio: number;
  };
}
```

### 前端組件整合
```typescript
// React 組件 props
interface BurndownChartProps {
  sprintData: SprintBurndownApiResponse;
  onHealthStatusChange?: (status: HealthStatus) => void;
  showWarningAlerts?: boolean;
  enableTooltips?: boolean;
  responsive?: boolean;
}

// 主要渲染邏輯
const BurndownChart: React.FC<BurndownChartProps> = ({
  sprintData,
  onHealthStatusChange,
  showWarningAlerts = true,
  enableTooltips = true,
  responsive = true
}) => {
  // AC01-04 的具體實作邏輯
  // ...
};
```

---

## 📋 驗收檢查清單

### AC01 檢查項目
- [ ] 正常進度時燃盡圖完整顯示
- [ ] 理想線為灰色虛線
- [ ] 實際線為綠色實線
- [ ] 進度條顯示綠色
- [ ] 健康狀態顯示「正常進度」
- [ ] 完成率百分比正確計算
- [ ] 故事點數統計正確顯示

### AC02 檢查項目  
- [ ] 落後 10-25% 時觸發黃色警示
- [ ] 進度條變為黃色
- [ ] 實際線變為黃色
- [ ] 健康狀態顯示「稍微落後」
- [ ] 警示提醒訊息顯示
- [ ] 警示可關閉但不自動隱藏

### AC03 檢查項目
- [ ] 落後超過 25% 時觸發紅色警示
- [ ] 進度條變為紅色
- [ ] 實際線變為紅色並加粗
- [ ] 健康狀態顯示「嚴重落後」
- [ ] 危險警示訊息顯著展示
- [ ] 提供行動建議按鈕
- [ ] 脈動動畫效果正常

### AC04 檢查項目
- [ ] 理想線顯示完整 Sprint 期間
- [ ] 實際線僅顯示到當前工作日
- [ ] 未來工作日無實際數據點
- [ ] Hover 未來日期顯示正確訊息
- [ ] 週末正確排除在計算外
- [ ] 工作日計算邏輯正確
- [ ] Tooltip 格式符合規格

---

## 📝 變更記錄

| 日期         | 版本 | 變更內容 | 變更人    |
| ------------ | ---- | -------- | --------- |
| 2025-09-04   | 1.0  | 初版建立，詳細定義 AC01-AC04 規格 | Team4 |
