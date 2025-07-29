import { getEnvironmentConfig } from './environment';

export const ADMIN_CONFIG = {
    environments: {
      development: {
        enabled: true,
        requirePassword: false,
        showAdminButton: true
      },
      staging: {
        enabled: true,
        requirePassword: true,
        showAdminButton: false
      },
      production: {
        enabled: false,
        requirePassword: true,
        showAdminButton: false
      }
    },
    
    allowedHosts: [
      'localhost', 
      '127.0.0.1', 
      'localhost:3000', 
      '127.0.0.1:3000',
      'localhost:5173',
      '127.0.0.1:5173'
    ],
    
    passwordHash: getEnvironmentConfig().admin.passwordHash,
    allowedIPs: ['127.0.0.1', '::1', 'localhost']
  };