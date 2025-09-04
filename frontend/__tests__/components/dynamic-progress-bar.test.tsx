/**
 * Dynamic Progress Bar Component Unit Tests
 * 測試動態進度條組件的所有功能
 */

import { render, screen } from '@testing-library/react';
import { DynamicProgressBar } from '@/components/dynamic-progress-bar';

// Mock health status data
const mockHealthStatus = {
  normal: {
    status: 'normal' as const,
    color: '#10B981',
    message: 'Sprint 進度正常',
    progress_ratio: 0.955
  },
  warning: {
    status: 'warning' as const,
    color: '#F59E0B', 
    message: 'Sprint 進度稍微落後',
    progress_ratio: 0.823
  },
  danger: {
    status: 'danger' as const,
    color: '#EF4444',
    message: 'Sprint 進度嚴重落後',
    progress_ratio: 0.687
  }
};

describe('DynamicProgressBar Component', () => {
  
  describe('Basic Functionality', () => {
    it('should render progress bar with correct percentage', () => {
      render(
        <DynamicProgressBar
          percentage={85.5}
          healthStatus={mockHealthStatus.normal}
          animated={false}
        />
      );

      // Check percentage display
      expect(screen.getByText('85.5%')).toBeInTheDocument();
    });

    it('should display progress label', () => {
      render(
        <DynamicProgressBar
          percentage={75}
          healthStatus={mockHealthStatus.normal}
        />
      );

      expect(screen.getByText('Sprint 進度')).toBeInTheDocument();
    });

    it('should handle 0% progress', () => {
      render(
        <DynamicProgressBar
          percentage={0}
          healthStatus={mockHealthStatus.normal}
        />
      );

      expect(screen.getByText('0.0%')).toBeInTheDocument();
    });

    it('should handle 100% progress', () => {
      render(
        <DynamicProgressBar
          percentage={100}
          healthStatus={mockHealthStatus.normal}
        />
      );

      expect(screen.getByText('100.0%')).toBeInTheDocument();
    });
  });

  describe('Health Status Color Integration', () => {
    it('should apply correct color style for normal status', () => {
      const { container } = render(
        <DynamicProgressBar
          percentage={90}
          healthStatus={mockHealthStatus.normal}
        />
      );

      const progressBar = container.querySelector('[style*="#10B981"]');
      expect(progressBar).toBeInTheDocument();
    });

    it('should apply correct color style for warning status', () => {
      const { container } = render(
        <DynamicProgressBar
          percentage={80}
          healthStatus={mockHealthStatus.warning}
        />
      );

      const progressBar = container.querySelector('[style*="#F59E0B"]');
      expect(progressBar).toBeInTheDocument();
    });

    it('should apply correct color style for danger status', () => {
      const { container } = render(
        <DynamicProgressBar
          percentage={60}
          healthStatus={mockHealthStatus.danger}
        />
      );

      const progressBar = container.querySelector('[style*="#EF4444"]');
      expect(progressBar).toBeInTheDocument();
    });

    it('should display health status message', () => {
      render(
        <DynamicProgressBar
          percentage={85}
          healthStatus={mockHealthStatus.warning}
        />
      );

      expect(screen.getByText('Sprint 進度稍微落後')).toBeInTheDocument();
    });
  });

  describe('Animation Behavior', () => {
    it('should have transition classes when animated=true', () => {
      const { container } = render(
        <DynamicProgressBar
          percentage={85}
          healthStatus={mockHealthStatus.normal}
          animated={true}
        />
      );

      const progressBar = container.querySelector('[class*="transition-all"]');
      expect(progressBar).toBeInTheDocument();
    });

    it('should have transition classes when animated=false', () => {
      const { container } = render(
        <DynamicProgressBar
          percentage={85}
          healthStatus={mockHealthStatus.normal}
          animated={false}
        />
      );

      // Should still have basic transition class
      const progressBar = container.querySelector('[class*="transition-all"]');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('Custom Styling Options', () => {
    it('should apply custom className', () => {
      const customClass = 'custom-progress-class';
      const { container } = render(
        <DynamicProgressBar
          percentage={75}
          healthStatus={mockHealthStatus.normal}
          className={customClass}
        />
      );

      expect(container.firstChild).toHaveClass(customClass);
    });

    it('should hide percentage when showPercentage=false', () => {
      render(
        <DynamicProgressBar
          percentage={85}
          healthStatus={mockHealthStatus.normal}
          showPercentage={false}
        />
      );

      expect(screen.queryByText('85.0%')).not.toBeInTheDocument();
      expect(screen.queryByText('Sprint 進度')).not.toBeInTheDocument();
    });

    it('should apply small height when height="sm"', () => {
      const { container } = render(
        <DynamicProgressBar
          percentage={75}
          healthStatus={mockHealthStatus.normal}
          height="sm"
        />
      );

      const progressContainer = container.querySelector('.h-2');
      expect(progressContainer).toBeInTheDocument();
    });

    it('should apply large height when height="lg"', () => {
      const { container } = render(
        <DynamicProgressBar
          percentage={75}
          healthStatus={mockHealthStatus.normal}
          height="lg"
        />
      );

      const progressContainer = container.querySelector('.h-4');
      expect(progressContainer).toBeInTheDocument();
    });
  });

  describe('Progress Bar Width Calculation', () => {
    it('should set correct width style for progress bar', () => {
      const { container } = render(
        <DynamicProgressBar
          percentage={67.3}
          healthStatus={mockHealthStatus.normal}
        />
      );

      const progressBar = container.querySelector('[style*="width: 67.3%"]');
      expect(progressBar).toBeInTheDocument();
    });

    it('should handle decimal percentages correctly', () => {
      render(
        <DynamicProgressBar
          percentage={82.75}
          healthStatus={mockHealthStatus.warning}
        />
      );

      expect(screen.getByText('82.8%')).toBeInTheDocument(); // Rounded to 1 decimal
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative percentage gracefully', () => {
      const { container } = render(
        <DynamicProgressBar
          percentage={-5}
          healthStatus={mockHealthStatus.normal}
        />
      );

      // Should clamp to 0%
      const progressBar = container.querySelector('[style*="width: 0%"]');
      expect(progressBar).toBeInTheDocument();
      expect(screen.getByText('0.0%')).toBeInTheDocument();
    });

    it('should handle percentage over 100% gracefully', () => {
      const { container } = render(
        <DynamicProgressBar
          percentage={120}
          healthStatus={mockHealthStatus.normal}
        />
      );

      // Should clamp to 100%
      const progressBar = container.querySelector('[style*="width: 100%"]');
      expect(progressBar).toBeInTheDocument();
      expect(screen.getByText('100.0%')).toBeInTheDocument();
    });

    it('should handle NaN percentage gracefully', () => {
      render(
        <DynamicProgressBar
          percentage={NaN}
          healthStatus={mockHealthStatus.normal}
        />
      );

      // Should default to 0%
      expect(screen.getByText('0.0%')).toBeInTheDocument();
    });
  });

  describe('Progress Description', () => {
    it('should show start and end labels', () => {
      render(
        <DynamicProgressBar
          percentage={75}
          healthStatus={mockHealthStatus.normal}
        />
      );

      expect(screen.getByText('開始')).toBeInTheDocument();
      expect(screen.getByText('完成')).toBeInTheDocument();
    });

    it('should display health message in middle', () => {
      render(
        <DynamicProgressBar
          percentage={85}
          healthStatus={mockHealthStatus.danger}
        />
      );

      expect(screen.getByText('Sprint 進度嚴重落後')).toBeInTheDocument();
    });
  });

  describe('Visual Enhancement', () => {
    it('should apply gradient background style', () => {
      const { container } = render(
        <DynamicProgressBar
          percentage={75}
          healthStatus={mockHealthStatus.normal}
          animated={true}
        />
      );

      const progressBar = container.querySelector('[style*="linear-gradient"]');
      expect(progressBar).toBeInTheDocument();
    });

    it('should have shimmer effect when animated', () => {
      const { container } = render(
        <DynamicProgressBar
          percentage={75}
          healthStatus={mockHealthStatus.normal}
          animated={true}
        />
      );

      // Should have shimmer overlay div
      const shimmerEffect = container.querySelector('[style*="shimmer"]');
      expect(shimmerEffect).toBeInTheDocument();
    });
  });
});
