import bcrypt from 'bcrypt';

export interface HashConfig {
  saltRounds: number;
}

export class PasswordHasher {
  private saltRounds: number;

  constructor(config: HashConfig = { saltRounds: 10 }) {
    this.saltRounds = config.saltRounds;
  }

  /**
   * Hash a password using bcrypt
   * @param password - The plain text password to hash
   * @returns Promise<string> - The hashed password
   */
  async hashPassword(password: string): Promise<string> {
    try {
      const hashedPassword = await bcrypt.hash(password, this.saltRounds);
      return hashedPassword;
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new Error('Failed to hash password');
    }
  }

  /**
   * Verify a password against a hash
   * @param password - The plain text password to verify
   * @param hash - The hashed password to compare against
   * @returns Promise<boolean> - True if password matches, false otherwise
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      const isValid = await bcrypt.compare(password, hash);
      return isValid;
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }

  /**
   * Generate a hash for environment variables
   * @param password - The plain text password
   * @returns Promise<string> - The hashed password ready for .env file
   */
  async generateEnvHash(password: string): Promise<string> {
    const hash = await this.hashPassword(password);
    return hash;
  }

  /**
   * Verify admin password from environment
   * @param inputPassword - The password entered by user
   * @param envHash - The hash from environment variable
   * @returns Promise<boolean> - True if password matches
   */
  async verifyAdminPassword(inputPassword: string, envHash: string): Promise<boolean> {
    return this.verifyPassword(inputPassword, envHash);
  }
}

// Default instance
export const passwordHasher = new PasswordHasher();

// Utility functions for easy use
export const hashPassword = (password: string): Promise<string> => {
  return passwordHasher.hashPassword(password);
};

export const verifyPassword = (password: string, hash: string): Promise<boolean> => {
  return passwordHasher.verifyPassword(password, hash);
};

export const generateEnvHash = (password: string): Promise<string> => {
  return passwordHasher.generateEnvHash(password);
};

export const verifyAdminPassword = (inputPassword: string, envHash: string): Promise<boolean> => {
  return passwordHasher.verifyAdminPassword(inputPassword, envHash);
}; 