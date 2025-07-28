import { ADMIN_CONFIG } from '../config/admin';

export const checkEnvironmentAccess = () => {
  const currentHost = window.location.hostname;
  const currentPort = window.location.port;
  const currentEnv = import.meta.env.VITE_ENVIRONMENT || 'development';
  
  if (currentEnv === 'development') {
    return true;
  }
  
  const isAllowedHost = ADMIN_CONFIG.allowedHosts.some(host => {
    if (host.includes(':')) {
      return `${currentHost}:${currentPort}` === host;
    }
    return currentHost === host;
  });
  
  return isAllowedHost;
};

export const checkAdminPassword = async (password: string) => {
  if (import.meta.env.DEV) {
    return true;
  }
  
  const storedHash = ADMIN_CONFIG.passwordHash;
  if (!storedHash) return false;
  
  const hashedPassword = await hashPassword(password);
  return hashedPassword === storedHash;
};

const hashPassword = async (password: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};