/**
 * User Account Types
 */

export type UserAccount = {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: Date;
};

export type AdminSession = {
  adminId: string;
  sessionToken: string;
  expiresAt: Date;
};
