# Acceptance Criteria for US-004

---

## User Story
作為產品經理，我希望在 Jira Dashboard 上能快速判斷每個功能的使用者價值與業務影響力，以便優先規劃高價值的功能，避免團隊資源浪費在低影響力項目。

---

## Acceptance Criteria

### AC-1
場景：產品經理瀏覽 Jira Dashboard
Given Jira Dashboard 已串接 Google Sheets 並取得 rawData
When 產品經理查看功能列表
Then 每個功能均顯示「使用者價值」與「業務影響力」指標（如 BusinessPoints、Story Points）
And 指標資料來源符合 table-schema.md 定義

### AC-2
場景：產品經理依據指標排序功能
Given Dashboard 顯示所有功能指標
When 產品經理選擇排序依據（如 BusinessPoints 或 Story Points）
Then 功能列表依據選定指標正確排序
And 排序邏輯符合目前技術架構（前端 Next.js 排序，資料來源為 Google Sheets）

### AC-3
場景：低價值/低影響力功能標示
Given Dashboard 顯示所有功能指標
When 某功能的 BusinessPoints 或 Story Points 低於預設門檻
Then 該功能於列表中以明顯方式標示（如顏色或 icon）
And 標示方式不影響現有資料結構與前端架構

---

> 以上 AC 依據 acceptance-criteria-guide.md Gherkin 格式撰寫，並考量 tech-overview.md 架構與 table-schema.md 資料來源。
