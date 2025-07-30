// src/utils/constants.ts
// Centralized constants for the Waya Waya application

import { CountryCode, ServiceCategory, Provider, BlockedClient } from '../types';

// ============================================================================
// INTERNATIONAL COUNTRY CODES (Simplified)
// ============================================================================

export const INTERNATIONAL_COUNTRY_CODES: CountryCode[] = [
  { id: 'cc-za', code: '+27', country: 'South Africa', flag: '��' },
  { id: 'cc-us', code: '+1', country: 'United States', flag: '��' },
  { id: 'cc-gb', code: '+44', country: 'United Kingdom', flag: '��' },
  { id: 'cc-au', code: '+61', country: 'Australia', flag: '��' },
  { id: 'cc-ca', code: '+1', country: 'Canada', flag: '🇨' }
];

// ============================================================================
// SERVICE CATEGORIES (Simplified)
// ============================================================================

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: 'sc-cleaning', name: 'Cleaning', icon: '🧹', description: 'House cleaning and maintenance services' },
  { id: 'sc-plumbing', name: 'Plumbing', icon: '', description: 'Plumbing repair and installation services' },
  { id: 'sc-electrical', name: 'Electrical', icon: '⚡', description: 'Electrical work and repairs' },
  { id: 'sc-carpentry', name: 'Carpentry', icon: '🔨', description: 'Woodwork and furniture services' },
  { id: 'sc-painting', name: 'Painting', icon: '🎨', description: 'Interior and exterior painting services' },
  { id: 'sc-gardening', name: 'Gardening', icon: '🌱', description: 'Landscaping and garden maintenance' },
  { id: 'sc-moving', name: 'Moving', icon: '📦', description: 'Moving and relocation services' },
  { id: 'sc-security', name: 'Security', icon: '🔒', description: 'Security system installation and monitoring' }
];

// ============================================================================
// MOCK DATA
// ============================================================================

export const FEATURED_PROVIDERS: Provider[] = [
  {
    id: 'provider-1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+27123456789',
    location: 'Johannesburg, South Africa',
    isVerified: true,
    services: ['Cleaning', 'Plumbing'],
    reviews: 4.8,
    distance: 2.5,
    currency: 'ZAR',
    image: '/api/placeholder/150/150',
    trialDaysLeft: 0,
    commissionDue: 150,
    responseTime: 15,
    hourlyRate: 250,
    rating: 4.8
  },
  {
    id: 'provider-2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+27123456790',
    location: 'Cape Town, South Africa',
    isVerified: true,
    services: ['Electrical', 'Carpentry'],
    reviews: 4.9,
    distance: 3.2,
    currency: 'ZAR',
    image: '/api/placeholder/150/150',
    trialDaysLeft: 0,
    commissionDue: 200,
    responseTime: 10,
    hourlyRate: 300,
    rating: 4.9
  }
];

export const BLOCKED_CLIENTS: BlockedClient[] = [
  {
    id: 'client-1',
    name: 'Blocked User',
    email: 'blocked@example.com',
    reason: 'Payment issues',
    blockedAt: new Date('2024-01-15')
  }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const getApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    return 'https://waya-waya-backend-production.up.railway.app';
  }
  return import.meta.env.VITE_API_BASE_URL || 'https://waya-waya-backend-production.up.railway.app';
};

export const API_BASE_URL = getApiBaseUrl();

export const validatePassword = (password: string) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
};

export const checkAdminAccess = async (password: string) => {
  // This would typically check against hashed password in environment
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD_HASH;
  return password === 'admin123'; // Simplified for now
};

export const setAdminAccess = (hasAccess: boolean) => {
  localStorage.setItem('adminAccess', hasAccess.toString());
};