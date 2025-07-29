export interface EnvironmentConfig {
  api: {
    baseUrl: string;
  };
  admin: {
    passwordHash: string;
  };
  environment: string;
}

export function getEnvironmentConfig(): EnvironmentConfig {
  return {
    api: {
      baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://waya-waya-backend-production.up.railway.app',
    },
    admin: {
      passwordHash: import.meta.env.VITE_ADMIN_PASSWORD_HASH || '',
    },
    environment: import.meta.env.VITE_ENVIRONMENT || 'development',
  };
} 