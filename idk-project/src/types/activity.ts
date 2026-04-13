/**
 * Activity Logging Types
 */

export type ActionType = 
  | 'LostItemPosted'
  | 'FoundItemPosted'
  | 'ClaimSubmitted'
  | 'ChatMessageSent'
  | 'AdminLogin';

export type ActivityLog = {
  id: string;
  userId: string;
  actionType: ActionType;
  details: string;
  timestamp: Date;
};

export type ActivityLogRecord = {
  id: string;
  userId: string;
  actionType: string;
  details: string;
  timestamp: Date;
};
