import { apiClient } from './apiClient.js';

/**
 * Backend-based admin authentication system
 * Removes frontend admin access for security
 */

export interface AdminSession {
  token: string;
  expiresAt: number;
  permissions: string[];
  userId: string;
}

export interface AdminLoginRequest {
  username: string;
  password: string;
  twoFactorCode?: string;
}

export interface AdminLoginResponse {
  success: boolean;
  session?: AdminSession;
  error?: string;
  requiresTwoFactor?: boolean;
}

/**
 * Attempt to login as admin via backend
 * @param credentials - Admin login credentials
 * @returns Promise<AdminLoginResponse>
 */
export async function adminLogin(credentials: AdminLoginRequest): Promise<AdminLoginResponse> {
  try {
    // This would call your backend admin authentication endpoint
    const response = await apiClient.admin.authenticate(credentials);
    
    if (response.ok) {
      const json = await response.json();
      
      if (json.success && json.session) {
        // Store admin session securely
        localStorage.setItem('adminSession', JSON.stringify(json.session));
        return json;
      }
      
      return {
        success: false,
        error: json.error || 'Authentication failed'
      };
    }
    
    return {
      success: false,
      error: 'Authentication failed'
    };
  } catch (error) {
    console.error('Admin login error:', error);
    return {
      success: false,
      error: 'Network error. Please try again.'
    };
  }
}

/**
 * Verify admin session is valid
 * @returns Promise<boolean>
 */
export async function verifyAdminSession(): Promise<boolean> {
  try {
    const sessionData = localStorage.getItem('adminSession');
    if (!sessionData) return false;
    
    const session: AdminSession = JSON.parse(sessionData);
    
    // Check if session is expired
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem('adminSession');
      return false;
    }
    
    // Verify session with backend
    const response = await apiClient.admin.verifySession(session.token);
    if (response.ok) {
      const json = await response.json();
      return json.valid;
    }
    return false;
  } catch (error) {
    console.error('Session verification error:', error);
    localStorage.removeItem('adminSession');
    return false;
  }
}

/**
 * Get current admin session
 * @returns AdminSession | null
 */
export function getAdminSession(): AdminSession | null {
  try {
    const sessionData = localStorage.getItem('adminSession');
    if (!sessionData) return null;
    
    const session: AdminSession = JSON.parse(sessionData);
    
    // Check if session is expired
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem('adminSession');
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Error getting admin session:', error);
    localStorage.removeItem('adminSession');
    return null;
  }
}

/**
 * Logout admin and clear session
 */
export function adminLogout(): void {
  localStorage.removeItem('adminSession');
}

/**
 * Check if user has admin permissions
 * @param permission - Specific permission to check
 * @returns boolean
 */
export function hasAdminPermission(permission: string): boolean {
  const session = getAdminSession();
  if (!session) return false;
  
  return session.permissions.includes(permission) || session.permissions.includes('*');
}

/**
 * Refresh admin session
 * @returns Promise<boolean>
 */
export async function refreshAdminSession(): Promise<boolean> {
  try {
    const session = getAdminSession();
    if (!session) return false;
    
    const response = await apiClient.admin.refreshSession(session.token);
    
    if (response.ok) {
      const json = await response.json();
      
      if (json.success && json.session) {
        localStorage.setItem('adminSession', JSON.stringify(json.session));
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Session refresh error:', error);
    return false;
  }
} 