// ============================================================================
// LOCATION SERVICE - FUTURE API INTEGRATION
// ============================================================================
// This service provides location functionality using various APIs
// Currently commented out for future use
// ============================================================================

// Interface definitions for location data
interface LocationCoordinates {
  lat: number;
  lng: number;
}

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface PlaceResult {
  place_id: string;
  formatted_address: string;
  address_components: AddressComponent[];
  geometry: {
    location: LocationCoordinates;
    viewport: {
      northeast: LocationCoordinates;
      southwest: LocationCoordinates;
    };
  };
  types: string[];
}

interface LocationServiceConfig {
  googlePlacesApiKey?: string;
  mapboxApiKey?: string;
  enableGooglePlaces: boolean;
  enableMapbox: boolean;
  enableSouthAfricanPostal: boolean;
}

// ============================================================================
// GOOGLE PLACES API INTEGRATION
// ============================================================================

/*
// Google Places API Service
class GooglePlacesService {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api/place';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Search for places (addresses, businesses, etc.)
  async searchPlaces(query: string, types: string[] = ['address']): Promise<PlaceResult[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/textsearch/json?query=${encodeURIComponent(query)}&types=${types.join('|')}&key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.status}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Google Places search error:', error);
      throw error;
    }
  }

  // Get place details by place_id
  async getPlaceDetails(placeId: string): Promise<PlaceResult | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/details/json?place_id=${placeId}&fields=place_id,formatted_address,address_components,geometry,types&key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.status}`);
      }

      const data = await response.json();
      return data.result || null;
    } catch (error) {
      console.error('Google Places details error:', error);
      throw error;
    }
  }

  // Autocomplete addresses
  async autocompleteAddress(input: string): Promise<PlaceResult[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/autocomplete/json?input=${encodeURIComponent(input)}&types=address&components=country:za&key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.status}`);
      }

      const data = await response.json();
      return data.predictions || [];
    } catch (error) {
      console.error('Google Places autocomplete error:', error);
      throw error;
    }
  }

  // Get address components from place result
  extractAddressComponents(place: PlaceResult) {
    const components: any = {};
    
    place.address_components.forEach(component => {
      if (component.types.includes('street_number')) {
        components.streetNumber = component.long_name;
      } else if (component.types.includes('route')) {
        components.streetName = component.long_name;
      } else if (component.types.includes('sublocality')) {
        components.suburb = component.long_name;
      } else if (component.types.includes('locality')) {
        components.city = component.long_name;
      } else if (component.types.includes('administrative_area_level_1')) {
        components.province = component.long_name;
      } else if (component.types.includes('postal_code')) {
        components.postalCode = component.long_name;
      } else if (component.types.includes('country')) {
        components.country = component.long_name;
      }
    });

    return {
      streetAddress: `${components.streetNumber || ''} ${components.streetName || ''}`.trim(),
      suburb: components.suburb || '',
      city: components.city || '',
      province: components.province || '',
      postalCode: components.postalCode || '',
      country: components.country || '',
      coordinates: place.geometry.location
    };
  }
}
*/

// ============================================================================
// SOUTH AFRICAN POSTAL SERVICE API
// ============================================================================

/*
// South African Postal Service API
class SAPostalService {
  private baseUrl = 'https://api.sapostal.co.za/v1'; // Example API endpoint

  // Validate postal code
  async validatePostalCode(postalCode: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/postal-codes/${postalCode}/validate`);
      
      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.valid || false;
    } catch (error) {
      console.error('SA Postal validation error:', error);
      return false;
    }
  }

  // Get address details from postal code
  async getAddressFromPostalCode(postalCode: string) {
    try {
      const response = await fetch(`${this.baseUrl}/postal-codes/${postalCode}`);
      
      if (!response.ok) {
        throw new Error(`SA Postal API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        suburb: data.suburb,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode
      };
    } catch (error) {
      console.error('SA Postal lookup error:', error);
      throw error;
    }
  }

  // Get all postal codes for a suburb
  async getPostalCodesBySuburb(suburb: string) {
    try {
      const response = await fetch(`${this.baseUrl}/suburbs/${encodeURIComponent(suburb)}/postal-codes`);
      
      if (!response.ok) {
        throw new Error(`SA Postal API error: ${response.status}`);
      }

      const data = await response.json();
      return data.postalCodes || [];
    } catch (error) {
      console.error('SA Postal suburb lookup error:', error);
      throw error;
    }
  }
}
*/

// ============================================================================
// GEOCODING SERVICE (MAPBOX/OPENSTREETMAP)
// ============================================================================

/*
// Geocoding Service using MapBox
class GeocodingService {
  private apiKey: string;
  private baseUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Convert address to coordinates
  async geocodeAddress(address: string): Promise<LocationCoordinates | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${encodeURIComponent(address)}.json?country=ZA&access_token=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`MapBox API error: ${response.status}`);
      }

      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        return { lat, lng };
      }
      
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  }

  // Convert coordinates to address
  async reverseGeocode(coordinates: LocationCoordinates) {
    try {
      const response = await fetch(
        `${this.baseUrl}/${coordinates.lng},${coordinates.lat}.json?access_token=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`MapBox API error: ${response.status}`);
      }

      const data = await response.json();
      if (data.features && data.features.length > 0) {
        return data.features[0].place_name;
      }
      
      return null;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw error;
    }
  }

  // Calculate distance between two points
  calculateDistance(point1: LocationCoordinates, point2: LocationCoordinates): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}
*/

// ============================================================================
// MAIN LOCATION SERVICE CLASS
// ============================================================================

/*
// Main Location Service that combines all APIs
export class LocationService {
  private config: LocationServiceConfig;
  private googlePlacesService?: GooglePlacesService;
  private saPostalService?: SAPostalService;
  private geocodingService?: GeocodingService;

  constructor(config: LocationServiceConfig) {
    this.config = config;
    
    if (config.enableGooglePlaces && config.googlePlacesApiKey) {
      this.googlePlacesService = new GooglePlacesService(config.googlePlacesApiKey);
    }
    
    if (config.enableSouthAfricanPostal) {
      this.saPostalService = new SAPostalService();
    }
    
    if (config.enableMapbox && config.mapboxApiKey) {
      this.geocodingService = new GeocodingService(config.mapboxApiKey);
    }
  }

  // Search for addresses with autocomplete
  async searchAddresses(query: string): Promise<any[]> {
    const results = [];
    
    if (this.googlePlacesService) {
      try {
        const googleResults = await this.googlePlacesService.autocompleteAddress(query);
        results.push(...googleResults.map(place => ({
          source: 'google',
          place_id: place.place_id,
          formatted_address: place.formatted_address,
          address_components: this.googlePlacesService!.extractAddressComponents(place)
        })));
      } catch (error) {
        console.error('Google Places search failed:', error);
      }
    }
    
    return results;
  }

  // Get detailed address information
  async getAddressDetails(placeId: string): Promise<any> {
    if (this.googlePlacesService) {
      try {
        const place = await this.googlePlacesService.getPlaceDetails(placeId);
        if (place) {
          return this.googlePlacesService.extractAddressComponents(place);
        }
      } catch (error) {
        console.error('Google Places details failed:', error);
      }
    }
    
    return null;
  }

  // Validate postal code
  async validatePostalCode(postalCode: string): Promise<boolean> {
    if (this.saPostalService) {
      return await this.saPostalService.validatePostalCode(postalCode);
    }
    
    // Fallback validation (basic format check)
    return /^\d{4}$/.test(postalCode);
  }

  // Get address from postal code
  async getAddressFromPostalCode(postalCode: string): Promise<any> {
    if (this.saPostalService) {
      return await this.saPostalService.getAddressFromPostalCode(postalCode);
    }
    
    return null;
  }

  // Geocode address to coordinates
  async geocodeAddress(address: string): Promise<LocationCoordinates | null> {
    if (this.geocodingService) {
      return await this.geocodingService.geocodeAddress(address);
    }
    
    return null;
  }

  // Calculate service area coverage
  async calculateServiceArea(
    providerLocation: LocationCoordinates, 
    serviceRadius: number
  ): Promise<any> {
    // This would calculate the service area polygon
    // For now, return a simple circle approximation
    return {
      center: providerLocation,
      radius: serviceRadius,
      type: 'circle'
    };
  }
}
*/

// ============================================================================
// CONFIGURATION AND INITIALIZATION
// ============================================================================

/*
// Environment variables for API keys
const LOCATION_SERVICE_CONFIG: LocationServiceConfig = {
  googlePlacesApiKey: import.meta.env.VITE_GOOGLE_PLACES_API_KEY,
  mapboxApiKey: import.meta.env.VITE_MAPBOX_API_KEY,
  enableGooglePlaces: true,
  enableMapbox: true,
  enableSouthAfricanPostal: true
};

// Initialize location service
export const locationService = new LocationService(LOCATION_SERVICE_CONFIG);
*/

// ============================================================================
// REACT HOOKS FOR LOCATION FUNCTIONALITY
// ============================================================================

/*
// Custom hook for address search
export const useAddressSearch = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchAddresses = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await locationService.searchAddresses(query);
      setSearchResults(results);
    } catch (err) {
      setError('Failed to search addresses');
      console.error('Address search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    searchResults,
    loading,
    error,
    searchAddresses
  };
};

// Custom hook for postal code validation
export const usePostalCodeValidation = () => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [addressData, setAddressData] = useState<any>(null);

  const validatePostalCode = async (postalCode: string) => {
    setLoading(true);
    setIsValid(null);

    try {
      const valid = await locationService.validatePostalCode(postalCode);
      setIsValid(valid);

      if (valid) {
        const address = await locationService.getAddressFromPostalCode(postalCode);
        setAddressData(address);
      }
    } catch (err) {
      setIsValid(false);
      console.error('Postal code validation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    isValid,
    loading,
    addressData,
    validatePostalCode
  };
};
*/

// ============================================================================
// UTILITY FUNCTIONS (Always available)
// ============================================================================

// South African provinces and cities (static data)
export const SOUTH_AFRICAN_LOCATIONS = {
  provinces: [
    'Gauteng',
    'Western Cape',
    'KwaZulu-Natal',
    'Eastern Cape',
    'Free State',
    'Mpumalanga',
    'Limpopo',
    'North West',
    'Northern Cape'
  ],
  cities: {
    'Gauteng': ['Johannesburg', 'Pretoria', 'Centurion', 'Sandton', 'Randburg', 'Roodepoort', 'Krugersdorp', 'Boksburg', 'Benoni', 'Alberton'],
    'Western Cape': ['Cape Town', 'Bellville', 'Stellenbosch', 'Paarl', 'Worcester', 'George', 'Mossel Bay', 'Knysna', 'Oudtshoorn'],
    'KwaZulu-Natal': ['Durban', 'Pietermaritzburg', 'Ballito', 'Umhlanga', 'Westville', 'Pinetown', 'Hillcrest', 'Newcastle'],
    'Eastern Cape': ['Port Elizabeth', 'East London', 'Mthatha', 'Grahamstown', 'Queenstown', 'Uitenhage'],
    'Free State': ['Bloemfontein', 'Welkom', 'Kroonstad', 'Bethlehem', 'Sasolburg', 'Virginia'],
    'Mpumalanga': ['Nelspruit', 'Witbank', 'Secunda', 'Middelburg', 'Standerton', 'Bethal'],
    'Limpopo': ['Polokwane', 'Tzaneen', 'Phalaborwa', 'Louis Trichardt', 'Thohoyandou', 'Mokopane'],
    'North West': ['Rustenburg', 'Klerksdorp', 'Potchefstroom', 'Mahikeng', 'Brits', 'Lichtenburg'],
    'Northern Cape': ['Kimberley', 'Upington', 'Springbok', 'De Aar', 'Kuruman', 'Colesberg']
  }
};

// Basic postal code validation (South African format)
export const validateSouthAfricanPostalCode = (postalCode: string): boolean => {
  return /^\d{4}$/.test(postalCode);
};

// Get cities for a province
export const getCitiesForProvince = (province: string): string[] => {
  return SOUTH_AFRICAN_LOCATIONS.cities[province as keyof typeof SOUTH_AFRICAN_LOCATIONS.cities] || [];
};

// Format address components
export const formatAddress = (components: {
  streetAddress?: string;
  suburb?: string;
  city?: string;
  province?: string;
  postalCode?: string;
}): string => {
  const parts = [
    components.streetAddress,
    components.suburb,
    components.city,
    components.province,
    components.postalCode
  ].filter(Boolean);
  
  return parts.join(', ');
};

// ============================================================================
// USAGE EXAMPLES (for future reference)
// ============================================================================

/*
// Example: How to use the location service in components
// 
// In LocationStep.tsx:
// import { useAddressSearch, usePostalCodeValidation } from '../utils/locationService';
// 
// const LocationStep = () => {
//   const { searchResults, loading, searchAddresses } = useAddressSearch();
//   const { isValid, validatePostalCode } = usePostalCodeValidation();
// 
//   const handleAddressSearch = (query: string) => {
//     searchAddresses(query);
//   };
// 
//   const handlePostalCodeChange = (postalCode: string) => {
//     validatePostalCode(postalCode);
//   };
// 
//   // Example JSX structure (commented out to avoid TypeScript parsing issues):
//   // return (
//   //   <div>
//   //     <input 
//   //       type="text" 
//   //       placeholder="Search for address..."
//   //       onChange={(e) => handleAddressSearch(e.target.value)}
//   //     />
//   //     {loading && <div>Searching...</div>}
//   //     {searchResults.map(result => (
//   //       <div key={result.place_id} onClick={() => selectAddress(result)}>
//   //         {result.formatted_address}
//   //       </div>
//   //     ))}
//   //     <input 
//   //       type="text" 
//   //       placeholder="Postal Code"
//   //       onChange={(e) => handlePostalCodeChange(e.target.value)}
//   //     />
//   //     {isValid !== null && (
//   //       <div className={isValid ? 'text-green-600' : 'text-red-600'}>
//   //         {isValid ? 'Valid postal code' : 'Invalid postal code'}
//   //       </div>
//   //     )}
//   //   </div>
//   // );
// };
*/

// ============================================================================
// ENVIRONMENT VARIABLES TEMPLATE
// ============================================================================

/*
// Add these to your .env file when ready to use APIs:

# Google Places API
VITE_GOOGLE_PLACES_API_KEY=your_google_places_api_key_here

# MapBox API (for geocoding)
VITE_MAPBOX_API_KEY=your_mapbox_api_key_here

# South African Postal Service API (if available)
VITE_SA_POSTAL_API_KEY=your_sa_postal_api_key_here
*/

export default {
  SOUTH_AFRICAN_LOCATIONS,
  validateSouthAfricanPostalCode,
  getCitiesForProvince,
  formatAddress
}; 