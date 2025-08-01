// API Configuration - Production Ready
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://waya-waya-backend-production.up.railway.app';

// International Country Codes with guaranteed unique IDs
export const internationalCountryCodes = [
  { id: 'cc-za', code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { id: 'cc-us', code: '+1', country: 'United States', flag: '🇺🇸' },
  { id: 'cc-ca', code: '+1', country: 'Canada', flag: '🇨🇦' },
  { id: 'cc-gb', code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { id: 'cc-de', code: '+49', country: 'Germany', flag: '🇩🇪' },
  { id: 'cc-fr', code: '+33', country: 'France', flag: '🇫🇷' },
  { id: 'cc-es', code: '+34', country: 'Spain', flag: '🇪🇸' },
  { id: 'cc-it', code: '+39', country: 'Italy', flag: '🇮🇹' },
  { id: 'cc-au', code: '+61', country: 'Australia', flag: '🇦🇺' },
  { id: 'cc-in', code: '+91', country: 'India', flag: '🇮🇳' },
  { id: 'cc-cn', code: '+86', country: 'China', flag: '🇨🇳' },
  { id: 'cc-jp', code: '+81', country: 'Japan', flag: '🇯🇵' },
  { id: 'cc-br', code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { id: 'cc-mx', code: '+52', country: 'Mexico', flag: '🇲🇽' },
  { id: 'cc-ar', code: '+54', country: 'Argentina', flag: '🇦🇷' },
  { id: 'cc-ru', code: '+7', country: 'Russia', flag: '🇷🇺' },
  { id: 'cc-kr', code: '+82', country: 'South Korea', flag: '🇰🇷' },
  { id: 'cc-sg', code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { id: 'cc-ae', code: '+971', country: 'United Arab Emirates', flag: '🇦🇪' },
  { id: 'cc-ng', code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { id: 'cc-ke', code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { id: 'cc-gh', code: '+233', country: 'Ghana', flag: '🇬🇭' },
  { id: 'cc-eg', code: '+20', country: 'Egypt', flag: '🇪🇬' },
  { id: 'cc-ma', code: '+212', country: 'Morocco', flag: '🇲🇦' },
  { id: 'cc-th', code: '+66', country: 'Thailand', flag: '🇹🇭' },
  { id: 'cc-ph', code: '+63', country: 'Philippines', flag: '🇵🇭' },
  { id: 'cc-id', code: '+62', country: 'Indonesia', flag: '🇮🇩' },
  { id: 'cc-my', code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { id: 'cc-vn', code: '+84', country: 'Vietnam', flag: '🇻🇳' },
  { id: 'cc-pk', code: '+92', country: 'Pakistan', flag: '🇵🇰' }
];

// Service Categories
export const serviceCategories = [
  { name: 'Plumbing', icon: '🔧', color: 'bg-blue-500' },
  { name: 'Electrical', icon: '⚡', color: 'bg-yellow-500' },
  { name: 'Cleaning', icon: '🧽', color: 'bg-green-500' },
  { name: 'Beauty', icon: '💄', color: 'bg-pink-500' },
  { name: 'Transport', icon: '🚗', color: 'bg-purple-500' },
  { name: 'Security', icon: '🛡️', color: 'bg-red-500' },
  { name: 'Tutoring', icon: '📚', color: 'bg-indigo-500' },
  { name: 'Garden', icon: '🌱', color: 'bg-emerald-500' },
];

// Featured Providers Mock Data
export const featuredProviders = [
  {
    id: 1,
    name: 'Ahmed Hassan',
    service: 'Electrician',
    rating: 4.9,
    reviews: 127,
    distance: '2.3 km',
    available: true,
    hourlyRate: 250,
    currency: 'R',
    image: null,
    trialDaysLeft: 3,
    commissionDue: 145.50,
    phone: '+27 82 123 4567',
    responseTime: '~15 min'
  },
  {
    id: 2,
    name: 'Maria Santos',
    service: 'House Cleaning',
    rating: 4.8,
    reviews: 89,
    distance: '1.8 km',
    available: true,
    hourlyRate: 180,
    currency: 'R',
    image: null,
    trialDaysLeft: 0,
    commissionDue: 89.25,
    phone: '+27 83 456 7890',
    responseTime: '~5 min'
  },
  {
    id: 3,
    name: 'James Wilson',
    service: 'Plumber',
    rating: 4.7,
    reviews: 156,
    distance: '3.1 km',
    available: false,
    hourlyRate: 300,
    currency: 'R',
    image: null,
    trialDaysLeft: 7,
    commissionDue: 230.75,
    phone: '+27 84 789 0123',
    responseTime: '~30 min'
  },
];

// Mock Blocked Clients Data
export const blockedClients = [
  { id: 1, name: 'John Doe', email: 'john@example.com', reason: 'Non-payment of R450.00', blockedDate: '2024-01-15', amountDue: 450.00 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', reason: 'Multiple payment failures', blockedDate: '2024-01-10', amountDue: 320.00 },
];

// South African Provinces
export const southAfricanProvinces = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape'
];

// Default Registration Data
export const defaultRegistrationData = {
  // Step 1: Personal Information
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  countryCode: '+27',
  idNumber: '',
  profilePicture: null,
  profilePicturePreview: null,
  
  // Step 2: Service Information
  primaryService: '',
  serviceDescription: '',
  skills: [],
  certifications: [],
  
  // Step 3: Location & Availability
  address: '',
  city: '',
  province: '',
  postalCode: '',
  serviceRadius: '10',
  availability: {
    monday: { available: true, start: '08:00', end: '17:00' },
    tuesday: { available: true, start: '08:00', end: '17:00' },
    wednesday: { available: true, start: '08:00', end: '17:00' },
    thursday: { available: true, start: '08:00', end: '17:00' },
    friday: { available: true, start: '08:00', end: '17:00' },
    saturday: { available: false, start: '09:00', end: '15:00' },
    sunday: { available: false, start: '09:00', end: '15:00' }
  },
  
  // Step 4: Pricing & Experience
  hourlyRate: '',
  minimumCharge: '',
  experienceYears: '',
  portfolio: [],
  references: [],
  
  // Step 5: Terms & Payment
  agreeToTerms: false,
  agreeToBackgroundCheck: false,
  paymentMethod: 'eft',
  applicationFeePaid: false
};

// Default Booking Data
export const defaultBookingData = {
  serviceType: '',
  description: '',
  preferredTime: '',
  location: { lat: null, lng: null, address: '' }
};

// Default Booking Details
export const defaultBookingDetails = {
  date: '',
  time: '',
  description: '',
  urgency: 'normal',
  location: '',
  estimatedHours: 1
};

// Default Custom Service
export const defaultCustomService = {
  name: '',
  description: '',
  rate: '',
  category: 'other'
};

// Default OTP State
export const defaultOtpState = {
  phoneOtpSent: false,
  phoneOtpVerified: false,
  emailVerified: false,
  otpLoading: false,
  otpError: '',
  resendCooldown: 0
};