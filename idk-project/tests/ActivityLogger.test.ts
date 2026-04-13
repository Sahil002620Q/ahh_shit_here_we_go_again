/**
 * Unit tests for ActivityLogger
 */

import { InMemoryActivityLogger } from '../src/services/ActivityLogger';
import { ActionType } from '../src/types';

describe('ActivityLogger', () => {
  let logger: InMemoryActivityLogger;
  let isAdminFn: jest.Mock;

  beforeEach(() => {
    isAdminFn = jest.fn();
    logger = new InMemoryActivityLogger(isAdminFn);
  });

  describe('logActivity', () => {
    it('should log activity with all required metadata', () => {
      // Arrange
      const userId = 'user123';
      const actionType: ActionType = 'LostItemPosted';
      const details = 'Lost my wallet';

      // Act
      logger.logActivity(userId, actionType, details);

      // Assert
      isAdminFn.mockReturnValue(true);
      const result = logger.getActivityLogs('admin123');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toHaveLength(1);
        expect(result.value[0]).toMatchObject({
          userId,
          actionType,
          details
        });
        expect(result.value[0].id).toBeDefined();
        expect(result.value[0].timestamp).toBeInstanceOf(Date);
      }
    });

    it('should log multiple activities', () => {
      // Arrange & Act
      logger.logActivity('user1', 'LostItemPosted', 'Lost wallet');
      logger.logActivity('user2', 'FoundItemPosted', 'Found keys');
      logger.logActivity('user3', 'ClaimSubmitted', 'Claiming item');

      // Assert
      isAdminFn.mockReturnValue(true);
      const result = logger.getActivityLogs('admin123');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toHaveLength(3);
      }
    });

    it('should log all action types', () => {
      // Arrange
      const actionTypes: ActionType[] = [
        'LostItemPosted',
        'FoundItemPosted',
        'ClaimSubmitted',
        'ChatMessageSent',
        'AdminLogin'
      ];

      // Act
      actionTypes.forEach((actionType, index) => {
        logger.logActivity(`user${index}`, actionType, `Details for ${actionType}`);
      });

      // Assert
      isAdminFn.mockReturnValue(true);
      const result = logger.getActivityLogs('admin123');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toHaveLength(5);
        actionTypes.forEach((actionType, index) => {
          expect(result.value[index].actionType).toBe(actionType);
        });
      }
    });
  });

  describe('getActivityLogs', () => {
    beforeEach(() => {
      // Add some test logs
      logger.logActivity('user1', 'LostItemPosted', 'Lost wallet');
      logger.logActivity('user2', 'FoundItemPosted', 'Found keys');
      logger.logActivity('user3', 'ChatMessageSent', 'Hello');
    });

    it('should return logs for admin users', () => {
      // Arrange
      isAdminFn.mockReturnValue(true);

      // Act
      const result = logger.getActivityLogs('admin123');

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toHaveLength(3);
      }
    });

    it('should deny access for non-admin users', () => {
      // Arrange
      isAdminFn.mockReturnValue(false);

      // Act
      const result = logger.getActivityLogs('user123');

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('Unauthorized');
      }
    });

    it('should return logs in chronological order', () => {
      // Arrange
      isAdminFn.mockReturnValue(true);
      logger.clearAllLogs();

      // Act - Add logs with slight delays to ensure different timestamps
      logger.logActivity('user1', 'LostItemPosted', 'First');
      logger.logActivity('user2', 'FoundItemPosted', 'Second');
      logger.logActivity('user3', 'ClaimSubmitted', 'Third');

      const result = logger.getActivityLogs('admin123');

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toHaveLength(3);
        expect(result.value[0].details).toBe('First');
        expect(result.value[1].details).toBe('Second');
        expect(result.value[2].details).toBe('Third');
        
        // Verify chronological ordering
        expect(result.value[0].timestamp.getTime()).toBeLessThanOrEqual(
          result.value[1].timestamp.getTime()
        );
        expect(result.value[1].timestamp.getTime()).toBeLessThanOrEqual(
          result.value[2].timestamp.getTime()
        );
      }
    });

    it('should include actual user IDs for all activities including anonymous chat', () => {
      // Arrange
      isAdminFn.mockReturnValue(true);
      logger.clearAllLogs();

      // Act - Log anonymous chat message
      logger.logActivity('anonymousUser123', 'ChatMessageSent', 'Anonymous message');

      const result = logger.getActivityLogs('admin123');

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toHaveLength(1);
        expect(result.value[0].userId).toBe('anonymousUser123');
        expect(result.value[0].actionType).toBe('ChatMessageSent');
      }
    });

    it('should return empty array when no logs exist', () => {
      // Arrange
      isAdminFn.mockReturnValue(true);
      logger.clearAllLogs();

      // Act
      const result = logger.getActivityLogs('admin123');

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toHaveLength(0);
      }
    });
  });

  describe('edge cases', () => {
    it('should handle empty details string', () => {
      // Arrange
      isAdminFn.mockReturnValue(true);

      // Act
      logger.logActivity('user123', 'LostItemPosted', '');

      const result = logger.getActivityLogs('admin123');

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toHaveLength(1);
        expect(result.value[0].details).toBe('');
      }
    });

    it('should handle long details string', () => {
      // Arrange
      isAdminFn.mockReturnValue(true);
      const longDetails = 'A'.repeat(5000);

      // Act
      logger.logActivity('user123', 'LostItemPosted', longDetails);

      const result = logger.getActivityLogs('admin123');

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toHaveLength(1);
        expect(result.value[0].details).toBe(longDetails);
      }
    });

    it('should generate unique log IDs', () => {
      // Arrange
      isAdminFn.mockReturnValue(true);

      // Act
      logger.logActivity('user1', 'LostItemPosted', 'First');
      logger.logActivity('user2', 'FoundItemPosted', 'Second');
      logger.logActivity('user3', 'ClaimSubmitted', 'Third');

      const result = logger.getActivityLogs('admin123');

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        const ids = result.value.map(log => log.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(3);
      }
    });
  });
});
