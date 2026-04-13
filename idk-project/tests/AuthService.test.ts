/**
 * Unit tests for AuthService
 * Tests authentication, session management, and authorization
 */

import { InMemoryAuthService } from '../src/services/AuthService';
import { UserAccount } from '../src/types';

describe('AuthService', () => {
  let authService: InMemoryAuthService;
  let adminUser: UserAccount;
  let regularUser: UserAccount;

  beforeEach(() => {
    authService = new InMemoryAuthService(3600000); // 1 hour session
    
    adminUser = {
      id: 'admin1',
      username: 'admin',
      email: 'admin@college.edu',
      isAdmin: true,
      createdAt: new Date()
    };

    regularUser = {
      id: 'user1',
      username: 'student',
      email: 'student@college.edu',
      isAdmin: false,
      createdAt: new Date()
    };

    authService.registerUser(adminUser, 'admin123');
    authService.registerUser(regularUser, 'student123');
  });

  describe('authenticateAdmin', () => {
    test('should authenticate admin with valid credentials', () => {
      const result = authService.authenticateAdmin('admin', 'admin123');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.adminId).toBe('admin1');
        expect(result.value.sessionToken).toBeDefined();
        expect(result.value.expiresAt).toBeInstanceOf(Date);
        expect(result.value.expiresAt.getTime()).toBeGreaterThan(Date.now());
      }
    });

    test('should reject invalid username', () => {
      const result = authService.authenticateAdmin('nonexistent', 'password');
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('InvalidCredentials');
      }
    });

    test('should reject invalid password', () => {
      const result = authService.authenticateAdmin('admin', 'wrongpassword');
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('InvalidCredentials');
      }
    });

    test('should reject non-admin user attempting admin authentication', () => {
      const result = authService.authenticateAdmin('student', 'student123');
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('Unauthorized');
      }
    });

    test('should create unique session tokens for multiple logins', () => {
      const result1 = authService.authenticateAdmin('admin', 'admin123');
      const result2 = authService.authenticateAdmin('admin', 'admin123');
      
      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      
      if (result1.success && result2.success) {
        expect(result1.value.sessionToken).not.toBe(result2.value.sessionToken);
      }
    });
  });

  describe('validateAdminSession', () => {
    test('should validate a valid session token', () => {
      const authResult = authService.authenticateAdmin('admin', 'admin123');
      expect(authResult.success).toBe(true);
      
      if (authResult.success) {
        const validateResult = authService.validateAdminSession(authResult.value.sessionToken);
        
        expect(validateResult.success).toBe(true);
        if (validateResult.success) {
          expect(validateResult.value).toBe('admin1');
        }
      }
    });

    test('should reject invalid session token', () => {
      const result = authService.validateAdminSession('invalid_token');
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('Unauthorized');
      }
    });

    test('should reject expired session token', async () => {
      // Create service with very short session duration
      const shortSessionService = new InMemoryAuthService(100); // 100ms
      shortSessionService.registerUser(adminUser, 'admin123');
      
      const authResult = shortSessionService.authenticateAdmin('admin', 'admin123');
      expect(authResult.success).toBe(true);
      
      if (authResult.success) {
        // Wait for session to expire
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            const validateResult = shortSessionService.validateAdminSession(authResult.value.sessionToken);
            
            expect(validateResult.success).toBe(false);
            if (!validateResult.success) {
              expect(validateResult.error.type).toBe('SessionExpired');
            }
            resolve();
          }, 150);
        });
      }
    });

    test('should remove expired session from storage', async () => {
      const shortSessionService = new InMemoryAuthService(100);
      shortSessionService.registerUser(adminUser, 'admin123');
      
      const authResult = shortSessionService.authenticateAdmin('admin', 'admin123');
      expect(authResult.success).toBe(true);
      
      if (authResult.success) {
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            shortSessionService.validateAdminSession(authResult.value.sessionToken);
            
            // Try to validate again - should still be expired
            const secondValidation = shortSessionService.validateAdminSession(authResult.value.sessionToken);
            expect(secondValidation.success).toBe(false);
            if (!secondValidation.success) {
              expect(secondValidation.error.type).toBe('Unauthorized');
            }
            resolve();
          }, 150);
        });
      }
    });
  });

  describe('isAdmin', () => {
    test('should return true for admin user', () => {
      expect(authService.isAdmin('admin1')).toBe(true);
    });

    test('should return false for regular user', () => {
      expect(authService.isAdmin('user1')).toBe(false);
    });

    test('should return false for non-existent user', () => {
      expect(authService.isAdmin('nonexistent')).toBe(false);
    });
  });

  describe('logout', () => {
    test('should successfully logout with valid session', () => {
      const authResult = authService.authenticateAdmin('admin', 'admin123');
      expect(authResult.success).toBe(true);
      
      if (authResult.success) {
        const logoutResult = authService.logout(authResult.value.sessionToken);
        
        expect(logoutResult.success).toBe(true);
        
        // Verify session is no longer valid
        const validateResult = authService.validateAdminSession(authResult.value.sessionToken);
        expect(validateResult.success).toBe(false);
      }
    });

    test('should fail to logout with invalid session', () => {
      const result = authService.logout('invalid_token');
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('Unauthorized');
      }
    });

    test('should not allow double logout', () => {
      const authResult = authService.authenticateAdmin('admin', 'admin123');
      expect(authResult.success).toBe(true);
      
      if (authResult.success) {
        const firstLogout = authService.logout(authResult.value.sessionToken);
        expect(firstLogout.success).toBe(true);
        
        const secondLogout = authService.logout(authResult.value.sessionToken);
        expect(secondLogout.success).toBe(false);
        if (!secondLogout.success) {
          expect(secondLogout.error.type).toBe('Unauthorized');
        }
      }
    });
  });

  describe('edge cases', () => {
    test('should handle empty username', () => {
      const result = authService.authenticateAdmin('', 'password');
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('InvalidCredentials');
      }
    });

    test('should handle empty password', () => {
      const result = authService.authenticateAdmin('admin', '');
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('InvalidCredentials');
      }
    });

    test('should handle multiple concurrent sessions for same admin', () => {
      const session1 = authService.authenticateAdmin('admin', 'admin123');
      const session2 = authService.authenticateAdmin('admin', 'admin123');
      
      expect(session1.success).toBe(true);
      expect(session2.success).toBe(true);
      
      if (session1.success && session2.success) {
        // Both sessions should be valid
        const validate1 = authService.validateAdminSession(session1.value.sessionToken);
        const validate2 = authService.validateAdminSession(session2.value.sessionToken);
        
        expect(validate1.success).toBe(true);
        expect(validate2.success).toBe(true);
        
        // Logout one session shouldn't affect the other
        authService.logout(session1.value.sessionToken);
        
        const validate1After = authService.validateAdminSession(session1.value.sessionToken);
        const validate2After = authService.validateAdminSession(session2.value.sessionToken);
        
        expect(validate1After.success).toBe(false);
        expect(validate2After.success).toBe(true);
      }
    });
  });
});
