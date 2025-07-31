/**
 * Production Feature Flags
 * Controls feature availability based on environment
 */

export interface FeatureFlags {
  // Core Features
  enableDemoMode: boolean;
  enableDebugMode: boolean;
  enableAnalytics: boolean;
  
  // Payment Features
  enablePaymentGateway: boolean;
  enableEFT: boolean;
  enableCardPayments: boolean;
  
  // Communication Features
  enableChat: boolean;
  enableFileUpload: boolean;
  enableVoiceMessages: boolean;
  enableEmailNotifications: boolean;
  enableSMSNotifications: boolean;
  
  // Admin Features
  enableAdminPanel: boolean;
  enableTwoFactorAuth: boolean;
  enableAuditLogging: boolean;
  
  // Provider Features
  enableProviderRegistration: boolean;
  enableProfileUpload: boolean;
  enableAvailabilityManagement: boolean;
  enableCommissionTracking: boolean;
  
  // Client Features
  enableServiceRequests: boolean;
  enableBooking: boolean;
  enableRatings: boolean;
  enableReviews: boolean;
}

/**
 * Get feature flags based on environment
 */
export function getFeatureFlags(): FeatureFlags {
  const environment = import.meta.env.VITE_ENVIRONMENT || 'production';
  const enableDemoMode = import.meta.env.VITE_ENABLE_DEMO_MODE === 'true';
  const enableDebugMode = import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true';
  const enableAnalytics = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';

  const isProduction = environment === 'production';
  const isDevelopment = environment === 'development';
  const isStaging = environment === 'staging';

  return {
    // Core Features
    enableDemoMode: isDevelopment || enableDemoMode,
    enableDebugMode: isDevelopment || enableDebugMode,
    enableAnalytics: isProduction || enableAnalytics,
    
    // Payment Features
    enablePaymentGateway: isProduction,
    enableEFT: isProduction,
    enableCardPayments: isProduction,
    
    // Communication Features
    enableChat: true,
    enableFileUpload: isProduction,
    enableVoiceMessages: isProduction,
    enableEmailNotifications: isProduction,
    enableSMSNotifications: isProduction,
    
    // Admin Features
    enableAdminPanel: true,
    enableTwoFactorAuth: isProduction,
    enableAuditLogging: isProduction,
    
    // Provider Features
    enableProviderRegistration: true,
    enableProfileUpload: isProduction,
    enableAvailabilityManagement: true,
    enableCommissionTracking: isProduction,
    
    // Client Features
    enableServiceRequests: true,
    enableBooking: true,
    enableRatings: true,
    enableReviews: true,
  };
}

/**
 * Check if a specific feature is enabled
 */
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  const flags = getFeatureFlags();
  return flags[feature];
}

/**
 * Get environment-specific configuration
 */
export function getEnvironmentConfig() {
  const environment = import.meta.env.VITE_ENVIRONMENT || 'production';
  
  return {
    environment,
    isProduction: environment === 'production',
    isDevelopment: environment === 'development',
    isStaging: environment === 'staging',
    isDemo: environment === 'demo',
  };
} 