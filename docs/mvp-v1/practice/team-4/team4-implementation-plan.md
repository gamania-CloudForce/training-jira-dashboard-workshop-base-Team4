# Team4-Sprint燃盡圖AC01-04-實作計畫

> **檔案編號**: IMPL-PLAN-AC01-04-sprint-burndown  
> **建立日期**: 2025-09-04  
> **最後更新**: 2025-09-04  
> **Team**: Team4  
> **狀態**: 實作計畫制定完成  
> **關聯規格**: [team4-ac01-04-detailed-spec.md](./team4-ac01-04-detailed-spec.md)

## 📋 實作計畫概述

基於詳細規格文件，將 **AC01-AC04** 的實作拆分為 **4個階段**，每個階段專注於一個 AC 的完整實現，確保每個階段都能獨立測試和驗收。

### 🎯 整體目標
實現完整的 Sprint 燃盡圖視覺化功能，包含：
- 正常進度的綠色顯示 (AC01)
- 稍微落後的黃色警示 (AC02) 
- 嚴重落後的紅色危險警示 (AC03)
- 時間邊界的正確處理 (AC04)

### ⏱️ 預估時程
- **總計**: 2-3 週
- **每階段**: 3-5 天
- **測試整合**: 2-3 天

---

## 🏗️ Phase 1: AC01 正常進度基礎實作 (3-4天)

### 📝 階段目標
實作 Sprint 燃盡圖的基礎顯示功能，包含正常進度時的綠色主題視覺化。

### 🔧 技術任務

#### Task 1.1: 後端資料模型建立 (0.5天)
**描述**: 建立支援燃盡圖的資料結構
```typescript
// 需要實作的資料模型
interface SprintBurndownData {
  sprintName: string;
  totalStoryPoints: number;
  completedStoryPoints: number;
  remainingStoryPoints: number;
  completionPercentage: number;
  healthStatus: 'normal' | 'warning' | 'danger';
  totalWorkingDays: number;
  currentWorkingDay: number;
}

interface DayProgress {
  day: number;
  date: string;
  idealRemaining: number;
  actualRemaining: number | null;
  isWorkingDay: boolean;
  isFuture: boolean;
}
```

**✅ 完成標準**:
- [ ] 資料模型定義完成
- [ ] 基本的資料驗證邏輯
- [ ] 單元測試覆蓋

#### Task 1.2: API 端點實作 (1天)
**描述**: 擴展現有 GoogleSheetsService，新增燃盡圖資料計算
```csharp
// 需要實作的方法
public async Task<SprintBurndownResponse> GetSprintBurndownDataAsync(string sprintName)
{
    // 1. 從 Google Sheets 讀取 Sprint 資料
    // 2. 計算工作日 (排除週末)
    // 3. 計算理想燃盡線
    // 4. 計算實際燃盡線
    // 5. 判斷健康狀態
    // 6. 組裝回應資料
}
```

**✅ 完成標準**:
- [ ] API 端點正常回傳資料
- [ ] 工作日計算邏輯正確
- [ ] 健康狀態判斷邏輯正確
- [ ] 整合測試通過

#### Task 1.3: 前端燃盡圖組件基礎結構 (1天)
**描述**: 使用 Recharts 建立燃盡圖基礎組件
```typescript
interface BurndownChartProps {
  sprintData: SprintBurndownApiResponse;
  theme?: 'normal' | 'warning' | 'danger';
  showTooltips?: boolean;
  responsive?: boolean;
}

const BurndownChart: React.FC<BurndownChartProps> = (props) => {
  // 基礎圖表結構
  return (
    <ResponsiveContainer>
      <LineChart data={chartData}>
        <XAxis />
        <YAxis />
        <CartesianGrid />
        <Line name="理想線" stroke="#9CA3AF" strokeDasharray="5,5" />
        <Line name="實際線" stroke="#10B981" strokeWidth={3} />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
};
```

**✅ 完成標準**:
- [ ] 基礎圖表渲染正常
- [ ] 理想線顯示為灰色虛線
- [ ] 實際線顯示為綠色實線
- [ ] 響應式設計適配

#### Task 1.4: 進度條與健康狀態組件 (0.5天)
**描述**: 實作進度條和健康狀態 Badge
```typescript
const ProgressIndicator: React.FC<{
  completionPercentage: number;
  healthStatus: HealthStatus;
}> = ({ completionPercentage, healthStatus }) => {
  return (
    <div className="progress-container">
      <div className={`progress-bar ${healthStatus.status}`}>
        <div 
          className="progress-fill"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
      <Badge variant={healthStatus.status}>
        {healthStatus.message}
      </Badge>
    </div>
  );
};
```

**✅ 完成標準**:
- [ ] 進度條正確顯示完成百分比
- [ ] 健康狀態 Badge 樣式正確
- [ ] 綠色主題視覺一致

#### Task 1.5: 資料統計顯示 (0.5天)
**描述**: 實作故事點數統計區域
```typescript
const SprintSummary: React.FC<{
  totalStoryPoints: number;
  completedStoryPoints: number;
  remainingStoryPoints: number;
  completionPercentage: number;
}> = (props) => {
  return (
    <div className="sprint-summary">
      <div className="completion-rate">{completionPercentage}% 完成</div>
      <div className="story-points-breakdown">
        已完成: {completedStoryPoints} SP | 
        剩餘: {remainingStoryPoints} SP | 
        總計: {totalStoryPoints} SP
      </div>
    </div>
  );
};
```

**✅ 完成標準**:
- [ ] 統計數據正確計算
- [ ] 格式符合規格要求
- [ ] 視覺排版美觀

### 📋 Phase 1 驗收標準
- [ ] 正常進度時燃盡圖完整顯示
- [ ] 理想線為灰色虛線，實際線為綠色實線
- [ ] 進度條顯示綠色，健康狀態顯示「正常進度」
- [ ] 完成率百分比和故事點數統計正確
- [ ] 所有組件響應式設計適配
- [ ] 單元測試和整合測試通過

---

## ⚠️ Phase 2: AC02 黃色警示狀態實作 (3天)

### 📝 階段目標
在 Phase 1 基礎上，新增稍微落後時的黃色警示功能。

### 🔧 技術任務

#### Task 2.1: 健康狀態計算邏輯擴展 (0.5天)
**描述**: 擴展後端健康狀態判斷邏輯
```csharp
public HealthStatus CalculateHealthStatus(double actualProgress, double idealProgress)
{
    var progressRatio = actualProgress / idealProgress;
    
    if (progressRatio >= 0.9)
    {
        return new HealthStatus("normal", "#10B981", "正常進度");
    }
    else if (progressRatio >= 0.75)
    {
        return new HealthStatus("warning", "#F59E0B", "稍微落後");
    }
    else
    {
        return new HealthStatus("danger", "#EF4444", "嚴重落後");
    }
}
```

**✅ 完成標準**:
- [ ] 黃色警示觸發條件正確 (落後 10-25%)
- [ ] 後端 API 正確回傳警示狀態
- [ ] 單元測試覆蓋邊界條件

#### Task 2.2: 動態色彩主題系統 (1天)
**描述**: 實作支援動態切換的色彩主題系統
```typescript
interface ThemeConfig {
  normal: {
    actualLineColor: '#10B981';
    progressBarColor: '#10B981';
    healthBadgeColor: '#10B981';
  };
  warning: {
    actualLineColor: '#F59E0B';
    progressBarColor: '#F59E0B'; 
    healthBadgeColor: '#F59E0B';
  };
  danger: {
    actualLineColor: '#EF4444';
    progressBarColor: '#EF4444';
    healthBadgeColor: '#EF4444';
  };
}

const useTheme = (healthStatus: HealthStatus) => {
  return useMemo(() => {
    return ThemeConfig[healthStatus.status];
  }, [healthStatus]);
};
```

**✅ 完成標準**:
- [ ] 色彩主題可以動態切換
- [ ] 燃盡圖實際線顏色正確變更
- [ ] 進度條顏色同步變更
- [ ] 健康狀態 Badge 顏色同步

#### Task 2.3: 警示提醒組件實作 (1天)
**描述**: 實作黃色警示的提醒訊息
```typescript
const WarningAlert: React.FC<{
  show: boolean;
  message: string;
  onDismiss: () => void;
}> = ({ show, message, onDismiss }) => {
  if (!show) return null;
  
  return (
    <Alert variant="warning" dismissible onClose={onDismiss}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>⚠️ 進度警示</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};
```

**✅ 完成標準**:
- [ ] 警示訊息正確顯示
- [ ] 可關閉但不自動隱藏
- [ ] 視覺樣式符合黃色主題
- [ ] 訊息內容符合規格要求

#### Task 2.4: 狀態切換測試與整合 (0.5天)
**描述**: 測試正常狀態與黃色警示狀態間的切換
```typescript
// 測試案例範例
describe('Health Status Switching', () => {
  it('should switch from normal to warning when progress drops', () => {
    // 模擬進度從正常變為落後
    const { rerender } = render(<BurndownChart sprintData={normalData} />);
    expect(screen.getByText('正常進度')).toBeInTheDocument();
    
    rerender(<BurndownChart sprintData={warningData} />);
    expect(screen.getByText('稍微落後')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('alert-warning');
  });
});
```

**✅ 完成標準**:
- [ ] 狀態切換動畫流暢
- [ ] 所有視覺元素同步變更
- [ ] 邊界條件測試通過
- [ ] 使用者體驗良好

### 📋 Phase 2 驗收標準
- [ ] 落後 10-25% 時正確觸發黃色警示
- [ ] 進度條、實際線、健康狀態 Badge 同步變為黃色
- [ ] 警示提醒訊息正確顯示且可關閉
- [ ] 與正常狀態切換流暢
- [ ] 所有測試案例通過

---

## 🔴 Phase 3: AC03 紅色危險警示實作 (4天)

### 📝 階段目標
實作嚴重落後時的紅色危險警示，包含強化的視覺效果和行動建議。

### 🔧 技術任務

#### Task 3.1: 紅色危險主題實作 (1天)
**描述**: 實作紅色危險狀態的增強視覺效果
```typescript
interface DangerThemeEnhancement {
  actualLine: {
    color: '#EF4444';
    strokeWidth: 4;          // 加粗線條
    glow: '#EF4444';         // 光暈效果
  };
  healthBadge: {
    backgroundColor: '#EF4444';
    animation: 'pulse';      // 脈動動畫
    fontSize: '13px';        // 稍大字體
    fontWeight: 'bold';      // 粗體
  };
  visualEffects: {
    chartGlow: '#EF4444';    // 圖表光暈
    backgroundTint: '#FFF5F5'; // 背景微紅
  };
}
```

**✅ 完成標準**:
- [ ] 實際線變為紅色並加粗
- [ ] 健康狀態 Badge 脈動動畫正常
- [ ] 整體視覺效果增強且不突兀
- [ ] 動畫性能良好

#### Task 3.2: 危險警示橫幅組件 (1天)
**描述**: 實作顯著的危險警示橫幅
```typescript
const DangerBanner: React.FC<{
  message: string;
  actionButtons?: ActionButton[];
  onAction: (action: string) => void;
}> = ({ message, actionButtons, onAction }) => {
  return (
    <Alert variant="destructive" className="danger-banner">
      <AlertCircle className="h-5 w-5" />
      <div className="flex-1">
        <AlertTitle className="text-lg font-semibold">
          🚨 緊急警示
        </AlertTitle>
        <AlertDescription className="text-sm mt-1">
          {message}
        </AlertDescription>
      </div>
      <div className="flex gap-2 ml-4">
        {actionButtons?.map(button => (
          <Button 
            key={button.action}
            variant="outline"
            size="sm"
            onClick={() => onAction(button.action)}
          >
            {button.text}
          </Button>
        ))}
      </div>
    </Alert>
  );
};
```

**✅ 完成標準**:
- [ ] 警示橫幅顯著且不可關閉
- [ ] 行動按鈕功能正常
- [ ] 視覺層級最高優先級
- [ ] 訊息內容符合規格

#### Task 3.3: 瀏覽器通知功能 (0.5天)
**描述**: 實作瀏覽器原生通知功能
```typescript
const useNotification = () => {
  const showDangerNotification = useCallback(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Sprint 進度警示', {
        body: 'Sprint 進度嚴重落後，請查看儀表板',
        icon: '/warning-icon.png',
        tag: 'sprint-danger',
        requireInteraction: true
      });
    }
  }, []);

  return { showDangerNotification };
};
```

**✅ 完成標準**:
- [ ] 權限請求流程正常
- [ ] 通知內容符合規格
- [ ] 點擊通知可返回頁面
- [ ] 通知不重複觸發

#### Task 3.4: 進階視覺效果實作 (1天)
**描述**: 實作圖表光暈、背景微調等視覺強化
```scss
// CSS 動畫和視覺效果
.danger-state {
  .burndown-chart {
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
    border-radius: 8px;
  }
  
  .chart-container {
    background: linear-gradient(135deg, #FFF5F5 0%, #FFFFFF 100%);
  }
  
  .health-badge.danger {
    animation: pulse 2s infinite;
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
  }
}

@keyframes pulse {
  0%, 100% { 
    opacity: 1; 
    transform: scale(1); 
  }
  50% { 
    opacity: 0.8; 
    transform: scale(1.05); 
  }
}
```

**✅ 完成標準**:
- [ ] 光暈效果自然不刺眼
- [ ] 脈動動畫流暢
- [ ] 背景色調和諧
- [ ] 視覺強化不影響性能

#### Task 3.5: 行動建議功能整合 (0.5天)
**描述**: 實作行動建議按鈕的具體功能
```typescript
const useActionHandlers = () => {
  const handleBlockersView = useCallback(() => {
    // 導航到阻礙因素頁面或顯示相關資訊
    router.push('/dashboard/blockers');
  }, []);

  const handleTaskDistribution = useCallback(() => {
    // 顯示任務分配對話框或頁面
    setShowTaskModal(true);
  }, []);

  return { handleBlockersView, handleTaskDistribution };
};
```

**✅ 完成標準**:
- [ ] 行動按鈕點擊響應正常
- [ ] 導航功能符合使用者期望
- [ ] 提供實際有用的行動選項
- [ ] 使用者流程順暢

### 📋 Phase 3 驗收標準
- [ ] 落後超過 25% 時正確觸發紅色警示
- [ ] 實際線變為紅色且加粗，健康狀態 Badge 脈動
- [ ] 危險警示橫幅顯著展示且不可關閉
- [ ] 提供具體的行動建議按鈕
- [ ] 瀏覽器通知功能正常
- [ ] 視覺強化效果適度且性能良好

---

## ⏰ Phase 4: AC04 時間邊界處理實作 (4天)

### 📝 階段目標
實作燃盡圖時間邊界的正確處理，確保實際線僅顯示到當前工作日。

### 🔧 技術任務

#### Task 4.1: 工作日計算邏輯實作 (1天)
**描述**: 實作精確的工作日計算，排除週末
```csharp
public class WorkingDayCalculator
{
    public static List<DateTime> CalculateWorkingDays(DateTime startDate, DateTime endDate)
    {
        var workingDays = new List<DateTime>();
        var current = startDate.Date;
        
        while (current <= endDate.Date)
        {
            // 排除週末 (Saturday = 6, Sunday = 0)
            if (current.DayOfWeek != DayOfWeek.Saturday && 
                current.DayOfWeek != DayOfWeek.Sunday)
            {
                workingDays.Add(current);
            }
            current = current.AddDays(1);
        }
        
        return workingDays;
    }
    
    public static int GetCurrentWorkingDay(DateTime sprintStart, DateTime today)
    {
        var workingDays = CalculateWorkingDays(sprintStart, today);
        return workingDays.Count;
    }
}
```

**✅ 完成標準**:
- [ ] 工作日計算邏輯正確
- [ ] 週末正確排除
- [ ] 當前工作日判定準確
- [ ] 邊界案例處理完善

#### Task 4.2: 圖表資料切割邏輯 (1天)
**描述**: 實作圖表資料的正確切割，理想線全顯示，實際線限制顯示
```typescript
const useChartData = (sprintData: SprintBurndownApiResponse) => {
  return useMemo(() => {
    const { dailyProgress, sprintInfo } = sprintData;
    
    // 理想線資料 - 完整顯示
    const idealLineData = dailyProgress.map(day => ({
      day: day.day,
      date: day.date,
      ideal: day.idealRemaining,
      isWorkingDay: day.isWorkingDay
    }));
    
    // 實際線資料 - 僅到當前工作日
    const actualLineData = dailyProgress
      .filter(day => !day.isFuture)  // 排除未來日期
      .map(day => ({
        day: day.day,
        date: day.date,
        actual: day.actualRemaining,
        isWorkingDay: day.isWorkingDay
      }));
    
    return { idealLineData, actualLineData };
  }, [sprintData]);
};
```

**✅ 完成標準**:
- [ ] 理想線資料包含完整 Sprint 期間
- [ ] 實際線資料僅到當前工作日
- [ ] 未來日期正確排除
- [ ] 資料結構清晰一致

#### Task 4.3: 圖表渲染邏輯調整 (1天)
**描述**: 調整 Recharts 組件的渲染邏輯
```typescript
const BurndownChart: React.FC<BurndownChartProps> = ({ sprintData }) => {
  const { idealLineData, actualLineData } = useChartData(sprintData);
  
  // 合併資料用於 X 軸顯示
  const chartData = idealLineData.map(idealPoint => {
    const actualPoint = actualLineData.find(a => a.day === idealPoint.day);
    return {
      day: idealPoint.day,
      date: idealPoint.date,
      ideal: idealPoint.ideal,
      actual: actualPoint?.actual || null,  // 未來日期為 null
      isFuture: !actualPoint
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <XAxis dataKey="day" />
        <YAxis />
        <CartesianGrid strokeDasharray="3,3" />
        
        {/* 理想線 - 完整顯示 */}
        <Line
          name="理想線"
          type="monotone"
          dataKey="ideal"
          stroke="#9CA3AF"
          strokeDasharray="5,5"
          strokeWidth={2}
          dot={false}
        />
        
        {/* 實際線 - 僅有資料的部分 */}
        <Line
          name="實際線"
          type="monotone"
          dataKey="actual"
          stroke={theme.actualLineColor}
          strokeWidth={theme.strokeWidth}
          connectNulls={false}  // 重要: 不連接 null 值
          dot={{ r: 4 }}
        />
        
        <Tooltip content={<CustomTooltip />} />
      </LineChart>
    </ResponsiveContainer>
  );
};
```

**✅ 完成標準**:
- [ ] 理想線完整顯示整個 Sprint
- [ ] 實際線僅顯示到當前工作日
- [ ] 未來資料點不顯示
- [ ] 圖表視覺效果正確

#### Task 4.4: 自訂 Tooltip 實作 (0.5天)
**描述**: 實作針對未來日期的特殊 Tooltip
```typescript
const CustomTooltip: React.FC<TooltipProps<any, any>> = ({ 
  active, 
  payload, 
  label 
}) => {
  if (!active || !payload || !payload.length) return null;
  
  const data = payload[0].payload;
  const isFuture = data.isFuture;
  
  return (
    <div className={`tooltip ${isFuture ? 'tooltip-future' : 'tooltip-normal'}`}>
      <p className="tooltip-label">Day {label}</p>
      <p className="tooltip-date">{data.date}</p>
      <p className="tooltip-ideal">理想剩餘: {data.ideal} SP</p>
      
      {isFuture ? (
        <>
          <p className="tooltip-actual">實際剩餘: 未來日期</p>
          <p className="tooltip-note">※ 此為未來日期，尚無實際數據</p>
        </>
      ) : (
        <p className="tooltip-actual">實際剩餘: {data.actual} SP</p>
      )}
    </div>
  );
};
```

**✅ 完成標準**:
- [ ] 過去/當前日期 Tooltip 顯示完整資訊
- [ ] 未來日期 Tooltip 顯示「未來日期」
- [ ] 樣式區別明顯但和諧
- [ ] 提示資訊清晰易懂

#### Task 4.5: 邊界案例完整測試 (1.5天)
**描述**: 測試各種時間邊界的特殊情況
```typescript
describe('Time Boundary Edge Cases', () => {
  it('should handle Sprint first day correctly', () => {
    // Sprint 第一天測試
    const firstDayData = createMockData({ currentDay: 1 });
    render(<BurndownChart sprintData={firstDayData} />);
    
    expect(screen.getByText('0% 完成')).toBeInTheDocument();
    // 實際線應該只有起始點
  });

  it('should handle Sprint last day correctly', () => {
    // Sprint 最後一天測試
    const lastDayData = createMockData({ currentDay: 10, totalDays: 10 });
    render(<BurndownChart sprintData={lastDayData} />);
    
    // 應該沒有未來數據點
    expect(screen.queryByText('未來日期')).not.toBeInTheDocument();
  });

  it('should handle weekends correctly', () => {
    // 週末跨越測試
    const weekendData = createMockDataWithWeekends();
    render(<BurndownChart sprintData={weekendData} />);
    
    // 週末不應該計入工作日
  });

  it('should handle mid-sprint correctly', () => {
    // Sprint 進行中測試 (最常見情況)
    const midSprintData = createMockData({ currentDay: 6, totalDays: 10 });
    render(<BurndownChart sprintData={midSprintData} />);
    
    // 實際線到第6天，理想線到第10天
    // Day 7-10 應該顯示「未來日期」
  });
});
```

**✅ 完成標準**:
- [ ] Sprint 第一天邊界正確
- [ ] Sprint 最後一天邊界正確  
- [ ] 週末處理邏輯正確
- [ ] Sprint 進行中的一般情況正確
- [ ] 所有邊界測試通過

### 📋 Phase 4 驗收標準
- [ ] 理想線顯示完整 Sprint 期間 (如 Day 1-10)
- [ ] 實際線僅顯示到當前工作日 (如 Day 1-8)
- [ ] 未來工作日無實際數據點
- [ ] Hover 未來日期顯示「實際剩餘: 未來日期」
- [ ] 週末正確排除在工作日計算外
- [ ] 工作日計算邏輯完全正確
- [ ] 所有邊界案例測試通過

---

## 🧪 Final Phase: 整合測試與優化 (2-3天)

### 📝 階段目標
完成所有 AC 的整合測試，確保功能間的協作無誤，並進行性能優化。

### 🔧 整合任務

#### Task F.1: 跨 AC 狀態切換測試 (1天)
**描述**: 測試不同健康狀態間的切換
```typescript
describe('AC Integration Tests', () => {
  it('should transition smoothly between all health states', async () => {
    const { rerender } = render(<BurndownChart sprintData={normalData} />);
    
    // 正常 → 警告
    rerender(<BurndownChart sprintData={warningData} />);
    await waitFor(() => {
      expect(screen.getByText('稍微落後')).toBeInTheDocument();
    });
    
    // 警告 → 危險
    rerender(<BurndownChart sprintData={dangerData} />);
    await waitFor(() => {
      expect(screen.getByText('嚴重落後')).toBeInTheDocument();
    });
    
    // 危險 → 正常
    rerender(<BurndownChart sprintData={normalData} />);
    await waitFor(() => {
      expect(screen.getByText('正常進度')).toBeInTheDocument();
    });
  });
});
```

#### Task F.2: 性能優化 (0.5天)
**描述**: 優化圖表渲染和動畫性能
```typescript
// 使用 React.memo 優化重渲染
const BurndownChart = React.memo<BurndownChartProps>(({ sprintData }) => {
  // 使用 useMemo 快取計算
  const chartData = useMemo(() => {
    return processChartData(sprintData);
  }, [sprintData]);
  
  // 使用 useCallback 優化回調
  const handleTooltipChange = useCallback((active: boolean, payload: any) => {
    // ...
  }, []);
  
  return (
    // 圖表組件
  );
});

// 設置正確的依賴比較
BurndownChart.displayName = 'BurndownChart';
```

#### Task F.3: E2E 測試撰寫 (0.5天)
**描述**: 撰寫端到端測試確保完整流程
```typescript
// Playwright E2E 測試
test('Complete burndown chart workflow', async ({ page }) => {
  await page.goto('/dashboard');
  
  // 等待圖表載入
  await page.waitForSelector('[data-testid="burndown-chart"]');
  
  // 檢查正常狀態
  await expect(page.locator('.health-badge')).toContainText('正常進度');
  
  // 模擬進度變化 (透過 API mock)
  await page.route('**/api/sprint/burndown', async route => {
    await route.fulfill({ 
      json: warningStateData 
    });
  });
  
  // 重新整理並檢查警示狀態
  await page.reload();
  await expect(page.locator('.health-badge')).toContainText('稍微落後');
  
  // 檢查 Tooltip 功能
  await page.hover('[data-day="9"]');
  await expect(page.locator('.tooltip')).toContainText('實際剩餘: 未來日期');
});
```

### 📋 最終驗收檢查清單

#### ✅ AC01 最終檢查
- [ ] 正常進度時所有視覺元素正確
- [ ] 綠色主題一致性
- [ ] 數據計算準確性
- [ ] 響應式設計適配

#### ⚠️ AC02 最終檢查  
- [ ] 黃色警示觸發條件準確
- [ ] 警示訊息顯示正確
- [ ] 與其他狀態切換流暢
- [ ] 使用者體驗良好

#### 🔴 AC03 最終檢查
- [ ] 紅色危險警示效果顯著
- [ ] 行動建議按鈕功能完整
- [ ] 視覺強化適度不刺眼
- [ ] 瀏覽器通知正常

#### ⏰ AC04 最終檢查
- [ ] 時間邊界處理完全正確
- [ ] 工作日計算邏輯無誤
- [ ] 未來日期處理符合規格
- [ ] 所有邊界案例通過

#### 🔗 整體整合檢查
- [ ] 所有功能協作無衝突
- [ ] 性能表現符合要求 (載入 < 3秒)
- [ ] 記憶體使用合理
- [ ] 跨瀏覽器相容性良好
- [ ] 無控制台錯誤或警告
- [ ] 使用者體驗流暢自然

---

## 📋 風險評估與備案

### 🚨 潛在風險

1. **資料計算複雜性**: 工作日計算可能遇到節假日處理問題
   - **備案**: 先實現基礎週末排除，節假日功能後續擴展

2. **圖表庫限制**: Recharts 可能無法完全滿足自訂需求
   - **備案**: 準備 Chart.js 或 D3.js 作為替代方案

3. **性能考量**: 複雜動畫可能影響低端設備性能
   - **備案**: 提供簡化模式或動畫開關

4. **瀏覽器相容性**: 通知 API 在某些環境可能不支援
   - **備案**: 優雅降級到頁面內通知

### 🎯 成功指標

- **功能完整性**: 所有 28 個檢查項目通過
- **性能指標**: 頁面載入時間 < 3秒，互動響應 < 100ms
- **品質指標**: 測試覆蓋率 > 80%，零控制台錯誤
- **使用者體驗**: 團隊回饋評分 > 4/5

---

## 📝 變更記錄

| 日期         | 版本 | 變更內容 | 變更人    |
| ------------ | ---- | -------- | --------- |
| 2025-09-04   | 1.0  | 初版實作計畫，完整定義 4 階段實作流程 | Team4 |
