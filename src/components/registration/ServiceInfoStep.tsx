import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { X, Plus } from 'lucide-react';

interface ServiceInfoStepProps {
  formData: any;
  errors: any;
  onFieldChange: (field: string, value: any) => void;
  onError: (field: string, error: string) => void;
}

export const ServiceInfoStep: React.FC<ServiceInfoStepProps> = ({
  formData,
  errors,
  onFieldChange,
  onError
}) => {
  const serviceCategories = [
    'Plumbing',
    'Electrical',
    'Cleaning',
    'Gardening',
    'Painting',
    'Carpentry',
    'HVAC',
    'Security',
    'Moving',
    'Pet Care',
    'Child Care',
    'Elder Care',
    'Tutoring',
    'Photography',
    'Event Planning',
    'Catering',
    'Beauty',
    'Fitness',
    'Technology',
    'Other'
  ];

  const addSkill = () => {
    const newSkill = prompt('Enter a skill:');
    if (newSkill && newSkill.trim()) {
      const currentSkills = formData.skills || [];
      if (!currentSkills.includes(newSkill.trim())) {
        onFieldChange('skills', [...currentSkills, newSkill.trim()]);
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const currentSkills = formData.skills || [];
    onFieldChange('skills', currentSkills.filter((skill: string) => skill !== skillToRemove));
  };

  const addCertification = () => {
    const newCert = prompt('Enter certification name:');
    if (newCert && newCert.trim()) {
      const currentCerts = formData.certifications || [];
      if (!currentCerts.includes(newCert.trim())) {
        onFieldChange('certifications', [...currentCerts, newCert.trim()]);
      }
    }
  };

  const removeCertification = (certToRemove: string) => {
    const currentCerts = formData.certifications || [];
    onFieldChange('certifications', currentCerts.filter((cert: string) => cert !== certToRemove));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Service Information</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Tell us about the services you provide and your experience.
        </p>
      </div>

      {/* Primary Service */}
      <div className="space-y-2">
        <Label htmlFor="primaryService">Primary Service *</Label>
        <Select
          value={formData.primaryService || ''}
          onValueChange={(value) => onFieldChange('primaryService', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your primary service" />
          </SelectTrigger>
          <SelectContent>
            {serviceCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Custom Service Input */}
        <div className="mt-2">
          <Label htmlFor="customService" className="text-sm text-muted-foreground">
            Can't find your service? Add a custom service:
          </Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="customService"
              placeholder="Enter your custom service"
              value={formData.customServiceInput || ''}
              onChange={(e) => onFieldChange('customServiceInput', e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (formData.customServiceInput && formData.customServiceInput.trim()) {
                  onFieldChange('primaryService', formData.customServiceInput.trim());
                  onFieldChange('customServiceInput', '');
                }
              }}
              disabled={!formData.customServiceInput || !formData.customServiceInput.trim()}
            >
              Add
            </Button>
          </div>
        </div>
        
        {errors.primaryService && (
          <p className="text-sm text-red-500">{errors.primaryService}</p>
        )}
      </div>

      {/* Service Description */}
      <div className="space-y-2">
        <Label htmlFor="serviceDescription">Service Description *</Label>
        <Textarea
          id="serviceDescription"
          placeholder="Describe your services in detail (minimum 50 characters)"
          value={formData.serviceDescription || ''}
          onChange={(e) => onFieldChange('serviceDescription', e.target.value)}
          rows={4}
        />
        <p className="text-xs text-muted-foreground">
          {formData.serviceDescription?.length || 0}/200 characters
        </p>
        {errors.serviceDescription && (
          <p className="text-sm text-red-500">{errors.serviceDescription}</p>
        )}
      </div>

      {/* Skills */}
      <div className="space-y-2">
        <Label>Skills & Expertise</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {(formData.skills || []).map((skill: string) => (
            <Badge key={skill} variant="secondary" className="flex items-center gap-1">
              {skill}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeSkill(skill)}
              />
            </Badge>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addSkill}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Skill
        </Button>
      </div>

      {/* Certifications */}
      <div className="space-y-2">
        <Label>Certifications & Qualifications</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {(formData.certifications || []).map((cert: string) => (
            <Badge key={cert} variant="secondary" className="flex items-center gap-1">
              {cert}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeCertification(cert)}
              />
            </Badge>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addCertification}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Certification
        </Button>
      </div>

      {/* Experience Years */}
      <div className="space-y-2">
        <Label htmlFor="experienceYears">Years of Experience *</Label>
        <Input
          id="experienceYears"
          type="number"
          min="0"
          max="50"
          placeholder="Enter years of experience"
          value={formData.experienceYears || ''}
          onChange={(e) => onFieldChange('experienceYears', e.target.value)}
        />
        {errors.experienceYears && (
          <p className="text-sm text-red-500">{errors.experienceYears}</p>
        )}
      </div>
    </div>
  );
}; 