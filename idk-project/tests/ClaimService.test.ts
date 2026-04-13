/**
 * Unit tests for ClaimService
 */

import { InMemoryClaimService } from '../src/services/ClaimService';
import { InMemoryItemService } from '../src/services/ItemService';

describe('ClaimService', () => {
  let claimService: InMemoryClaimService;
  let itemService: InMemoryItemService;

  beforeEach(() => {
    itemService = new InMemoryItemService();
    claimService = new InMemoryClaimService(itemService);
  });

  describe('getVerificationQuestions', () => {
    it('should return verification questions for a valid found item', () => {
      // Arrange
      const questions = ['What color is it?', 'Where did you lose it?'];
      const result = itemService.postFoundItem('user1', 'Found a wallet', questions);
      expect(result.success).toBe(true);
      
      if (!result.success) return;
      const foundItemId = result.value.id;

      // Act
      const questionsResult = claimService.getVerificationQuestions(foundItemId);

      // Assert
      expect(questionsResult.success).toBe(true);
      if (questionsResult.success) {
        expect(questionsResult.value).toEqual(questions);
      }
    });

    it('should return error for non-existent item', () => {
      // Act
      const result = claimService.getVerificationQuestions('non-existent-id');

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('ItemNotFound');
        if (result.error.type === 'ItemNotFound') {
          expect(result.error.itemId).toBe('non-existent-id');
        }
      }
    });
  });

  describe('submitClaim', () => {
    it('should successfully submit a claim with valid answers', () => {
      // Arrange
      const questions = ['What color is it?', 'Where did you lose it?'];
      const itemResult = itemService.postFoundItem('finder1', 'Found a wallet', questions);
      expect(itemResult.success).toBe(true);
      
      if (!itemResult.success) return;
      const foundItemId = itemResult.value.id;
      const answers = ['Black', 'In the library'];

      // Act
      const claimResult = claimService.submitClaim(foundItemId, 'claimant1', answers);

      // Assert
      expect(claimResult.success).toBe(true);
      if (claimResult.success) {
        expect(claimResult.value.foundItemId).toBe(foundItemId);
        expect(claimResult.value.claimantUserId).toBe('claimant1');
        expect(claimResult.value.answers).toEqual(answers);
        expect(claimResult.value.id).toBeDefined();
        expect(claimResult.value.timestamp).toBeInstanceOf(Date);
      }
    });

    it('should return error for non-existent item', () => {
      // Act
      const result = claimService.submitClaim('non-existent-id', 'claimant1', ['answer']);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('ItemNotFound');
      }
    });

    it('should return error when answer count does not match question count', () => {
      // Arrange
      const questions = ['What color is it?', 'Where did you lose it?'];
      const itemResult = itemService.postFoundItem('finder1', 'Found a wallet', questions);
      expect(itemResult.success).toBe(true);
      
      if (!itemResult.success) return;
      const foundItemId = itemResult.value.id;

      // Act - provide only one answer when two are expected
      const claimResult = claimService.submitClaim(foundItemId, 'claimant1', ['Black']);

      // Assert
      expect(claimResult.success).toBe(false);
      if (!claimResult.success) {
        expect(claimResult.error.type).toBe('AnswerCountMismatch');
        if (claimResult.error.type === 'AnswerCountMismatch') {
          expect(claimResult.error.expected).toBe(2);
          expect(claimResult.error.received).toBe(1);
        }
      }
    });

    it('should return error when an answer is empty', () => {
      // Arrange
      const questions = ['What color is it?', 'Where did you lose it?'];
      const itemResult = itemService.postFoundItem('finder1', 'Found a wallet', questions);
      expect(itemResult.success).toBe(true);
      
      if (!itemResult.success) return;
      const foundItemId = itemResult.value.id;

      // Act - provide an empty answer
      const claimResult = claimService.submitClaim(foundItemId, 'claimant1', ['Black', '']);

      // Assert
      expect(claimResult.success).toBe(false);
      if (!claimResult.success) {
        expect(claimResult.error.type).toBe('EmptyAnswer');
        if (claimResult.error.type === 'EmptyAnswer') {
          expect(claimResult.error.questionIndex).toBe(1);
        }
      }
    });

    it('should return error when an answer is only whitespace', () => {
      // Arrange
      const questions = ['What color is it?'];
      const itemResult = itemService.postFoundItem('finder1', 'Found a wallet', questions);
      expect(itemResult.success).toBe(true);
      
      if (!itemResult.success) return;
      const foundItemId = itemResult.value.id;

      // Act
      const claimResult = claimService.submitClaim(foundItemId, 'claimant1', ['   ']);

      // Assert
      expect(claimResult.success).toBe(false);
      if (!claimResult.success) {
        expect(claimResult.error.type).toBe('EmptyAnswer');
        if (claimResult.error.type === 'EmptyAnswer') {
          expect(claimResult.error.questionIndex).toBe(0);
        }
      }
    });

    it('should not automatically approve or reject claims', () => {
      // Arrange
      const questions = ['What color is it?'];
      const itemResult = itemService.postFoundItem('finder1', 'Found a wallet', questions);
      expect(itemResult.success).toBe(true);
      
      if (!itemResult.success) return;
      const foundItemId = itemResult.value.id;

      // Act
      const claimResult = claimService.submitClaim(foundItemId, 'claimant1', ['Black']);

      // Assert - claim should be created without automatic approval/rejection
      expect(claimResult.success).toBe(true);
      if (claimResult.success) {
        // The claim should exist but not have any status field indicating automatic decision
        expect(claimResult.value).not.toHaveProperty('status');
      }
    });
  });

  describe('getClaimsForUser', () => {
    it('should return claims for items posted by the user', () => {
      // Arrange
      const questions = ['What color is it?'];
      const item1Result = itemService.postFoundItem('finder1', 'Found a wallet', questions);
      const item2Result = itemService.postFoundItem('finder1', 'Found keys', questions);
      expect(item1Result.success && item2Result.success).toBe(true);
      
      if (!item1Result.success || !item2Result.success) return;
      
      claimService.submitClaim(item1Result.value.id, 'claimant1', ['Black']);
      claimService.submitClaim(item2Result.value.id, 'claimant2', ['Silver']);

      // Act
      const claims = claimService.getClaimsForUser('finder1');

      // Assert
      expect(claims).toHaveLength(2);
      const foundItemIds = claims.map(c => c.foundItemId);
      expect(foundItemIds).toContain(item1Result.value.id);
      expect(foundItemIds).toContain(item2Result.value.id);
    });

    it('should not return claims for items posted by other users', () => {
      // Arrange
      const questions = ['What color is it?'];
      const item1Result = itemService.postFoundItem('finder1', 'Found a wallet', questions);
      const item2Result = itemService.postFoundItem('finder2', 'Found keys', questions);
      expect(item1Result.success && item2Result.success).toBe(true);
      
      if (!item1Result.success || !item2Result.success) return;
      
      claimService.submitClaim(item1Result.value.id, 'claimant1', ['Black']);
      claimService.submitClaim(item2Result.value.id, 'claimant2', ['Silver']);

      // Act
      const claims = claimService.getClaimsForUser('finder1');

      // Assert
      expect(claims).toHaveLength(1);
      expect(claims[0].foundItemId).toBe(item1Result.value.id);
    });

    it('should return empty array when user has no found items', () => {
      // Act
      const claims = claimService.getClaimsForUser('user-with-no-items');

      // Assert
      expect(claims).toEqual([]);
    });

    it('should return empty array when user has found items but no claims', () => {
      // Arrange
      const questions = ['What color is it?'];
      itemService.postFoundItem('finder1', 'Found a wallet', questions);

      // Act
      const claims = claimService.getClaimsForUser('finder1');

      // Assert
      expect(claims).toEqual([]);
    });

    it('should return claims in reverse chronological order', () => {
      // Arrange
      const questions = ['What color is it?'];
      const itemResult = itemService.postFoundItem('finder1', 'Found a wallet', questions);
      expect(itemResult.success).toBe(true);
      
      if (!itemResult.success) return;
      
      // Submit multiple claims
      claimService.submitClaim(itemResult.value.id, 'claimant1', ['Black']);
      claimService.submitClaim(itemResult.value.id, 'claimant2', ['Brown']);
      claimService.submitClaim(itemResult.value.id, 'claimant3', ['Red']);

      // Act
      const claims = claimService.getClaimsForUser('finder1');

      // Assert
      expect(claims).toHaveLength(3);
      // Verify all claims are present
      const claimantIds = claims.map(c => c.claimantUserId);
      expect(claimantIds).toContain('claimant1');
      expect(claimantIds).toContain('claimant2');
      expect(claimantIds).toContain('claimant3');
      
      // Verify they are in reverse chronological order (most recent first)
      for (let i = 0; i < claims.length - 1; i++) {
        expect(claims[i].timestamp.getTime()).toBeGreaterThanOrEqual(claims[i + 1].timestamp.getTime());
      }
    });
  });
});
