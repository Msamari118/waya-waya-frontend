import { getEnvironmentConfig } from './environment';

export const ADMIN_CONFIG = {
    environments: {
      development: {
        enabled: true,
        requireBackendAuth: true,
        showAdminButton: false // Removed for security
      },
      staging: {
        enabled: true,
        requireBackendAuth: true,
        showAdminButton: false
      },
      production: {
        enabled: true,
        requireBackendAuth: true,
        showAdminButton: false
      }
    },
    
    // Backend authentication only - no frontend access
    backendAuth: {
      enabled: true,
      requireTwoFactor: false, // Can be enabled per environment
      sessionTimeout: 3600000, // 1 hour in milliseconds
      maxLoginAttempts: 5,
      lockoutDuration: 900000 // 15 minutes in milliseconds
    },
    
    // Security settings
    security: {
      requireHTTPS: true,
      enableAuditLogging: true,
      enableRateLimiting: true,
      allowedIPs: ['127.0.0.1', '::1', 'localhost'] // For development only
    }
  };