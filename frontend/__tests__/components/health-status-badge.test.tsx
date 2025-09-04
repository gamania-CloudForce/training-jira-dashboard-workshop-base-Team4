/**
 * Health Status Badge Component Unit Tests
 * 測試健康狀態指示組件的所有功能
 */

import { render, screen } from '@testing-library/react';
import { HealthStatusBadge } from '@/components/health-status-badge';

// Mock health status data matching the actual component interface
const mockHealthStatus = {
  normal: {
    status: 'normal' as const,
    color: '#10B981',
    message: 'Sprint 進度正常，預期可順利完成目標',
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

describe('HealthStatusBadge Component', () => {
  
  describe('Normal Status', () => {
    it('should display normal status badge with correct message', () => {
      render(
        <HealthStatusBadge 
          healthStatus={mockHealthStatus.normal} 
          animated={false}
        />
      );

      expect(screen.getByText('Sprint 進度正常，預期可順利完成目標')).toBeInTheDocument();
    });

    it('should have correct styling for normal status', () => {
      const { container } = render(
        <HealthStatusBadge 
          healthStatus={mockHealthStatus.normal} 
          animated={false}
        />
      );

      const badge = container.firstChild;
      expect(badge).toHaveClass('bg-green-100', 'text-green-800', 'border-green-200');
    });

    it('should not have animation classes when animated=false', () => {
      const { container } = render(
        <HealthStatusBadge 
          healthStatus={mockHealthStatus.normal} 
          animated={false}
        />
      );

      const badge = container.firstChild;
      expect(badge).not.toHaveClass('animate-pulse');
    });
  });

  describe('Warning Status', () => {
    it('should display warning status badge with correct message', () => {
      render(
        <HealthStatusBadge 
          healthStatus={mockHealthStatus.warning} 
          animated={false}
        />
      );

      expect(screen.getByText('Sprint 進度稍微落後')).toBeInTheDocument();
    });

    it('should have correct styling for warning status', () => {
      const { container } = render(
        <HealthStatusBadge 
          healthStatus={mockHealthStatus.warning} 
          animated={false}
        />
      );

      const badge = container.firstChild;
      expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800', 'border-yellow-200');
    });

    it('should display warning emoji', () => {
      render(
        <HealthStatusBadge 
          healthStatus={mockHealthStatus.warning} 
          animated={false}
        />
      );

      // Warning emoji should be present
      const warningEmoji = screen.getByRole('img', { name: 'warning' });
      expect(warningEmoji).toBeInTheDocument();
      expect(warningEmoji).toHaveTextContent('⚠️');
    });
  });

  describe('Danger Status', () => {
    it('should display danger status badge with correct message', () => {
      render(
        <HealthStatusBadge 
          healthStatus={mockHealthStatus.danger} 
          animated={false}
        />
      );

      expect(screen.getByText('Sprint 進度嚴重落後')).toBeInTheDocument();
    });

    it('should have correct styling for danger status', () => {
      const { container } = render(
        <HealthStatusBadge 
          healthStatus={mockHealthStatus.danger} 
          animated={false}
        />
      );

      const badge = container.firstChild;
      expect(badge).toHaveClass('bg-red-100', 'text-red-800', 'border-red-200');
    });

    it('should have animation classes when animated=true', () => {
      const { container } = render(
        <HealthStatusBadge 
          healthStatus={mockHealthStatus.danger} 
          animated={true}
        />
      );

      const badge = container.firstChild;
      expect(badge).toHaveClass('animate-pulse');
    });

    it('should display danger emoji', () => {
      render(
        <HealthStatusBadge 
          healthStatus={mockHealthStatus.danger} 
          animated={false}
        />
      );

      // Danger emoji should be present
      const dangerEmoji = screen.getByRole('img', { name: 'danger' });
      expect(dangerEmoji).toBeInTheDocument();
      expect(dangerEmoji).toHaveTextContent('🚨');
    });
  });

  describe('Animation Behavior', () => {
    it('should not animate for normal status even when animated=true', () => {
      const { container } = render(
        <HealthStatusBadge 
          healthStatus={mockHealthStatus.normal} 
          animated={true}
        />
      );

      const badge = container.firstChild;
      expect(badge).not.toHaveClass('animate-pulse');
    });

    it('should not animate for warning status even when animated=true', () => {
      const { container } = render(
        <HealthStatusBadge 
          healthStatus={mockHealthStatus.warning} 
          animated={true}
        />
      );

      const badge = container.firstChild;
      expect(badge).not.toHaveClass('animate-pulse');
    });

    it('should only animate for danger status when animated=true', () => {
      const { container } = render(
        <HealthStatusBadge 
          healthStatus={mockHealthStatus.danger} 
          animated={true}
        />
      );

      const badge = container.firstChild;
      expect(badge).toHaveClass('animate-pulse');
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const customClass = 'custom-badge-class';
      const { container } = render(
        <HealthStatusBadge 
          healthStatus={mockHealthStatus.normal} 
          className={customClass}
        />
      );

      expect(container.firstChild).toHaveClass(customClass);
    });

    it('should apply custom colors from healthStatus.color', () => {
      const { container } = render(
        <HealthStatusBadge 
          healthStatus={mockHealthStatus.normal} 
        />
      );

      const badge = container.firstChild;
      expect(badge).toHaveStyle({
        borderColor: '#10B981',
        color: '#10B981'
      });
    });
  });

  describe('Icon Rendering', () => {
    it('should render TrendingUp icon for normal status', () => {
      render(
        <HealthStatusBadge 
          healthStatus={mockHealthStatus.normal} 
        />
      );

      // Icon should be present (TrendingUp from lucide-react)
      const icon = document.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('w-3.5', 'h-3.5');
    });

    it('should not render emoji for normal status', () => {
      render(
        <HealthStatusBadge 
          healthStatus={mockHealthStatus.normal} 
        />
      );

      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
  });
});
