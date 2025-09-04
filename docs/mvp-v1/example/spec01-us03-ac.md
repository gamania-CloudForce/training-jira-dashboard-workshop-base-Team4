# Acceptance Criteria: Sprint 時間進度計時器

---

## User Story
作為團隊成員，我希望能看到 Sprint 的時間進度計時器（如：Day 7/10，剩餘 3 個工作日），以便直觀感受到時間的流逝，增強對截止日期的緊迫感。

---

## 🎯 Acceptance Criteria

### AC01: 正常流程
場景：顯示 Sprint 已過天數與剩餘天數
Given Sprint 已啟動
When 使用者查看進度卡片
Then 顯示已過天數、剩餘天數、總工作日
And 計算結果正確

### AC02: 邊界條件
場景：Sprint 剛開始或即將結束
Given Sprint 剛開始或剩餘 1 天
When 使用者查看計時器
Then 顯示正確的天數資訊
And 顯示「Sprint 剛開始」或「Sprint 即將結束」提示

### AC03: 異常情況
場景：Sprint 日期資料異常
Given Sprint 日期資料缺失或格式錯誤
When 使用者查看計時器
Then 顯示錯誤訊息「日期資料異常」
And 計時器區域顯示占位符
