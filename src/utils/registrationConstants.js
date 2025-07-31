/**
 * Provider Registration Constants
 */

export const REGISTRATION_STEPS = {
    PERSONAL_INFO: 1,
    SERVICE_INFO: 2,
    LOCATION_INFO: 3,
    PAYMENT_INFO: 4,
    DOCUMENT_UPLOAD: 5,
    REVIEW: 6
  };
  
  export const TOTAL_STEPS = 6;
  
  export const APPLICATION_FEES = {
    SOUTH_AFRICA: 150,
    INTERNATIONAL: 300
  };
  
  export const DEFAULT_AVAILABILITY = {
    monday: { available: true, start: '08:00', end: '17:00' },
    tuesday: { available: true, start: '08:00', end: '17:00' },
    wednesday: { available: true, start: '08:00', end: '17:00' },
    thursday: { available: true, start: '08:00', end: '17:00' },
    friday: { available: true, start: '08:00', end: '17:00' },
    saturday: { available: false, start: '09:00', end: '15:00' },
    sunday: { available: false, start: '09:00', end: '15:00' }
  };
  
  export const DEFAULT_FORM_DATA = {
    // Step 1: Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+27',
    idNumber: '',
    dateOfBirth: '',
    profilePicture: null,
    profilePicturePreview: null,
    
    // Step 2: Service Information  
    primaryService: '',
    serviceDescription: '',
    skills: [],
    certifications: [],
    experienceYears: '',
    
    // Step 3: Location & Availability
    address: '',
    city: '',
    province: '',
    postalCode: '',
    serviceRadius: '10',
    emergencyAvailable: false,
    availability: DEFAULT_AVAILABILITY,
    
    // Step 4: Pricing & Portfolio
    hourlyRate: '',
    minimumCharge: '',
    calloutFee: '',
    portfolioImages: [],
    workSamples: [],
    clientReferences: [],
    insuranceDetails: '',
    
    // Step 5: Documents & Verification
    identityDocument: null,
    qualificationCertificates: [],
    businessLicense: null,
    bankingDetails: {
      bankName: '',
      accountHolder: '',
      accountNumber: '',
      branchCode: '',
      accountType: 'current'
    },
    
    // Step 6: Terms & Payment
    agreeToTerms: false,
    agreeToBackgroundCheck: false,
    agreeToDataProcessing: false,
    marketingConsent: false,
    paymentMethod: 'paystack',
    applicationFeePaid: false
  };
  
  export const DEFAULT_CROP_SETTINGS = {
    zoom: 1,
    rotation: 0,
    x: 0,
    y: 0,
    width: 300,
    height: 300
  };
  
  export const STEP_TITLES = {
    [REGISTRATION_STEPS.PERSONAL_INFO]: 'Personal Information',
    [REGISTRATION_STEPS.SERVICE_INFO]: 'Service Information',
    [REGISTRATION_STEPS.LOCATION]: 'Location & Availability',
    [REGISTRATION_STEPS.PRICING]: 'Pricing & Portfolio',
    [REGISTRATION_STEPS.DOCUMENTS]: 'Documents & Verification',
    [REGISTRATION_STEPS.PAYMENT]: 'Terms & Payment'
  };
  
  export const STEP_DESCRIPTIONS = {
    [REGISTRATION_STEPS.PERSONAL_INFO]: 'Tell us about yourself',
    [REGISTRATION_STEPS.SERVICE_INFO]: 'What services do you provide?',
    [REGISTRATION_STEPS.LOCATION]: 'Where do you provide services?',
    [REGISTRATION_STEPS.PRICING]: 'Set your rates and showcase experience',
    [REGISTRATION_STEPS.DOCUMENTS]: 'Upload required documents',
    [REGISTRATION_STEPS.PAYMENT]: 'Final step to complete registration'
  };
  
  export const STEP_ICONS = {
    [REGISTRATION_STEPS.PERSONAL_INFO]: 'UserCheck',
    [REGISTRATION_STEPS.SERVICE_INFO]: 'Briefcase',
    [REGISTRATION_STEPS.LOCATION]: 'MapPin',
    [REGISTRATION_STEPS.PRICING]: 'DollarSign',
    [REGISTRATION_STEPS.DOCUMENTS]: 'FileText',
    [REGISTRATION_STEPS.PAYMENT]: 'CreditCard'
  };
  
  export const PROGRESS_LABELS = [
    'Personal Info',
    'Services', 
    'Location',
    'Pricing',
    'Documents',
    'Payment'
  ];