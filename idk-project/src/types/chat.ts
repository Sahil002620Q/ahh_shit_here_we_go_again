/**
 * Chat Message Types
 */

export type ChatMessage = {
  id: string;
  content: string;
  timestamp: Date;
  senderDisplay: string;  // "Anonymous" or actual username
  isAnonymous: boolean;
};

export type ChatMessageWithSender = {
  id: string;
  content: string;
  timestamp: Date;
  actualSenderId: string;
  isAnonymous: boolean;
};

export type ChatMessageRecord = {
  id: string;
  senderId: string;
  content: string;
  isAnonymous: boolean;
  timestamp: Date;
};
