using Xunit;
using JiraDashboard.Services;
using JiraDashboard.Models;

namespace JiraDashboard.Tests;

/// <summary>
/// Sprint 健康狀態計算服務的單元測試
/// 驗證 AC01-AC04 的計算邏輯正確性
/// </summary>
public class SprintHealthCalculationServiceTests
{
    #region AC01 測試 - 正常進度狀態

    [Fact]
    public void CalculateHealthStatus_NormalProgress_ReturnsNormalStatus()
    {
        // Arrange: 實際進度符合或超前理想進度 (≥90%)
        double actualProgress = 90;
        double idealProgress = 100;

        // Act
        var result = SprintHealthCalculationService.CalculateHealthStatus(actualProgress, idealProgress);

        // Assert
        Assert.Equal("normal", result.Status);
        Assert.Equal("#10B981", result.Color);
        Assert.Equal("正常進度", result.Message);
        Assert.Equal(0.9, result.ProgressRatio, 3);
    }

    [Fact]
    public void CalculateHealthStatus_AheadOfSchedule_ReturnsNormalStatus()
    {
        // Arrange: 實際進度超前理想進度
        double actualProgress = 110;
        double idealProgress = 100;

        // Act
        var result = SprintHealthCalculationService.CalculateHealthStatus(actualProgress, idealProgress);

        // Assert
        Assert.Equal("normal", result.Status);
        Assert.Equal("#10B981", result.Color);
        Assert.Equal("正常進度", result.Message);
        Assert.Equal(1.1, result.ProgressRatio, 3);
    }

    #endregion

    #region AC02 測試 - 警示狀態 (稍微落後)

    [Fact]
    public void CalculateHealthStatus_WarningProgress_ReturnsWarningStatus()
    {
        // Arrange: 實際進度落後 10-25% (75%-90% 之間)
        double actualProgress = 80;
        double idealProgress = 100;

        // Act
        var result = SprintHealthCalculationService.CalculateHealthStatus(actualProgress, idealProgress);

        // Assert
        Assert.Equal("warning", result.Status);
        Assert.Equal("#F59E0B", result.Color);
        Assert.Equal("稍微落後", result.Message);
        Assert.Equal(0.8, result.ProgressRatio, 3);
    }

    [Fact]
    public void CalculateHealthStatus_WarningBoundary75_ReturnsWarningStatus()
    {
        // Arrange: 邊界值測試 - 恰好 75%
        double actualProgress = 75;
        double idealProgress = 100;

        // Act
        var result = SprintHealthCalculationService.CalculateHealthStatus(actualProgress, idealProgress);

        // Assert
        Assert.Equal("warning", result.Status);
        Assert.Equal("#F59E0B", result.Color);
        Assert.Equal("稍微落後", result.Message);
    }

    [Fact]
    public void CalculateHealthStatus_WarningBoundary89_ReturnsWarningStatus()
    {
        // Arrange: 邊界值測試 - 恰好 89%
        double actualProgress = 89;
        double idealProgress = 100;

        // Act
        var result = SprintHealthCalculationService.CalculateHealthStatus(actualProgress, idealProgress);

        // Assert
        Assert.Equal("warning", result.Status);
        Assert.Equal("#F59E0B", result.Color);
        Assert.Equal("稍微落後", result.Message);
    }

    #endregion

    #region AC03 測試 - 危險狀態 (嚴重落後)

    [Fact]
    public void CalculateHealthStatus_DangerProgress_ReturnsDangerStatus()
    {
        // Arrange: 實際進度落後超過 25% (<75%)
        double actualProgress = 70;
        double idealProgress = 100;

        // Act
        var result = SprintHealthCalculationService.CalculateHealthStatus(actualProgress, idealProgress);

        // Assert
        Assert.Equal("danger", result.Status);
        Assert.Equal("#EF4444", result.Color);
        Assert.Equal("嚴重落後", result.Message);
        Assert.Equal(0.7, result.ProgressRatio, 3);
    }

    [Fact]
    public void CalculateHealthStatus_SeverelyBehind_ReturnsDangerStatus()
    {
        // Arrange: 嚴重落後情況
        double actualProgress = 50;
        double idealProgress = 100;

        // Act
        var result = SprintHealthCalculationService.CalculateHealthStatus(actualProgress, idealProgress);

        // Assert
        Assert.Equal("danger", result.Status);
        Assert.Equal("#EF4444", result.Color);
        Assert.Equal("嚴重落後", result.Message);
        Assert.Equal(0.5, result.ProgressRatio, 3);
    }

    #endregion

    #region AC04 測試 - 時間邊界處理

    [Fact]
    public void CalculateWorkingDays_ExcludesWeekends_ReturnsCorrectCount()
    {
        // Arrange: 包含週末的日期範圍 (2025-09-01 Mon to 2025-09-12 Fri = 10 working days)
        var startDate = new DateTime(2025, 9, 1);  // Monday
        var endDate = new DateTime(2025, 9, 12);   // Friday

        // Act
        var workingDays = SprintHealthCalculationService.CalculateWorkingDays(startDate, endDate);

        // Assert
        Assert.Equal(9, workingDays); // 9 working days (不包含結束日)
    }

    [Fact]
    public void GetCurrentWorkingDay_ValidRange_ReturnsCorrectDay()
    {
        // Arrange: Sprint 從週一開始，現在是週三
        var sprintStartDate = new DateTime(2025, 9, 1);  // Monday
        var currentDate = new DateTime(2025, 9, 3);      // Wednesday

        // Act
        var currentWorkingDay = SprintHealthCalculationService.GetCurrentWorkingDay(sprintStartDate, currentDate);

        // Assert
        Assert.Equal(3, currentWorkingDay); // Monday=1, Tuesday=2, Wednesday=3
    }

    [Fact]
    public void GetCurrentWorkingDay_BeforeSprintStart_ReturnsZero()
    {
        // Arrange: 當前日期在 Sprint 開始之前
        var sprintStartDate = new DateTime(2025, 9, 5);
        var currentDate = new DateTime(2025, 9, 1);

        // Act
        var currentWorkingDay = SprintHealthCalculationService.GetCurrentWorkingDay(sprintStartDate, currentDate);

        // Assert
        Assert.Equal(0, currentWorkingDay);
    }

    [Fact]
    public void GenerateBurndownData_FutureDays_HasNullActualData()
    {
        // Arrange
        var startDate = new DateTime(2025, 9, 1);
        var endDate = new DateTime(2025, 9, 10);
        var currentDate = new DateTime(2025, 9, 5); // 在 Sprint 中間
        var totalStoryPoints = 100.0;
        var sprintIssues = new List<Dictionary<string, object?>>(); // 空 issues 列表

        // Act
        var result = SprintHealthCalculationService.GenerateBurndownData(
            startDate, endDate, currentDate, totalStoryPoints, sprintIssues, "Story Points");

        // Assert
        var futureDays = result.Where(d => d.IsFuture).ToList();
        var pastAndCurrentDays = result.Where(d => !d.IsFuture).ToList();

        // 未來日期應該有 null 的實際數據
        Assert.True(futureDays.All(d => d.ActualRemaining == null));
        
        // 過去和當前日期應該有實際數據
        Assert.True(pastAndCurrentDays.All(d => d.ActualRemaining != null));
    }

    #endregion

    #region 邊界案例測試

    [Fact]
    public void CalculateHealthStatus_ZeroIdealProgress_ReturnsNormalStatus()
    {
        // Arrange: 避免除零錯誤的邊界案例
        double actualProgress = 50;
        double idealProgress = 0;

        // Act
        var result = SprintHealthCalculationService.CalculateHealthStatus(actualProgress, idealProgress);

        // Assert
        Assert.Equal("normal", result.Status);
        Assert.Equal(1.0, result.ProgressRatio, 3);
    }

    [Fact]
    public void CalculateWorkingDays_SameDates_ReturnsZero()
    {
        // Arrange: 開始和結束日期相同
        var date = new DateTime(2025, 9, 1);

        // Act
        var workingDays = SprintHealthCalculationService.CalculateWorkingDays(date, date);

        // Assert
        Assert.Equal(0, workingDays);
    }

    [Fact]
    public void CalculateWorkingDays_EndBeforeStart_ReturnsZero()
    {
        // Arrange: 結束日期早於開始日期
        var startDate = new DateTime(2025, 9, 10);
        var endDate = new DateTime(2025, 9, 1);

        // Act
        var workingDays = SprintHealthCalculationService.CalculateWorkingDays(startDate, endDate);

        // Assert
        Assert.Equal(0, workingDays);
    }

    #endregion
}
