/**
 * Error Types for the Application
 */

export type AuthError = 
  | { type: 'InvalidCredentials' }
  | { type: 'SessionExpired' }
  | { type: 'Unauthorized' };

export type ItemError =
  | { type: 'EmptyDescription' }
  | { type: 'DescriptionTooLong'; maxLength: number }
  | { type: 'NoVerificationQuestions' }
  | { type: 'EmptyVerificationQuestion' }
  | { type: 'ItemNotFound'; itemId: string };

export type ClaimError =
  | { type: 'ItemNotFound'; itemId: string }
  | { type: 'AnswerCountMismatch'; expected: number; received: number }
  | { type: 'EmptyAnswer'; questionIndex: number };

export type ChatError =
  | { type: 'EmptyMessage' }
  | { type: 'Unauthorized' };

export type LogError =
  | { type: 'Unauthorized' };
