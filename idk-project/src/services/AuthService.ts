/**
 * Authentication and Authorization Service
 * Handles admin authentication, session management, and access control
 */

import { AdminSession, UserAccount, AuthError, Result, Ok, Err } from '../types';

export interface AuthService {
  authenticateAdmin(username: string, password: string): Result<AdminSession, AuthError>;
  validateAdminSession(sessionToken: string): Result<string, AuthError>;
  isAdmin(userId: string): boolean;
  logout(sessionToken: string): Result<void, AuthError>;
}

/**
 * In-memory implementation of AuthService
 * In production, this would connect to a database and use proper password hashing
 */
export class InMemoryAuthService implements AuthService {
  private users: Map<string, UserAccount>;
  private credentials: Map<string, string>; // username -> password (in production: hashed)
  private sessions: Map<string, AdminSession>;
  private sessionDuration: number; // in milliseconds

  constructor(sessionDurationMs: number = 3600000) { // default 1 hour
    this.users = new Map();
    this.credentials = new Map();
    this.sessions = new Map();
    this.sessionDuration = sessionDurationMs;
  }

  /**
   * Register a user account (for testing purposes)
   */
  registerUser(user: UserAccount, password: string): void {
    this.users.set(user.id, user);
    this.credentials.set(user.username, password);
  }

  /**
   * Authenticate admin with credentials
   * Requirements: 1.1, 1.3
   */
  authenticateAdmin(username: string, password: string): Result<AdminSession, AuthError> {
    // Validate credentials
    const storedPassword = this.credentials.get(username);
    if (!storedPassword || storedPassword !== password) {
      return Err({ type: 'InvalidCredentials' });
    }

    // Find user by username
    const user = Array.from(this.users.values()).find(u => u.username === username);
    if (!user) {
      return Err({ type: 'InvalidCredentials' });
    }

    // Check if user is admin
    if (!user.isAdmin) {
      return Err({ type: 'Unauthorized' });
    }

    // Create session
    const sessionToken = this.generateSessionToken();
    const expiresAt = new Date(Date.now() + this.sessionDuration);
    
    const session: AdminSession = {
      adminId: user.id,
      sessionToken,
      expiresAt
    };

    this.sessions.set(sessionToken, session);
    return Ok(session);
  }

  /**
   * Validate admin session
   * Requirements: 1.4
   */
  validateAdminSession(sessionToken: string): Result<string, AuthError> {
    const session = this.sessions.get(sessionToken);
    
    if (!session) {
      return Err({ type: 'Unauthorized' });
    }

    // Check if session has expired
    if (new Date() > session.expiresAt) {
      this.sessions.delete(sessionToken);
      return Err({ type: 'SessionExpired' });
    }

    return Ok(session.adminId);
  }

  /**
   * Check if user has admin privileges
   * Requirements: 1.2, 1.3
   */
  isAdmin(userId: string): boolean {
    const user = this.users.get(userId);
    return user?.isAdmin ?? false;
  }

  /**
   * Terminate admin session
   */
  logout(sessionToken: string): Result<void, AuthError> {
    const session = this.sessions.get(sessionToken);
    
    if (!session) {
      return Err({ type: 'Unauthorized' });
    }

    this.sessions.delete(sessionToken);
    return Ok(undefined);
  }

  /**
   * Generate a unique session token
   * In production, use a cryptographically secure random generator
   */
  private generateSessionToken(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Helper method to get all sessions (for testing)
   */
  getAllSessions(): AdminSession[] {
    return Array.from(this.sessions.values());
  }

  /**
   * Helper method to clear all sessions (for testing)
   */
  clearAllSessions(): void {
    this.sessions.clear();
  }
}
