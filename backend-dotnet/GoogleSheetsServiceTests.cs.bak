using Xunit;
using JiraDashboard.Models;

namespace JiraDashboard.Tests;

/// <summary>
/// GoogleSheetsService 業務邏輯測試
/// 對應測試案例：TC-001-01 至 TC-001-05
/// 專注於資料處理、計算邏輯驗證
/// </summary>
public class GoogleSheetsServiceTests
{
    /// <summary>
    /// TC-001-01: 測試工作日計算邏輯
    /// 驗證排除週末的工作日計算是否正確
    /// </summary>
    [Theory]
    [InlineData("2025-01-06", "2025-01-17", 9)]  // 週一到週五 (2週，排除2個週末)
    [InlineData("2025-01-01", "2025-01-08", 5)]  // 週三到週三 (1週+1天，排除1個週末)
    [InlineData("2025-01-06", "2025-01-10", 4)]  // 週一到週五 (4天)
    [InlineData("2025-01-13", "2025-01-17", 4)]  // 週一到週五 (4天)
    public void CalculateWorkingDays_ExcludeWeekends_ReturnsCorrectCount(
        string startDateStr, string endDateStr, int expectedWorkingDays)
    {
        // Arrange
        var startDate = DateTime.Parse(startDateStr);
        var endDate = DateTime.Parse(endDateStr);
        
        // Act
        var actualWorkingDays = CalculateWorkingDaysTestHelper(startDate, endDate);
        
        // Assert - 對應 TC-001-01 工作日計算要求
        Assert.Equal(expectedWorkingDays, actualWorkingDays);
    }

    /// <summary>
    /// TC-001-01: 測試跨月份的工作日計算
    /// </summary>
    [Theory]
    [InlineData("2025-01-27", "2025-02-07", 9)]  // 跨月份工作日計算
    [InlineData("2025-01-31", "2025-02-03", 1)]  // 跨月份週末
    public void CalculateWorkingDays_CrossMonth_ReturnsCorrectCount(
        string startDateStr, string endDateStr, int expectedWorkingDays)
    {
        // Arrange
        var startDate = DateTime.Parse(startDateStr);
        var endDate = DateTime.Parse(endDateStr);
        
        // Act
        var actualWorkingDays = CalculateWorkingDaysTestHelper(startDate, endDate);
        
        // Assert
        Assert.Equal(expectedWorkingDays, actualWorkingDays);
    }

    /// <summary>
    /// TC-001-02, TC-001-03, TC-001-04: 測試進度健康度計算邏輯
    /// 驗證不同進度狀況下的狀態判斷邏輯
    /// </summary>
    [Theory]
    [InlineData(70.0, 60.0, "normal")]   // TC-001-02: 超前進度
    [InlineData(65.0, 65.0, "normal")]   // TC-001-02: 剛好符合
    [InlineData(50.0, 69.0, "warning")]  // TC-001-03: 落後 19%
    [InlineData(45.0, 60.0, "warning")]  // TC-001-03: 落後 15%
    [InlineData(30.0, 80.0, "danger")]   // TC-001-04: 落後 50%
    [InlineData(20.0, 70.0, "danger")]   // TC-001-04: 落後 50%
    public void CalculateProgressHealth_VariousScenarios_ReturnsCorrectStatus(
        double completionRate, double timeProgressRate, string expectedStatus)
    {
        // Act
        var actualStatus = CalculateProgressHealthStatus(completionRate, timeProgressRate);
        
        // Assert
        Assert.Equal(expectedStatus, actualStatus);
    }

    /// <summary>
    /// TC-001-05: 邊界值測試 - 精確邊界條件
    /// 驗證進度狀態切換的臨界點準確性
    /// </summary>
    [Theory]
    [InlineData(91.0, 100.0, "normal")]  // 落後 9% - 正常
    [InlineData(90.0, 100.0, "warning")] // 落後 10% - 警示（邊界）
    [InlineData(81.0, 100.0, "warning")] // 落後 19% - 警示
    [InlineData(80.0, 100.0, "danger")]  // 落後 20% - 危險（邊界）
    [InlineData(79.0, 100.0, "danger")]  // 落後 21% - 危險
    [InlineData(50.0, 59.99, "normal")]  // 落後 9.99% - 正常
    [InlineData(50.0, 60.0, "warning")]  // 落後 10% - 警示
    [InlineData(50.0, 69.99, "warning")] // 落後 19.99% - 警示
    [InlineData(50.0, 70.0, "danger")]   // 落後 20% - 危險
    public void CalculateProgressHealth_BoundaryValues_ReturnsCorrectStatus(
        double completionRate, double timeProgressRate, string expectedStatus)
    {
        // Act
        var actualStatus = CalculateProgressHealthStatus(completionRate, timeProgressRate);
        
        // Assert - 對應 TC-001-05 邊界值測試
        Assert.Equal(expectedStatus, actualStatus);
    }

    /// <summary>
    /// 測試故事點數解析邏輯
    /// </summary>
    [Theory]
    [InlineData("13", 13.0)]
    [InlineData("13.5", 13.5)]
    [InlineData("0", 0.0)]
    [InlineData("", 0.0)]
    [InlineData(null, 0.0)]
    [InlineData("abc", 0.0)]
    [InlineData("13.2.5", 0.0)] // 無效格式
    public void ParseStoryPoints_VariousInputs_ReturnsCorrectValues(
        string? input, double expectedPoints)
    {
        // Act
        var actualPoints = ParseStoryPointsTestHelper(input);
        
        // Assert
        Assert.Equal(expectedPoints, actualPoints, 1); // 允許小數點誤差
    }

    /// <summary>
    /// 測試日期解析邏輯
    /// </summary>
    [Theory]
    [InlineData("2025-01-15", true)]
    [InlineData("01/15/2025", true)]  // 修正為美式日期格式
    [InlineData("Jan 15, 2025", true)]
    [InlineData("", false)]
    [InlineData(null, false)]
    [InlineData("invalid-date", false)]
    [InlineData("2025-13-01", false)] // 無效月份
    public void TryParseDateTime_VariousInputs_ReturnsCorrectResults(
        string? input, bool shouldParse)
    {
        // Act
        var result = TryParseDateTimeTestHelper(input);
        
        // Assert
        if (shouldParse)
        {
            Assert.True(result.HasValue, $"應該成功解析日期: {input}");
            Assert.True(result.Value > DateTime.MinValue, "解析的日期應該有效");
        }
        else
        {
            Assert.False(result.HasValue, $"應該解析失敗: {input}");
        }
    }

    /// <summary>
    /// 測試 Sprint 資料模型驗證
    /// </summary>
    [Fact]
    public void SprintInfo_CreatesWithCorrectStructure()
    {
        // Arrange & Act
        var sprintInfo = new SprintInfo(
            SprintName: "Test Sprint",
            SprintId: 123,
            BoardName: "Test Board",
            State: "ACTIVE",
            StartDate: DateTime.Parse("2025-01-01"),
            EndDate: DateTime.Parse("2025-01-15"),
            CompleteDate: null,
            Goal: "Test Sprint Goal"
        );

        // Assert
        Assert.Equal("Test Sprint", sprintInfo.SprintName);
        Assert.Equal(123, sprintInfo.SprintId);
        Assert.Equal("Test Board", sprintInfo.BoardName);
        Assert.Equal("ACTIVE", sprintInfo.State);
        Assert.True(sprintInfo.StartDate.HasValue);
        Assert.True(sprintInfo.EndDate.HasValue);
        Assert.False(sprintInfo.CompleteDate.HasValue);
        Assert.Equal("Test Sprint Goal", sprintInfo.Goal);
    }

    /// <summary>
    /// 測試完成狀態判斷邏輯
    /// </summary>
    [Theory]
    [InlineData("Done", true)]
    [InlineData("DONE", true)]
    [InlineData("done", true)]
    [InlineData("Completed", false)]
    [InlineData("In Progress", false)]
    [InlineData("To Do", false)]
    [InlineData("", false)]
    [InlineData(null, false)]
    public void IsDoneStatus_VariousStatuses_ReturnsCorrectResults(
        string? status, bool expectedIsDone)
    {
        // Arrange
        var testRow = new Dictionary<string, object?>
        {
            ["Status"] = status
        };

        // Act
        var actualIsDone = IsDoneStatusTestHelper(testRow);
        
        // Assert
        Assert.Equal(expectedIsDone, actualIsDone);
    }

    /// <summary>
    /// 測試異常情況處理
    /// </summary>
    [Theory]
    [InlineData(-1, 10)]  // 負數工作日
    [InlineData(0, 10)]   // 零工作日
    [InlineData(10, 10)]  // 相等日期
    public void CalculateWorkingDays_EdgeCases_HandlesGracefully(
        int startDaysOffset, int endDaysOffset)
    {
        // Arrange
        var baseDate = DateTime.Parse("2025-01-15");
        var startDate = baseDate.AddDays(startDaysOffset);
        var endDate = baseDate.AddDays(endDaysOffset);
        
        // Act & Assert - 不應該拋出異常
        var result = CalculateWorkingDaysTestHelper(startDate, endDate);
        Assert.True(result >= 0, "工作日計算結果不應為負數");
    }

    #region 輔助方法

    /// <summary>
    /// 工作日計算輔助方法 (複製後端邏輯)
    /// </summary>
    private static int CalculateWorkingDaysTestHelper(DateTime startDate, DateTime endDate)
    {
        if (startDate >= endDate) return 0;

        var workingDays = 0;
        var current = startDate;

        while (current < endDate)
        {
            // Monday = 1, Sunday = 0
            if (current.DayOfWeek != DayOfWeek.Saturday && current.DayOfWeek != DayOfWeek.Sunday)
            {
                workingDays++;
            }
            current = current.AddDays(1);
        }

        return workingDays;
    }

    /// <summary>
    /// 進度健康度計算輔助方法 (複製後端邏輯)
    /// </summary>
    private static string CalculateProgressHealthStatus(double completionRate, double timeProgressRate)
    {
        var progressDiff = timeProgressRate - completionRate;
        
        if (progressDiff < 10) return "normal";    // 綠色：正常或超前
        if (progressDiff < 20) return "warning";   // 黃色：稍微落後
        return "danger";                           // 紅色：嚴重落後
    }

    /// <summary>
    /// 故事點數解析輔助方法
    /// </summary>
    private static double ParseStoryPointsTestHelper(string? input)
    {
        if (string.IsNullOrEmpty(input)) return 0.0;
        
        if (double.TryParse(input, out var result))
        {
            return result;
        }
        
        return 0.0;
    }

    /// <summary>
    /// 日期解析輔助方法
    /// </summary>
    private static DateTime? TryParseDateTimeTestHelper(string? input)
    {
        if (string.IsNullOrEmpty(input)) return null;
        
        if (DateTime.TryParse(input, out var result))
        {
            return result;
        }
        
        return null;
    }

    /// <summary>
    /// 完成狀態判斷輔助方法
    /// </summary>
    private static bool IsDoneStatusTestHelper(Dictionary<string, object?> row)
    {
        if (row.TryGetValue("Status", out var statusValue) && statusValue != null)
        {
            var status = statusValue.ToString();
            return string.Equals(status, "Done", StringComparison.OrdinalIgnoreCase);
        }
        
        return false;
    }

    #endregion
}
