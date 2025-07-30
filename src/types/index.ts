// src/types/index.ts
// UI Component Types (not in apiClient.ts)

export interface User {
    id: string;
    email: string;
    userType: 'client' | 'provider' | 'admin';
    role?: string;
    name: string;
    phone?: string;
    location?: string;
    services?: string[];
    hourlyRate?: number;
    rating?: number;
    isVerified?: boolean;
  }
  
  export interface ServiceRequest {
    id: string;
    clientId: string;
    clientName: string;
    serviceType: string;
    description: string;
    location: string;
    budget: number;
    status: 'pending' | 'accepted' | 'completed' | 'cancelled';
    createdAt: Date;
    providerId?: string;
    providerName?: string;
  }
  
  export interface ChatMessage {
    id: string;
    text: string;
    files?: File[];
    sender: string;
    timestamp: string;
    type: 'user' | 'provider';
    providerId?: string;
  }
  
  export interface Provider {
    id: number;
    name: string;
    email: string;
    phone: string;
    service: string;
    hourlyRate: number;
    rating: number;
    location: string;
    available: boolean;
    isVerified: boolean;
    services: string[];
    reviews: number;
    distance: string;
    currency: string;
    image?: string | null;
    trialDaysLeft: number;
    commissionDue: number;
    responseTime: string;
  }
  
  export interface CustomService {
    id: number;
    name: string;
    description: string;
    price: number;
  }
  
  export interface BookingDetails {
    date: string;
    time: string;
    duration: number;
    location: string;
    description: string;
    customServices: CustomService[];
    totalAmount: number;
  }
  
  export interface BookingData {
    serviceType: string;
    description: string;
    preferredTime: string;
    location: {
      lat: number | null;
      lng: number | null;
      address: string;
    };
  }
  
  export interface CustomServiceForm {
    name: string;
    description: string;
    price: number;
  }
  
  export interface WayaWayaLogoProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    showText?: boolean;
  }
  
  export interface CountryCode {
    id: string;
    code: string;
    country: string;
    flag: string;
  }
  
  export interface ServiceCategory {
    id: string;
    name: string;
    icon: string;
    description: string;
  }
  
  export interface BlockedClient {
    id: string;
    name: string;
    email: string;
    reason: string;
    blockedAt: Date;
  }