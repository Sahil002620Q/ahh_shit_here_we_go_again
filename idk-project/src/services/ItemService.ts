/**
 * Lost and Found Item Management Service
 * Handles posting, retrieval, and searching of lost and found items
 */

import { LostItem, FoundItem, ItemError, Result, Ok, Err } from '../types';

export interface ItemService {
  postLostItem(userId: string, description: string): Result<LostItem, ItemError>;
  postFoundItem(userId: string, description: string, questions: string[]): Result<FoundItem, ItemError>;
  getLostItems(): LostItem[];
  getFoundItems(): FoundItem[];
  searchItems(keyword: string, itemType: 'lost' | 'found'): (LostItem | FoundItem)[];
}

/**
 * In-memory implementation of ItemService
 * In production, this would connect to a database
 */
export class InMemoryItemService implements ItemService {
  private lostItems: LostItem[];
  private foundItems: FoundItem[];
  private readonly MAX_DESCRIPTION_LENGTH = 1000;

  constructor() {
    this.lostItems = [];
    this.foundItems = [];
  }

  /**
   * Post a lost item
   * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
   */
  postLostItem(userId: string, description: string): Result<LostItem, ItemError> {
    // Validate description is not empty
    if (!description || description.trim().length === 0) {
      return Err({ type: 'EmptyDescription' });
    }

    // Validate description length
    if (description.length > this.MAX_DESCRIPTION_LENGTH) {
      return Err({ type: 'DescriptionTooLong', maxLength: this.MAX_DESCRIPTION_LENGTH });
    }

    // Create lost item
    const lostItem: LostItem = {
      id: this.generateItemId('lost'),
      userId,
      description,
      timestamp: new Date()
    };

    this.lostItems.push(lostItem);
    return Ok(lostItem);
  }

  /**
   * Post a found item with verification questions
   * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 5.5
   */
  postFoundItem(userId: string, description: string, questions: string[]): Result<FoundItem, ItemError> {
    // Validate description is not empty
    if (!description || description.trim().length === 0) {
      return Err({ type: 'EmptyDescription' });
    }

    // Validate description length
    if (description.length > this.MAX_DESCRIPTION_LENGTH) {
      return Err({ type: 'DescriptionTooLong', maxLength: this.MAX_DESCRIPTION_LENGTH });
    }

    // Validate at least one verification question is provided (Requirement 5.3)
    if (!questions || questions.length === 0) {
      return Err({ type: 'NoVerificationQuestions' });
    }

    // Validate that all questions are non-empty strings (Requirement 5.2)
    const hasEmptyQuestion = questions.some(q => !q || q.trim().length === 0);
    if (hasEmptyQuestion) {
      return Err({ type: 'EmptyVerificationQuestion' });
    }

    // Create found item
    const foundItem: FoundItem = {
      id: this.generateItemId('found'),
      userId,
      description,
      verificationQuestions: questions,
      timestamp: new Date()
    };

    this.foundItems.push(foundItem);
    return Ok(foundItem);
  }

  /**
   * Retrieve all lost items in reverse chronological order
   * Requirements: 10.1, 10.3
   */
  getLostItems(): LostItem[] {
    // Return items in reverse chronological order (most recent first)
    return [...this.lostItems].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Retrieve all found items in reverse chronological order
   * Requirements: 10.2, 10.3
   */
  getFoundItems(): FoundItem[] {
    // Return items in reverse chronological order (most recent first)
    return [...this.foundItems].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Search items by keyword with case-insensitive matching
   * Requirements: 10.4, 10.5
   */
  searchItems(keyword: string, itemType: 'lost' | 'found'): (LostItem | FoundItem)[] {
    const lowerKeyword = keyword.toLowerCase();
    
    if (itemType === 'lost') {
      return this.lostItems
        .filter(item => item.description.toLowerCase().includes(lowerKeyword))
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } else {
      return this.foundItems
        .filter(item => item.description.toLowerCase().includes(lowerKeyword))
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
  }

  /**
   * Generate a unique item ID
   */
  private generateItemId(type: 'lost' | 'found'): string {
    return `${type}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Helper method to clear all items (for testing)
   */
  clearAllItems(): void {
    this.lostItems = [];
    this.foundItems = [];
  }

  /**
   * Helper method to get item by ID (for testing)
   */
  getItemById(itemId: string): LostItem | FoundItem | undefined {
    const lostItem = this.lostItems.find(item => item.id === itemId);
    if (lostItem) return lostItem;
    
    const foundItem = this.foundItems.find(item => item.id === itemId);
    return foundItem;
  }
}
