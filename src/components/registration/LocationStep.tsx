import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { X, Plus, MapPin } from 'lucide-react';
import { SOUTH_AFRICAN_LOCATIONS, getCitiesForProvince, validateSouthAfricanPostalCode } from '../../utils/locationService';

interface LocationStepProps {
  formData: any;
  errors: any;
  onFieldChange: (field: string, value: any) => void;
  onError: (field: string, error: string) => void;
}

export const LocationStep: React.FC<LocationStepProps> = ({
  formData,
  errors,
  onFieldChange,
  onError
}) => {
  const provinces = SOUTH_AFRICAN_LOCATIONS.provinces;
  const cities = SOUTH_AFRICAN_LOCATIONS.cities;

  const addServiceArea = () => {
    const newArea = prompt('Enter service area (city/suburb):');
    if (newArea && newArea.trim()) {
      const currentAreas = formData.serviceAreas || [];
      if (!currentAreas.includes(newArea.trim())) {
        onFieldChange('serviceAreas', [...currentAreas, newArea.trim()]);
      }
    }
  };

  const removeServiceArea = (areaToRemove: string) => {
    const currentAreas = formData.serviceAreas || [];
    onFieldChange('serviceAreas', currentAreas.filter((area: string) => area !== areaToRemove));
  };

  const handleProvinceChange = (province: string) => {
    onFieldChange('province', province);
    onFieldChange('city', ''); // Reset city when province changes
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Location & Service Areas</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Tell us where you're located and which areas you serve.
        </p>
      </div>

      {/* Address Information */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Street Address */}
          <div className="space-y-2">
            <Label htmlFor="streetAddress">Street Address *</Label>
            <Input
              id="streetAddress"
              placeholder="Enter your street address"
              value={formData.streetAddress || ''}
              onChange={(e) => onFieldChange('streetAddress', e.target.value)}
            />
            {errors.streetAddress && (
              <p className="text-sm text-red-500">{errors.streetAddress}</p>
            )}
          </div>

          {/* Suburb */}
          <div className="space-y-2">
            <Label htmlFor="suburb">Suburb *</Label>
            <Input
              id="suburb"
              placeholder="Enter your suburb"
              value={formData.suburb || ''}
              onChange={(e) => onFieldChange('suburb', e.target.value)}
            />
            {errors.suburb && (
              <p className="text-sm text-red-500">{errors.suburb}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Province */}
          <div className="space-y-2">
            <Label htmlFor="province">Province *</Label>
            <Select
              value={formData.province || ''}
              onValueChange={handleProvinceChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg">
                {provinces.map((province) => (
                  <SelectItem key={province} value={province} className="text-gray-900 hover:bg-gray-100">
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.province && (
              <p className="text-sm text-red-500">{errors.province}</p>
            )}
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Select
              value={formData.city || ''}
              onValueChange={(value) => onFieldChange('city', value)}
              disabled={!formData.province}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg">
                {formData.province && getCitiesForProvince(formData.province)?.map((city) => (
                  <SelectItem key={city} value={city} className="text-gray-900 hover:bg-gray-100">
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.city && (
              <p className="text-sm text-red-500">{errors.city}</p>
            )}
          </div>

          {/* Postal Code */}
          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal Code *</Label>
            <Input
              id="postalCode"
              placeholder="Enter postal code"
              value={formData.postalCode || ''}
              onChange={(e) => {
                const postalCode = e.target.value;
                onFieldChange('postalCode', postalCode);
                
                // Basic validation
                if (postalCode && !validateSouthAfricanPostalCode(postalCode)) {
                  onError('postalCode', 'Please enter a valid 4-digit postal code');
                } else if (postalCode) {
                  onError('postalCode', ''); // Clear error
                }
              }}
            />
            {errors.postalCode && (
              <p className="text-sm text-red-500">{errors.postalCode}</p>
            )}
          </div>
        </div>
      </div>

      {/* Service Radius */}
      <div className="space-y-2">
        <Label htmlFor="serviceRadius">Service Radius (km) *</Label>
        <Input
          id="serviceRadius"
          type="number"
          min="1"
          max="100"
          placeholder="Enter service radius in kilometers"
          value={formData.serviceRadius || ''}
          onChange={(e) => onFieldChange('serviceRadius', e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          How far are you willing to travel for jobs?
        </p>
        {errors.serviceRadius && (
          <p className="text-sm text-red-500">{errors.serviceRadius}</p>
        )}
      </div>

      {/* Service Areas */}
      <div className="space-y-2">
        <Label>Specific Service Areas</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {(formData.serviceAreas || []).map((area: string) => (
            <Badge key={area} variant="secondary" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {area}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeServiceArea(area)}
              />
            </Badge>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addServiceArea}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Service Area
        </Button>
        <p className="text-xs text-muted-foreground">
          Add specific cities or suburbs where you provide services
        </p>
      </div>

      {/* Travel Preferences */}
      <div className="space-y-2">
        <Label>Travel Preferences</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="willingToTravel"
              checked={formData.willingToTravel || false}
              onChange={(e) => onFieldChange('willingToTravel', e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="willingToTravel" className="text-sm">
              I'm willing to travel outside my immediate area for the right jobs
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="emergencyService"
              checked={formData.emergencyService || false}
              onChange={(e) => onFieldChange('emergencyService', e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="emergencyService" className="text-sm">
              I provide emergency/after-hours services
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}; 