# Acceptance Criteria: Sprint 進度落後視覺警示

---

## User Story
作為開發團隊成員，我希望當 Sprint 進度明顯落後時能看到明顯的視覺警示（進度條和燃盡線變為黃色或紅色），以便我能及時感受到時程壓力並主動調整工作優先級。

---

## 🎯 Acceptance Criteria

### AC01: 正常流程
場景：Sprint 進度落後時顯示警示
Given Sprint 進度低於預期門檻
When 使用者查看儀表板
Then 進度條顏色自動切換為黃色或紅色
And 燃盡圖實際線顏色同步變化
And 顯示健康狀態 badge

### AC02: 邊界條件
場景：進度剛好達到警示門檻
Given Sprint 進度等於警示門檻
When 使用者查看儀表板
Then 進度條顏色維持正常（綠色）
And 不顯示警示 badge

### AC03: 異常情況
場景：健康狀態計算錯誤
Given 進度健康度計算異常
When 使用者查看儀表板
Then 顯示錯誤訊息「健康狀態異常」
And 進度條與燃盡圖顏色維持預設狀態
