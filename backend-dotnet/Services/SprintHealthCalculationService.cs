using JiraDashboard.Models;

namespace JiraDashboard.Services;

/// <summary>
/// Sprint 健康狀態計算服務
/// 根據 AC01-AC04 規格實作健康狀態判定邏輯
/// </summary>
public class SprintHealthCalculationService
{
    /// <summary>
    /// 根據實際進度和理想進度計算健康狀態
    /// AC01: 正常狀態 (≥90% of ideal progress)
    /// AC02: 警示狀態 (75%-90% of ideal progress) 
    /// AC03: 危險狀態 (<75% of ideal progress)
    /// </summary>
    /// <param name="actualProgress">實際完成率 (0-100)</param>
    /// <param name="idealProgress">理想完成率 (0-100)</param>
    /// <returns>健康狀態物件</returns>
    public static HealthStatus CalculateHealthStatus(double actualProgress, double idealProgress)
    {
        // 避免除零錯誤
        if (idealProgress <= 0)
        {
            return new HealthStatus("normal", "#10B981", "正常進度", 1.0);
        }

        var progressRatio = actualProgress / idealProgress;

        return progressRatio switch
        {
            >= 0.9 => new HealthStatus("normal", "#10B981", "正常進度", progressRatio),
            >= 0.75 => new HealthStatus("warning", "#F59E0B", "稍微落後", progressRatio),
            _ => new HealthStatus("danger", "#EF4444", "嚴重落後", progressRatio)
        };
    }

    /// <summary>
    /// 計算工作日數量（排除週末）
    /// AC04: 正確處理工作日計算
    /// </summary>
    /// <param name="startDate">開始日期</param>
    /// <param name="endDate">結束日期</param>
    /// <returns>工作日數量</returns>
    public static int CalculateWorkingDays(DateTime startDate, DateTime endDate)
    {
        if (startDate >= endDate) return 0;

        var workingDays = 0;
        var current = startDate;

        while (current < endDate)
        {
            // 排除週末 (Saturday = 6, Sunday = 0)
            if (current.DayOfWeek != DayOfWeek.Saturday && current.DayOfWeek != DayOfWeek.Sunday)
            {
                workingDays++;
            }
            current = current.AddDays(1);
        }

        return workingDays;
    }

    /// <summary>
    /// 獲取當前工作日編號
    /// AC04: 正確識別當前工作日位置
    /// </summary>
    /// <param name="sprintStartDate">Sprint 開始日期</param>
    /// <param name="currentDate">當前日期</param>
    /// <returns>當前工作日編號 (從1開始)</returns>
    public static int GetCurrentWorkingDay(DateTime sprintStartDate, DateTime currentDate)
    {
        if (currentDate < sprintStartDate) return 0;

        return CalculateWorkingDays(sprintStartDate, currentDate) + 1;
    }

    /// <summary>
    /// 生成燃盡圖每日進度資料
    /// AC01: 理想線完整顯示
    /// AC04: 實際線僅到當前工作日，未來日期為 null
    /// </summary>
    /// <param name="startDate">Sprint 開始日期</param>
    /// <param name="endDate">Sprint 結束日期</param>
    /// <param name="currentDate">當前日期</param>
    /// <param name="totalStoryPoints">總故事點數</param>
    /// <param name="sprintIssues">Sprint 議題資料</param>
    /// <param name="storyPointsColumn">故事點數欄位名稱</param>
    /// <returns>每日進度資料清單</returns>
    public static List<DailyProgress> GenerateBurndownData(
        DateTime startDate, 
        DateTime endDate, 
        DateTime currentDate,
        double totalStoryPoints, 
        List<Dictionary<string, object?>> sprintIssues, 
        string storyPointsColumn)
    {
        var dailyProgress = new List<DailyProgress>();
        var current = startDate;
        var dayNumber = 0;
        var totalWorkingDays = CalculateWorkingDays(startDate, endDate);
        var currentWorkingDay = GetCurrentWorkingDay(startDate, currentDate);

        while (current <= endDate)
        {
            var isWorkingDay = current.DayOfWeek != DayOfWeek.Saturday && 
                              current.DayOfWeek != DayOfWeek.Sunday;

            if (isWorkingDay)
            {
                dayNumber++;
                
                // AC01: 理想燃盡線 - 完整顯示到 Sprint 結束
                var idealRemaining = totalWorkingDays > 0 
                    ? totalStoryPoints * (1.0 - (double)dayNumber / totalWorkingDays)
                    : totalStoryPoints;

                // AC04: 實際燃盡線 - 僅顯示到當前工作日
                double? actualRemaining = null;
                var isFuture = dayNumber > currentWorkingDay;
                
                if (!isFuture)
                {
                    var completedByDate = sprintIssues
                        .Where(row => IsDoneStatus(row) && IsResolvedByDate(row, current))
                        .Sum(row => ParseStoryPoints(row, storyPointsColumn));
                    
                    actualRemaining = totalStoryPoints - completedByDate;
                }

                dailyProgress.Add(new DailyProgress(
                    Day: dayNumber,
                    Date: current.ToString("yyyy-MM-dd"),
                    IdealRemaining: Math.Round(idealRemaining, 2),
                    ActualRemaining: actualRemaining.HasValue ? Math.Round(actualRemaining.Value, 2) : null,
                    IsWorkingDay: true,
                    IsFuture: isFuture
                ));
            }

            current = current.AddDays(1);
        }

        return dailyProgress;
    }

    #region 輔助方法

    private static bool IsDoneStatus(Dictionary<string, object?> row)
    {
        var status = GetStatusValue(row);
        if (string.IsNullOrEmpty(status)) return false;
        
        var statusLower = status.ToLower();
        return statusLower.Contains("done") || 
               statusLower.Contains("resolved") || 
               statusLower.Contains("closed");
    }

    private static string? GetStatusValue(Dictionary<string, object?> row)
    {
        // 尋找 status 相關欄位
        var statusKeys = row.Keys.Where(k => k.ToLower().Contains("status")).ToList();
        if (statusKeys.Any())
        {
            var statusKey = statusKeys.First();
            return row[statusKey]?.ToString();
        }
        
        // 備選：直接找 status 欄位
        return row.TryGetValue("status", out var status) ? status?.ToString() : null;
    }

    private static bool IsResolvedByDate(Dictionary<string, object?> row, DateTime date)
    {
        var resolvedValue = row.ContainsKey("resolved") ? row["resolved"]?.ToString() : null;
        if (string.IsNullOrEmpty(resolvedValue)) return false;

        if (TryParseDateTime(resolvedValue) is DateTime resolvedDate)
        {
            return resolvedDate.Date <= date.Date;
        }

        return false;
    }

    private static DateTime? TryParseDateTime(string? dateStr)
    {
        if (string.IsNullOrWhiteSpace(dateStr)) return null;

        var formats = new[] {
            "yyyy-MM-dd HH:mm:ss",
            "yyyy-MM-dd",
            "M/d/yyyy H:mm:ss",
            "M/d/yyyy",
            "MM/dd/yyyy HH:mm:ss",
            "MM/dd/yyyy"
        };

        foreach (var format in formats)
        {
            if (DateTime.TryParseExact(dateStr, format, System.Globalization.CultureInfo.InvariantCulture, 
                System.Globalization.DateTimeStyles.None, out var result))
            {
                return result;
            }
        }

        if (DateTime.TryParse(dateStr, out var parsed))
        {
            return parsed;
        }

        return null;
    }

    private static double ParseStoryPoints(Dictionary<string, object?> row, string storyPointsColumn)
    {
        if (row.TryGetValue(storyPointsColumn, out var value) && value != null)
        {
            if (double.TryParse(value.ToString(), out var points))
            {
                return points;
            }
        }
        return 0;
    }

    #endregion
}
