'use client';

import { useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './PhoneInput.css';
import { type FormData as FormDataType } from './LandingPage';
import { validateContact, contactSchema } from '../lib/validation';

interface ContactFormProps {
  formData: Partial<FormDataType>;
  updateFormData: (data: Partial<FormDataType>) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export default function ContactForm({ formData, updateFormData, onSubmit, onBack }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched when user tries to submit
    setTouched({
      name: true,
      phone: true,
      email: true,
    });
    
    const { isValid, errors: validationErrors } = validateForm();
    setErrors(validationErrors);
    
    if (!isValid) return;
    
    setIsSubmitting(true);
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Add text fields
      if (formData.carName) submitData.append('carName', formData.carName);
      if (formData.carColor) submitData.append('carColor', formData.carColor);
      if (formData.carPhoto) submitData.append('carPhoto', formData.carPhoto);
      submitData.append('customBase', formData.customBase ? 'yes' : 'no');
      submitData.append('acrylicCase', formData.acrylicCase ? 'yes' : 'no');
      submitData.append('name', formData.name || '');
      submitData.append('phone', formData.phone || '');
      submitData.append('email', formData.email || '');
      
      // Submit to API
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        body: submitData,
      });
      
      if (response.ok) {
        onSubmit();
      } else {
        alert('There was an error submitting your form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    const validation = validateContact({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
    });
    
    if (!validation.success) {
      const errorMessages: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path.length > 0) {
          errorMessages[issue.path[0].toString()] = issue.message;
        }
      });
      return { isValid: false, errors: errorMessages };
    }
    
    return { isValid: true, errors: {} };
  };

  const validateField = (field: 'name' | 'phone' | 'email', value: string) => {
    const fieldSchema = {
      name: contactSchema.shape.name,
      phone: contactSchema.shape.phone,
      email: contactSchema.shape.email,
    }[field];

    const result = fieldSchema.safeParse(value);
    return result.success ? null : result.error.issues[0]?.message || 'Invalid input';
  };

  const handleInputChange = (field: 'name' | 'phone' | 'email', value: string) => {
    updateFormData({ [field]: value });
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Real-time validation
    const error = validateField(field, value);
    setErrors(prev => ({ 
      ...prev, 
      [field]: error || ''
    }));
  };

  const handlePhoneChange = (value: string | undefined) => {
    const phoneValue = value || '';
    updateFormData({ phone: phoneValue });
    setTouched(prev => ({ ...prev, phone: true }));
    
    // Real-time validation for phone field
    const error = validateField('phone', phoneValue);
    setErrors(prev => ({ 
      ...prev, 
      phone: error || ''
    }));
  };

  const handleBlur = (field: 'name' | 'phone' | 'email') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const value = formData[field] || '';
    const error = validateField(field, value);
    setErrors(prev => ({ 
      ...prev, 
      [field]: error || ''
    }));
  };

  const isFormValid = () => {
    const { isValid } = validateForm();
    return isValid;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-8">Contact Information</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Enter your name"
            value={formData.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            className={`w-full p-3 bg-black border text-white placeholder-gray-400 rounded focus:outline-none transition-all duration-200 ${
              touched.name && errors.name 
                ? 'border-red-500 focus:border-red-400' 
                : touched.name && !errors.name && formData.name
                ? 'border-green-500 focus:border-green-400'
                : 'border-white focus:border-gray-400'
            }`}
            required
          />
          {touched.name && errors.name && (
            <p className="text-red-400 text-sm mt-1 animate-in fade-in-0 slide-in-from-top-1 duration-200">
              <span className="mr-1">❌</span>{errors.name}
            </p>
          )}
          {touched.name && !errors.name && formData.name && (
            <p className="text-green-400 text-sm mt-1 animate-in fade-in-0 slide-in-from-top-1 duration-200">
              <span className="mr-1">✅</span>Looks good!
            </p>
          )}
        </div>
        
        <div>
          <PhoneInput
            placeholder="Enter your phone number"
            value={formData.phone || ''}
            onChange={handlePhoneChange}
            defaultCountry="US"
            className={`phone-input ${
              touched.phone && errors.phone 
                ? 'error' 
                : touched.phone && !errors.phone && formData.phone
                ? 'success'
                : ''
            }`}
          />
          {touched.phone && errors.phone && (
            <p className="text-red-400 text-sm mt-1 animate-in fade-in-0 slide-in-from-top-1 duration-200">
              <span className="mr-1">❌</span>{errors.phone}
            </p>
          )}
          {touched.phone && !errors.phone && formData.phone && (
            <p className="text-green-400 text-sm mt-1 animate-in fade-in-0 slide-in-from-top-1 duration-200">
              <span className="mr-1">✅</span>Valid phone number
            </p>
          )}
        </div>
        
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            value={formData.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            className={`w-full p-3 bg-black border text-white placeholder-gray-400 rounded focus:outline-none transition-all duration-200 ${
              touched.email && errors.email 
                ? 'border-red-500 focus:border-red-400' 
                : touched.email && !errors.email && formData.email
                ? 'border-green-500 focus:border-green-400'
                : 'border-white focus:border-gray-400'
            }`}
            required
          />
          {touched.email && errors.email && (
            <p className="text-red-400 text-sm mt-1 animate-in fade-in-0 slide-in-from-top-1 duration-200">
              <span className="mr-1">❌</span>{errors.email}
            </p>
          )}
          {touched.email && !errors.email && formData.email && (
            <p className="text-green-400 text-sm mt-1 animate-in fade-in-0 slide-in-from-top-1 duration-200">
              <span className="mr-1">✅</span>Valid email address
            </p>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center justify-center py-3 px-6 rounded font-medium border border-white text-white hover:bg-white hover:text-black transition-colors"
          >
            <span className="mr-2">←</span>
            Back
          </button>
          
          <button
            type="submit"
            disabled={!isFormValid() || isSubmitting}
            className={`flex-1 py-3 px-6 rounded font-medium transition-colors ${
              isFormValid() && !isSubmitting
                ? 'bg-white text-black hover:bg-gray-200'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}
