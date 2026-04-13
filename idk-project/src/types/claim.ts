/**
 * Claim Types for Verification System
 */

export type ClaimRequest = {
  id: string;
  foundItemId: string;
  claimantUserId: string;
  answers: string[];
  timestamp: Date;
};

export type ClaimRecord = {
  id: string;
  foundItemId: string;
  claimantUserId: string;
  answers: string[];
  timestamp: Date;
  status: 'pending' | 'approved' | 'rejected';
};
