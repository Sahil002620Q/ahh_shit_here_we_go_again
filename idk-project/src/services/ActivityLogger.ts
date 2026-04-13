/**
 * Activity Logging Service
 * Handles logging of user actions and retrieval of activity logs for admins
 */

import { ActivityLog, ActionType, LogError, Result, Ok, Err } from '../types';

export interface ActivityLogger {
  logActivity(userId: string, actionType: ActionType, details: string): void;
  getActivityLogs(adminId: string): Result<ActivityLog[], LogError>;
}

/**
 * In-memory implementation of ActivityLogger
 * In production, this would persist to a database
 */
export class InMemoryActivityLogger implements ActivityLogger {
  private logs: ActivityLog[];
  private isAdminFn: (userId: string) => boolean;

  constructor(isAdminFn: (userId: string) => boolean) {
    this.logs = [];
    this.isAdminFn = isAdminFn;
  }

  /**
   * Log an activity
   * Requirements: 2.1, 2.3
   */
  logActivity(userId: string, actionType: ActionType, details: string): void {
    const log: ActivityLog = {
      id: this.generateLogId(),
      userId,
      actionType,
      details,
      timestamp: new Date()
    };

    this.logs.push(log);
  }

  /**
   * Retrieve all activities (admin only)
   * Requirements: 2.2, 2.4
   */
  getActivityLogs(adminId: string): Result<ActivityLog[], LogError> {
    // Check if requesting user is admin
    if (!this.isAdminFn(adminId)) {
      return Err({ type: 'Unauthorized' });
    }

    // Return logs in chronological order (already in order as they're appended)
    return Ok([...this.logs]);
  }

  /**
   * Generate a unique log ID
   */
  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Helper method to clear all logs (for testing)
   */
  clearAllLogs(): void {
    this.logs = [];
  }

  /**
   * Helper method to get log count (for testing)
   */
  getLogCount(): number {
    return this.logs.length;
  }
}
