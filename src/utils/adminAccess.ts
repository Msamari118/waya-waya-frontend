import { verifyAdminPassword } from './passwordHash';
import { getEnvironmentConfig } from '../config/environment';

/**
 * Check if admin access is granted based on environment configuration
 * @returns Promise<boolean> - True if admin access is available
 */
export async function checkEnvironmentAccess(): Promise<boolean> {
  try {
    const config = getEnvironmentConfig();
    return config.environment === 'development' || config.environment === 'staging';
  } catch (error) {
    console.error('Error checking environment access:', error);
    return false;
  }
}

/**
 * Verify admin password against the hashed password from environment
 * @param inputPassword - The password entered by the user
 * @returns Promise<boolean> - True if password is correct
 */
export async function checkAdminPassword(inputPassword: string): Promise<boolean> {
  try {
    const config = getEnvironmentConfig();
    const envHash = config.admin.passwordHash;
    
    if (!envHash) {
      console.warn('No admin password hash found in environment');
      return false;
    }
    
    return await verifyAdminPassword(inputPassword, envHash);
  } catch (error) {
    console.error('Error verifying admin password:', error);
    return false;
  }
}

/**
 * Combined admin access check
 * @param inputPassword - Optional password to verify
 * @returns Promise<boolean> - True if admin access is granted
 */
export async function checkAdminAccess(inputPassword?: string): Promise<boolean> {
  try {
    // First check environment access
    const hasEnvironmentAccess = await checkEnvironmentAccess();
    
    if (hasEnvironmentAccess) {
      // If we have environment access, check password if provided
      if (inputPassword) {
        return await checkAdminPassword(inputPassword);
      }
      // If no password provided but we have environment access, grant access
      return true;
    }
    
    // If no environment access, require password verification
    if (inputPassword) {
      return await checkAdminPassword(inputPassword);
    }
    
    return false;
  } catch (error) {
    console.error('Error checking admin access:', error);
    return false;
  }
}