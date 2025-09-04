# Team 4 - Acceptance Criteria (Copilot Advanced)

## User Story
作為開發團隊成員，我希望儀表板能顯示每個功能對用戶或業務的影響力，讓我能聚焦在真正重要的開發項目上。

---

## Acceptance Criteria

### AC01: 顯示功能的商業價值指標
```gherkin
場景：儀表板顯示每個功能的商業價值
Given 使用者已開啟 Jira Dashboard 頁面
When 系統載入 rawData 表的資料
Then 每個功能（Issue）應顯示其 BusinessPoints 欄位的數值
And 若 BusinessPoints 欄位為空，則顯示為 0 或「未評估」
```

### AC02: 依據影響力排序或標示重要功能
```gherkin
場景：儀表板可依據功能影響力排序或標示
Given 使用者於儀表板瀏覽功能列表
When 系統根據 BusinessPoints 欄位進行排序或高亮顯示高分項目
Then 影響力高（BusinessPoints 分數高）的功能應明顯標示或排序在前
And 使用者能一目了然辨識出重要功能
```

### AC03: 支援影響力篩選功能
```gherkin
場景：使用者可依影響力篩選功能
Given 使用者於儀表板操作篩選器
When 選擇「僅顯示高影響力」或自訂分數區間
Then 系統僅顯示 BusinessPoints 達指定門檻的功能
And 其他功能將被隱藏或淡化顯示
```
