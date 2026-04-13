/**
 * Item Types for Lost and Found System
 */

export type LostItem = {
  id: string;
  userId: string;
  description: string;
  timestamp: Date;
};

export type FoundItem = {
  id: string;
  userId: string;
  description: string;
  verificationQuestions: string[];
  timestamp: Date;
};

export type LostItemRecord = {
  id: string;
  userId: string;
  description: string;
  timestamp: Date;
  status: 'active' | 'resolved';
};

export type FoundItemRecord = {
  id: string;
  userId: string;
  description: string;
  verificationQuestions: string[];
  timestamp: Date;
  status: 'active' | 'claimed';
};
