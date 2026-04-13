/**
 * Unit Tests for ItemService
 */

import { InMemoryItemService } from '../src/services/ItemService';
import { LostItem } from '../src/types';

describe('ItemService', () => {
  let itemService: InMemoryItemService;

  beforeEach(() => {
    itemService = new InMemoryItemService();
  });

  describe('postLostItem', () => {
    it('should create a lost item with valid description', () => {
      const result = itemService.postLostItem('user1', 'Lost my blue backpack');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.userId).toBe('user1');
        expect(result.value.description).toBe('Lost my blue backpack');
        expect(result.value.id).toBeDefined();
        expect(result.value.timestamp).toBeInstanceOf(Date);
      }
    });

    it('should reject empty description', () => {
      const result = itemService.postLostItem('user1', '');
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('EmptyDescription');
      }
    });

    it('should reject whitespace-only description', () => {
      const result = itemService.postLostItem('user1', '   ');
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('EmptyDescription');
      }
    });

    it('should accept description with exactly 1000 characters', () => {
      const description = 'a'.repeat(1000);
      const result = itemService.postLostItem('user1', description);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.description.length).toBe(1000);
      }
    });

    it('should reject description exceeding 1000 characters', () => {
      const description = 'a'.repeat(1001);
      const result = itemService.postLostItem('user1', description);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('DescriptionTooLong');
        if (result.error.type === 'DescriptionTooLong') {
          expect(result.error.maxLength).toBe(1000);
        }
      }
    });
  });

  describe('postFoundItem', () => {
    it('should create a found item with valid description and questions', () => {
      const questions = ['What color was it?', 'Where did you lose it?'];
      const result = itemService.postFoundItem('user2', 'Found a wallet', questions);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.userId).toBe('user2');
        expect(result.value.description).toBe('Found a wallet');
        expect(result.value.verificationQuestions).toEqual(questions);
        expect(result.value.id).toBeDefined();
        expect(result.value.timestamp).toBeInstanceOf(Date);
      }
    });

    it('should reject empty description', () => {
      const result = itemService.postFoundItem('user2', '', ['What color?']);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('EmptyDescription');
      }
    });

    it('should reject whitespace-only description', () => {
      const result = itemService.postFoundItem('user2', '  \n  ', ['What color?']);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('EmptyDescription');
      }
    });

    it('should reject description exceeding 1000 characters', () => {
      const description = 'a'.repeat(1001);
      const result = itemService.postFoundItem('user2', description, ['Question?']);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('DescriptionTooLong');
        if (result.error.type === 'DescriptionTooLong') {
          expect(result.error.maxLength).toBe(1000);
        }
      }
    });

    it('should reject found item with no verification questions', () => {
      const result = itemService.postFoundItem('user2', 'Found a phone', []);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('NoVerificationQuestions');
      }
    });

    it('should reject found item with empty verification question', () => {
      const result = itemService.postFoundItem('user2', 'Found a phone', ['What color?', '', 'Where?']);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('EmptyVerificationQuestion');
      }
    });

    it('should reject found item with whitespace-only verification question', () => {
      const result = itemService.postFoundItem('user2', 'Found a phone', ['What color?', '   ', 'Where?']);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('EmptyVerificationQuestion');
      }
    });

    it('should accept found item with single verification question', () => {
      const result = itemService.postFoundItem('user2', 'Found keys', ['What keychain?']);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.verificationQuestions.length).toBe(1);
      }
    });

    it('should accept found item with multiple verification questions', () => {
      const questions = ['Question 1?', 'Question 2?', 'Question 3?'];
      const result = itemService.postFoundItem('user2', 'Found laptop', questions);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.verificationQuestions.length).toBe(3);
        expect(result.value.verificationQuestions).toEqual(questions);
      }
    });
  });

  describe('getLostItems', () => {
    it('should return empty array when no items exist', () => {
      const items = itemService.getLostItems();
      expect(items).toEqual([]);
    });

    it('should return all lost items', () => {
      itemService.postLostItem('user1', 'Lost item 1');
      itemService.postLostItem('user2', 'Lost item 2');
      
      const items = itemService.getLostItems();
      expect(items.length).toBe(2);
    });

    it('should return items in reverse chronological order', () => {
      // Post items and manually set timestamps to ensure ordering
      const result1 = itemService.postLostItem('user1', 'First item');
      const result2 = itemService.postLostItem('user2', 'Second item');
      const result3 = itemService.postLostItem('user3', 'Third item');
      
      // Manually adjust timestamps to ensure proper ordering
      if (result1.success && result2.success && result3.success) {
        result1.value.timestamp = new Date('2024-01-01T10:00:00Z');
        result2.value.timestamp = new Date('2024-01-01T11:00:00Z');
        result3.value.timestamp = new Date('2024-01-01T12:00:00Z');
      }
      
      const items = itemService.getLostItems();
      
      expect(items.length).toBe(3);
      // Most recent should be first
      expect(items[0].description).toBe('Third item');
      expect(items[1].description).toBe('Second item');
      expect(items[2].description).toBe('First item');
    });
  });

  describe('getFoundItems', () => {
    it('should return empty array when no items exist', () => {
      const items = itemService.getFoundItems();
      expect(items).toEqual([]);
    });

    it('should return all found items', () => {
      itemService.postFoundItem('user1', 'Found item 1', ['Q1']);
      itemService.postFoundItem('user2', 'Found item 2', ['Q2']);
      
      const items = itemService.getFoundItems();
      expect(items.length).toBe(2);
    });

    it('should return items in reverse chronological order', () => {
      const result1 = itemService.postFoundItem('user1', 'First found', ['Q1']);
      const result2 = itemService.postFoundItem('user2', 'Second found', ['Q2']);
      const result3 = itemService.postFoundItem('user3', 'Third found', ['Q3']);
      
      // Manually adjust timestamps to ensure proper ordering
      if (result1.success && result2.success && result3.success) {
        result1.value.timestamp = new Date('2024-01-01T10:00:00Z');
        result2.value.timestamp = new Date('2024-01-01T11:00:00Z');
        result3.value.timestamp = new Date('2024-01-01T12:00:00Z');
      }
      
      const items = itemService.getFoundItems();
      
      expect(items.length).toBe(3);
      // Most recent should be first
      expect(items[0].description).toBe('Third found');
      expect(items[1].description).toBe('Second found');
      expect(items[2].description).toBe('First found');
    });
  });

  describe('searchItems', () => {
    beforeEach(() => {
      // Set up test data with explicit timestamps
      const lost1 = itemService.postLostItem('user1', 'Lost blue backpack');
      const lost2 = itemService.postLostItem('user2', 'Lost red wallet');
      const lost3 = itemService.postLostItem('user3', 'Lost BLUE phone');
      
      if (lost1.success && lost2.success && lost3.success) {
        lost1.value.timestamp = new Date('2024-01-01T10:00:00Z');
        lost2.value.timestamp = new Date('2024-01-01T11:00:00Z');
        lost3.value.timestamp = new Date('2024-01-01T12:00:00Z');
      }
      
      const found1 = itemService.postFoundItem('user4', 'Found blue keys', ['Q1']);
      const found2 = itemService.postFoundItem('user5', 'Found green notebook', ['Q2']);
      const found3 = itemService.postFoundItem('user6', 'Found BLUE jacket', ['Q3']);
      
      if (found1.success && found2.success && found3.success) {
        found1.value.timestamp = new Date('2024-01-01T10:00:00Z');
        found2.value.timestamp = new Date('2024-01-01T11:00:00Z');
        found3.value.timestamp = new Date('2024-01-01T12:00:00Z');
      }
    });

    it('should perform case-insensitive search for lost items', () => {
      const results = itemService.searchItems('blue', 'lost');
      
      expect(results.length).toBe(2);
      expect(results.every(item => 
        item.description.toLowerCase().includes('blue')
      )).toBe(true);
    });

    it('should perform case-insensitive search for found items', () => {
      const results = itemService.searchItems('BLUE', 'found');
      
      expect(results.length).toBe(2);
      expect(results.every(item => 
        item.description.toLowerCase().includes('blue')
      )).toBe(true);
    });

    it('should return empty array when no matches found', () => {
      const results = itemService.searchItems('purple', 'lost');
      expect(results).toEqual([]);
    });

    it('should match partial keywords', () => {
      const results = itemService.searchItems('wal', 'lost');
      
      expect(results.length).toBe(1);
      expect(results[0].description).toBe('Lost red wallet');
    });

    it('should return results in reverse chronological order', () => {
      const results = itemService.searchItems('blue', 'lost');
      
      // Most recent should be first
      expect(results[0].description).toBe('Lost BLUE phone');
      expect(results[1].description).toBe('Lost blue backpack');
    });

    it('should only search within specified item type', () => {
      const lostResults = itemService.searchItems('blue', 'lost');
      const foundResults = itemService.searchItems('blue', 'found');
      
      expect(lostResults.length).toBe(2);
      expect(foundResults.length).toBe(2);
      
      // Verify lost items don't have verification questions
      expect(lostResults.every(item => !('verificationQuestions' in item))).toBe(true);
      // Verify found items have verification questions
      expect(foundResults.every(item => 'verificationQuestions' in item)).toBe(true);
    });

    it('should handle empty keyword', () => {
      const results = itemService.searchItems('', 'lost');
      
      // Empty string matches all items
      expect(results.length).toBe(3);
    });
  });

  describe('edge cases', () => {
    it('should handle multiple items posted at nearly the same time', () => {
      const items: LostItem[] = [];
      
      for (let i = 0; i < 5; i++) {
        const result = itemService.postLostItem(`user${i}`, `Item ${i}`);
        if (result.success) {
          items.push(result.value);
        }
      }
      
      const retrieved = itemService.getLostItems();
      expect(retrieved.length).toBe(5);
    });

    it('should handle special characters in descriptions', () => {
      const description = 'Lost item with special chars: @#$%^&*()';
      const result = itemService.postLostItem('user1', description);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.description).toBe(description);
      }
    });

    it('should handle unicode characters in descriptions', () => {
      const description = 'Lost item with emoji 📱 and unicode 你好';
      const result = itemService.postLostItem('user1', description);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.description).toBe(description);
      }
    });

    it('should handle search with special characters', () => {
      itemService.postLostItem('user1', 'Lost $100 bill');
      
      const results = itemService.searchItems('$100', 'lost');
      expect(results.length).toBe(1);
    });
  });
});
