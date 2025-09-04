/**
 * Sprint Alert Component Unit Tests  
 * 測試 Sprint 警示訊息組件的所有功能
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { SprintAlert } from '@/components/sprint-alert';

describe('SprintAlert Component', () => {
  
  describe('Warning Alert', () => {
    it('should render warning alert with correct styling', () => {
      render(
        <SprintAlert
          type="warning"
          message="Sprint 進度稍微落後"
          dismissible={true}
        />
      );

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveClass('bg-yellow-50', 'border-yellow-200');
      expect(screen.getByText('Sprint 進度稍微落後')).toBeInTheDocument();
    });

    it('should display warning icon', () => {
      render(
        <SprintAlert
          type="warning"
          message="Test warning message"
        />
      );

      // Warning emoji should be present
      expect(screen.getByText('⚠️')).toBeInTheDocument();
    });

    it('should be dismissible when dismissible=true', () => {
      const onDismiss = jest.fn();
      render(
        <SprintAlert
          type="warning"
          message="Test warning message"
          dismissible={true}
          onDismiss={onDismiss}
        />
      );

      const dismissButton = screen.getByRole('button', { name: /關閉/i });
      expect(dismissButton).toBeInTheDocument();
      
      fireEvent.click(dismissButton);
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('should not show dismiss button when dismissible=false', () => {
      render(
        <SprintAlert
          type="warning"
          message="Test warning message"
          dismissible={false}
        />
      );

      const dismissButton = screen.queryByRole('button', { name: /關閉/i });
      expect(dismissButton).not.toBeInTheDocument();
    });
  });

  describe('Danger Alert', () => {
    it('should render danger alert with correct styling', () => {
      render(
        <SprintAlert
          type="danger"
          message="Sprint 進度嚴重落後！"
          dismissible={false}
        />
      );

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveClass('bg-red-50', 'border-red-200');
      expect(screen.getByText('Sprint 進度嚴重落後！')).toBeInTheDocument();
    });

    it('should display danger icon', () => {
      render(
        <SprintAlert
          type="danger"
          message="Test danger message"
        />
      );

      // Danger emoji should be present
      const dangerIcon = screen.getByText('🚨');
      expect(dangerIcon).toBeInTheDocument();
    });

    it('should render action buttons when provided', () => {
      const actionButtons = [
        {
          text: '查看阻礙因素',
          action: jest.fn(),
          variant: 'outline' as const
        },
        {
          text: '檢視任務分配',
          action: jest.fn(),
          variant: 'default' as const
        }
      ];

      render(
        <SprintAlert
          type="danger"
          message="Test danger message"
          actionButtons={actionButtons}
        />
      );

      expect(screen.getByText('查看阻礙因素')).toBeInTheDocument();
      expect(screen.getByText('檢視任務分配')).toBeInTheDocument();
    });

    it('should call action button callbacks when clicked', () => {
      const mockAction1 = jest.fn();
      const mockAction2 = jest.fn();
      const actionButtons = [
        {
          text: '查看阻礙因素',
          action: mockAction1,
          variant: 'outline' as const
        },
        {
          text: '檢視任務分配',
          action: mockAction2,
          variant: 'default' as const
        }
      ];

      render(
        <SprintAlert
          type="danger"
          message="Test danger message"
          actionButtons={actionButtons}
        />
      );

      fireEvent.click(screen.getByText('查看阻礙因素'));
      expect(mockAction1).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByText('檢視任務分配'));
      expect(mockAction2).toHaveBeenCalledTimes(1);
    });

    it('should not be dismissible by default for danger alerts', () => {
      render(
        <SprintAlert
          type="danger"
          message="Test danger message"
        />
      );

      const dismissButton = screen.queryByRole('button', { name: /關閉/i });
      expect(dismissButton).not.toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const customClass = 'custom-alert-class';
      const { container } = render(
        <SprintAlert
          type="warning"
          message="Test message"
          className={customClass}
        />
      );

      expect(container.firstChild).toHaveClass(customClass);
    });

    it('should maintain base styling with custom className', () => {
      const { container } = render(
        <SprintAlert
          type="warning"
          message="Test message"
          className="custom-class"
        />
      );

      const alert = container.firstChild;
      expect(alert).toHaveClass('bg-yellow-50', 'border-yellow-200', 'custom-class');
    });
  });

  describe('Content Rendering', () => {
    it('should render message content correctly', () => {
      const longMessage = "這是一個很長的警示訊息，用於測試組件是否能正確處理較長的文字內容，包含多個句子和詳細的描述。";
      
      render(
        <SprintAlert
          type="warning"
          message={longMessage}
        />
      );

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('should handle empty action buttons array', () => {
      render(
        <SprintAlert
          type="danger"
          message="Test message"
          actionButtons={[]}
        />
      );

      // Should not render action buttons section
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA role', () => {
      render(
        <SprintAlert
          type="warning"
          message="Test message"
        />
      );

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('should have proper aria-live for dynamic updates', () => {
      const { container } = render(
        <SprintAlert
          type="danger"
          message="Test message"
        />
      );

      const alert = container.firstChild;
      expect(alert).toHaveAttribute('aria-live', 'assertive');
    });

    it('should have accessible dismiss button', () => {
      render(
        <SprintAlert
          type="warning"
          message="Test message"
          dismissible={true}
        />
      );

      const dismissButton = screen.getByRole('button', { name: /關閉/i });
      expect(dismissButton).toHaveAttribute('aria-label');
    });

    it('should support keyboard navigation for action buttons', () => {
      const actionButtons = [
        {
          text: '檢視詳情',
          action: jest.fn(),
          variant: 'outline' as const
        }
      ];

      render(
        <SprintAlert
          type="danger"
          message="Test message"
          actionButtons={actionButtons}
        />
      );

      const actionButton = screen.getByText('檢視詳情');
      expect(actionButton).toBeInstanceOf(HTMLButtonElement);
      expect(actionButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined onDismiss gracefully', () => {
      expect(() => {
        render(
          <SprintAlert
            type="warning"
            message="Test message"
            dismissible={true}
          />
        );
      }).not.toThrow();
    });

    it('should handle empty message gracefully', () => {
      render(
        <SprintAlert
          type="warning"
          message=""
        />
      );

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('should handle action button without action callback', () => {
      const actionButtons = [
        {
          text: '無效按鈕',
          action: undefined as any,
          variant: 'outline' as const
        }
      ];

      expect(() => {
        render(
          <SprintAlert
            type="danger"
            message="Test message"
            actionButtons={actionButtons}
          />
        );
      }).not.toThrow();
    });
  });
});
