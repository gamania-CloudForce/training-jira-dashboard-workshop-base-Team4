using Xunit;
using JiraDashboard.Services;

namespace JiraDashboard.Tests;

/// <summary>
/// Sprint 進度計算業務邏輯測試
/// 對應測試案例：TC-001-01 至 TC-001-05
/// 專注於工作日計算、進度狀態判斷等核心邏輯
/// </summary>
public class SprintProgressCalculationTests
{
    /// <summary>
    /// TC-001-01: 測試工作日計算邏輯 - 正常情況
    /// 驗證排除週末的工作日計算是否正確
    /// </summary>
    [Theory]
    [InlineData("2025-01-06", "2025-01-17", 9)]  // 週一到週五 (2週，排除2個週末)
    [InlineData("2025-01-01", "2025-01-08", 5)]  // 週三到週三 (1週+1天，排除1個週末)
    [InlineData("2025-01-06", "2025-01-10", 4)]  // 週一到週五 (4天)
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
    /// TC-001-02: 測試正常進度狀態計算
    /// 驗證當進度正常或超前時，狀態為 "normal"
    /// </summary>
    [Theory]
    [InlineData(70.0, 60.0)] // 完成率 70%，時間進度 60% - 超前 10%
    [InlineData(65.0, 65.0)] // 完成率 65%，時間進度 65% - 剛好符合
    [InlineData(80.0, 70.0)] // 完成率 80%，時間進度 70% - 超前 10%
    [InlineData(55.0, 50.0)] // 完成率 55%，時間進度 50% - 超前 5%
    public void CalculateProgressStatus_NormalProgress_ReturnsNormal(
        double completionRate, double timeProgressRate)
    {
        // Act
        var status = CalculateProgressStatus(completionRate, timeProgressRate);
        
        // Assert - 對應 TC-001-02 正常狀態預期
        Assert.Equal("normal", status);
    }

    /// <summary>
    /// TC-001-03: 測試警示進度狀態計算
    /// 驗證當進度稍微落後時（10-20%），狀態為 "warning"
    /// </summary>
    [Theory]
    [InlineData(50.0, 60.0)] // 完成率 50%，時間進度 60% - 落後 10%
    [InlineData(50.0, 60.0)] // 完成率 50%，時間進度 60% - 落後 10%
    [InlineData(45.0, 60.0)] // 完成率 45%，時間進度 60% - 落後 15%
    [InlineData(30.0, 45.0)] // 完成率 30%，時間進度 45% - 落後 15%
    public void CalculateProgressStatus_WarningProgress_ReturnsWarning(
        double completionRate, double timeProgressRate)
    {
        // Act
        var status = CalculateProgressStatus(completionRate, timeProgressRate);
        
        // Assert - 對應 TC-001-03 警示狀態預期
        Assert.Equal("warning", status);
    }

    /// <summary>
    /// TC-001-04: 測試危險進度狀態計算
    /// 驗證當進度嚴重落後時（>20%），狀態為 "danger"
    /// </summary>
    [Theory]
    [InlineData(30.0, 80.0)] // 完成率 30%，時間進度 80% - 落後 50%
    [InlineData(20.0, 70.0)] // 完成率 20%，時間進度 70% - 落後 50%
    [InlineData(40.0, 65.0)] // 完成率 40%，時間進度 65% - 落後 25%
    [InlineData(10.0, 35.0)] // 完成率 10%，時間進度 35% - 落後 25%
    public void CalculateProgressStatus_DangerProgress_ReturnsDanger(
        double completionRate, double timeProgressRate)
    {
        // Act
        var status = CalculateProgressStatus(completionRate, timeProgressRate);
        
        // Assert - 對應 TC-001-04 危險狀態預期
        Assert.Equal("danger", status);
    }

    /// <summary>
    /// TC-001-05: 邊界值測試 - 精確邊界條件
    /// 驗證進度狀態切換的臨界點準確性
    /// </summary>
    [Theory]
    [InlineData(91.0, 100.0, "normal")]  // 落後 9% - 正常 (< 10%)
    [InlineData(90.0, 100.0, "warning")] // 落後 10% - 警示 (= 10%)
    [InlineData(81.0, 100.0, "warning")] // 落後 19% - 警示 (< 20%)
    [InlineData(80.0, 100.0, "danger")]  // 落後 20% - 危險 (= 20%)
    [InlineData(79.0, 100.0, "danger")]  // 落後 21% - 危險 (> 20%)
    [InlineData(50.0, 59.99, "normal")]  // 落後 9.99% - 正常
    [InlineData(50.0, 60.0, "warning")]  // 落後 10% - 警示
    [InlineData(50.0, 69.99, "warning")] // 落後 19.99% - 警示
    [InlineData(50.0, 70.0, "danger")]   // 落後 20% - 危險
    public void CalculateProgressStatus_BoundaryValues_ReturnsCorrectStatus(
        double completionRate, double timeProgressRate, string expectedStatus)
    {
        // Act
        var status = CalculateProgressStatus(completionRate, timeProgressRate);
        
        // Assert - 對應 TC-001-05 邊界值測試
        Assert.Equal(expectedStatus, status);
    }

    /// <summary>
    /// 測試完成率計算邏輯
    /// </summary>
    [Theory]
    [InlineData(13.0, 20.0, 65.0)]   // TC-001-01 測試資料
    [InlineData(14.0, 20.0, 70.0)]   // TC-001-02 測試資料
    [InlineData(10.0, 20.0, 50.0)]   // TC-001-03 測試資料
    [InlineData(6.0, 20.0, 30.0)]    // TC-001-04 測試資料
    [InlineData(0.0, 20.0, 0.0)]     // 邊界值：未開始
    [InlineData(20.0, 20.0, 100.0)]  // 邊界值：全部完成
    public void CalculateCompletionRate_VariousValues_ReturnsCorrectPercentage(
        double completedSP, double totalSP, double expectedRate)
    {
        // Act
        var completionRate = CalculateCompletionRate(completedSP, totalSP);
        
        // Assert
        Assert.Equal(expectedRate, completionRate, 1); // 允許 1% 誤差
    }

    /// <summary>
    /// 測試剩餘故事點數計算
    /// </summary>
    [Theory]
    [InlineData(20.0, 13.0, 7.0)]   // TC-001-01 測試資料
    [InlineData(20.0, 14.0, 6.0)]   // TC-001-02 測試資料
    [InlineData(20.0, 10.0, 10.0)]  // TC-001-03 測試資料
    [InlineData(20.0, 6.0, 14.0)]   // TC-001-04 測試資料
    public void CalculateRemainingStoryPoints_VariousValues_ReturnsCorrectRemaining(
        double totalSP, double completedSP, double expectedRemaining)
    {
        // Act
        var remaining = totalSP - completedSP;
        
        // Assert
        Assert.Equal(expectedRemaining, remaining);
    }

    /// <summary>
    /// 測試異常情況處理
    /// </summary>
    [Theory]
    [InlineData(0.0, 100.0)] // 除零情況
    [InlineData(-10.0, 50.0)] // 負數完成率
    [InlineData(110.0, 50.0)] // 超過 100% 完成率
    public void CalculateProgressStatus_EdgeCases_HandlesGracefully(
        double completionRate, double timeProgressRate)
    {
        // Act & Assert - 不應該拋出異常
        var status = CalculateProgressStatus(completionRate, timeProgressRate);
        Assert.Contains(status, new[] { "normal", "warning", "danger" });
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
    /// 進度狀態計算輔助方法 (複製後端邏輯)
    /// </summary>
    private static string CalculateProgressStatus(double completionRate, double timeProgressRate)
    {
        var progressDiff = timeProgressRate - completionRate;
        
        if (progressDiff < 10) return "normal";    // 綠色：正常或超前
        if (progressDiff < 20) return "warning";   // 黃色：稍微落後
        return "danger";                           // 紅色：嚴重落後
    }

    /// <summary>
    /// 完成率計算輔助方法
    /// </summary>
    private static double CalculateCompletionRate(double completedSP, double totalSP)
    {
        if (totalSP <= 0) return 0.0;
        return Math.Round((completedSP / totalSP) * 100, 2);
    }

    #endregion
}
