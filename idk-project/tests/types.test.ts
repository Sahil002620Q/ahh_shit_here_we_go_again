/**
 * Test to verify all core types are properly defined and exported
 */

import {
  UserAccount,
  AdminSession,
  LostItem,
  FoundItem,
  LostItemRecord,
  FoundItemRecord,
  ClaimRequest,
  ClaimRecord,
  ChatMessage,
  ChatMessageWithSender,
  ChatMessageRecord,
  ActionType,
  ActivityLog,
  ActivityLogRecord,
  AuthError,
  ItemError,
  ClaimError,
  ChatError,
  LogError,
  Result,
  Ok,
  Err
} from '../src/types';

describe('Core Type Definitions', () => {
  test('User types are properly defined', () => {
    const user: UserAccount = {
      id: 'user1',
      username: 'testuser',
      email: 'test@example.com',
      isAdmin: false,
      createdAt: new Date()
    };
    expect(user.id).toBe('user1');
  });

  test('AdminSession type is properly defined', () => {
    const session: AdminSession = {
      adminId: 'admin1',
      sessionToken: 'token123',
      expiresAt: new Date()
    };
    expect(session.adminId).toBe('admin1');
  });

  test('Item types are properly defined', () => {
    const lostItem: LostItem = {
      id: 'lost1',
      userId: 'user1',
      description: 'Lost wallet',
      timestamp: new Date()
    };

    const foundItem: FoundItem = {
      id: 'found1',
      userId: 'user2',
      description: 'Found keys',
      verificationQuestions: ['What color is it?'],
      timestamp: new Date()
    };

    const lostItemRecord: LostItemRecord = {
      ...lostItem,
      status: 'active'
    };

    const foundItemRecord: FoundItemRecord = {
      ...foundItem,
      status: 'active'
    };

    expect(lostItem.description).toBe('Lost wallet');
    expect(foundItem.verificationQuestions).toHaveLength(1);
    expect(lostItemRecord.status).toBe('active');
    expect(foundItemRecord.status).toBe('active');
  });

  test('Claim types are properly defined', () => {
    const claim: ClaimRequest = {
      id: 'claim1',
      foundItemId: 'found1',
      claimantUserId: 'user1',
      answers: ['Blue'],
      timestamp: new Date()
    };

    const claimRecord: ClaimRecord = {
      ...claim,
      status: 'pending'
    };

    expect(claim.answers).toHaveLength(1);
    expect(claimRecord.status).toBe('pending');
  });

  test('Chat types are properly defined', () => {
    const message: ChatMessage = {
      id: 'msg1',
      content: 'Hello',
      timestamp: new Date(),
      senderDisplay: 'Anonymous',
      isAnonymous: true
    };

    const messageWithSender: ChatMessageWithSender = {
      id: 'msg2',
      content: 'Hello',
      timestamp: new Date(),
      actualSenderId: 'user1',
      isAnonymous: false
    };

    const messageRecord: ChatMessageRecord = {
      id: 'msg3',
      senderId: 'user1',
      content: 'Hello',
      isAnonymous: false,
      timestamp: new Date()
    };

    expect(message.isAnonymous).toBe(true);
    expect(messageWithSender.actualSenderId).toBe('user1');
    expect(messageRecord.senderId).toBe('user1');
  });

  test('Activity types are properly defined', () => {
    const actionType: ActionType = 'LostItemPosted';
    const log: ActivityLog = {
      id: 'log1',
      userId: 'user1',
      actionType: 'LostItemPosted',
      details: 'Posted a lost item',
      timestamp: new Date()
    };

    const logRecord: ActivityLogRecord = {
      id: 'log2',
      userId: 'user2',
      actionType: 'FoundItemPosted',
      details: 'Posted a found item',
      timestamp: new Date()
    };

    expect(actionType).toBe('LostItemPosted');
    expect(log.actionType).toBe('LostItemPosted');
    expect(logRecord.actionType).toBe('FoundItemPosted');
  });

  test('Error types are properly defined', () => {
    const authError: AuthError = { type: 'InvalidCredentials' };
    const itemError: ItemError = { type: 'EmptyDescription' };
    const claimError: ClaimError = { type: 'ItemNotFound', itemId: 'item1' };
    const chatError: ChatError = { type: 'EmptyMessage' };
    const logError: LogError = { type: 'Unauthorized' };

    expect(authError.type).toBe('InvalidCredentials');
    expect(itemError.type).toBe('EmptyDescription');
    expect(claimError.type).toBe('ItemNotFound');
    expect(chatError.type).toBe('EmptyMessage');
    expect(logError.type).toBe('Unauthorized');
  });

  test('Result type works correctly', () => {
    const success: Result<string, Error> = Ok('success');
    const failure: Result<string, Error> = Err(new Error('failed'));

    expect(success.success).toBe(true);
    if (success.success) {
      expect(success.value).toBe('success');
    }

    expect(failure.success).toBe(false);
    if (!failure.success) {
      expect(failure.error.message).toBe('failed');
    }
  });
});
