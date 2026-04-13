/**
 * Claim Verification Service
 * Handles claim submission and verification for found items
 */

import { ClaimRequest, ClaimError, Result, Ok, Err } from '../types';
import { ItemService } from './ItemService';

export interface ClaimService {
  getVerificationQuestions(foundItemId: string): Result<string[], ClaimError>;
  submitClaim(foundItemId: string, claimantUserId: string, answers: string[]): Result<ClaimRequest, ClaimError>;
  getClaimsForUser(userId: string): ClaimRequest[];
}

/**
 * In-memory implementation of ClaimService
 * In production, this would connect to a database
 */
export class InMemoryClaimService implements ClaimService {
  private claims: ClaimRequest[];
  private itemService: ItemService;

  constructor(itemService: ItemService) {
    this.itemService = itemService;
    this.claims = [];
  }

  /**
   * Get verification questions for a found item
   * Requirements: 6.1
   */
  getVerificationQuestions(foundItemId: string): Result<string[], ClaimError> {
    // Get all found items
    const foundItems = this.itemService.getFoundItems();
    
    // Find the specific item
    const foundItem = foundItems.find(item => item.id === foundItemId);
    
    if (!foundItem) {
      return Err({ type: 'ItemNotFound', itemId: foundItemId });
    }

    // Return all verification questions
    return Ok(foundItem.verificationQuestions);
  }

  /**
   * Submit a claim with text-based answers
   * Requirements: 6.2, 6.3, 6.4, 6.5
   */
  submitClaim(
    foundItemId: string,
    claimantUserId: string,
    answers: string[]
  ): Result<ClaimRequest, ClaimError> {
    // Get all found items
    const foundItems = this.itemService.getFoundItems();
    
    // Find the specific item
    const foundItem = foundItems.find(item => item.id === foundItemId);
    
    if (!foundItem) {
      return Err({ type: 'ItemNotFound', itemId: foundItemId });
    }

    // Validate answer count matches question count
    const expectedCount = foundItem.verificationQuestions.length;
    const receivedCount = answers.length;
    
    if (receivedCount !== expectedCount) {
      return Err({
        type: 'AnswerCountMismatch',
        expected: expectedCount,
        received: receivedCount
      });
    }

    // Validate that all answers are non-empty
    for (let i = 0; i < answers.length; i++) {
      if (!answers[i] || answers[i].trim().length === 0) {
        return Err({ type: 'EmptyAnswer', questionIndex: i });
      }
    }

    // Create claim request
    const claimRequest: ClaimRequest = {
      id: this.generateClaimId(),
      foundItemId,
      claimantUserId,
      answers,
      timestamp: new Date()
    };

    // Store the claim
    this.claims.push(claimRequest);

    // Return the claim (no automatic approval/rejection per Requirement 6.5)
    return Ok(claimRequest);
  }

  /**
   * Get claims for items posted by a user (finder)
   * Requirements: 6.4
   */
  getClaimsForUser(userId: string): ClaimRequest[] {
    // Get all found items posted by this user
    const foundItems = this.itemService.getFoundItems();
    const userFoundItemIds = foundItems
      .filter(item => item.userId === userId)
      .map(item => item.id);

    // Get all claims for those items
    const userClaims = this.claims.filter(claim => 
      userFoundItemIds.includes(claim.foundItemId)
    );

    // Return claims in reverse chronological order (most recent first)
    return userClaims.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Generate a unique claim ID
   */
  private generateClaimId(): string {
    return `claim_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Helper method to clear all claims (for testing)
   */
  clearAllClaims(): void {
    this.claims = [];
  }
}
