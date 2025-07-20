'use client';

import { useState, useRef } from 'react';
import { FormData } from './LandingPage';
import { validateCarDetails } from '../lib/validation';

interface CarDetailsFormProps {
  formData: Partial<FormData>;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
}

export default function CarDetailsForm({ formData, updateFormData, onNext }: CarDetailsFormProps) {
  const [inputMethod, setInputMethod] = useState<'manual' | 'photo'>('manual');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputMethodChange = (method: 'manual' | 'photo') => {
    setInputMethod(method);
    setTouched(prev => ({ ...prev, inputMethod: true }));
    
    // Clear the other method's data when switching
    if (method === 'manual') {
      updateFormData({ carPhoto: undefined });
      setErrors(prev => ({ ...prev, carPhoto: '', carDetails: '' }));
    } else {
      updateFormData({ carName: '', carColor: '' });
      setErrors(prev => ({ ...prev, carName: '', carColor: '', carDetails: '' }));
      setTouched(prev => ({ ...prev, carName: false, carColor: false }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleInputChange('carPhoto', file);
    }
  };

  const handleCustomBaseChange = (checked: boolean) => {
    updateFormData({ customBase: checked });
  };

  const handleAcrylicCaseChange = (checked: boolean) => {
    updateFormData({ acrylicCase: checked });
  };

  const validateForm = () => {
    const validation = validateCarDetails(formData);
    if (!validation.success) {
      const errorMessages: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path.length > 0) {
          errorMessages[issue.path[0].toString()] = issue.message;
        } else {
          errorMessages['carDetails'] = issue.message;
        }
      });
      return { isValid: false, errors: errorMessages };
    }
    return { isValid: true, errors: {} };
  };

  const isFormValid = () => {
    const { isValid } = validateForm();
    return isValid;
  };

  const validateCarField = (field: 'carName' | 'carColor' | 'carPhoto', value: string | File | undefined) => {
    if (field === 'carPhoto') {
      if (inputMethod === 'photo' && !value) {
        return 'Please upload a photo of your car';
      }
      if (value && value instanceof File) {
        if (value.size > 10 * 1024 * 1024) { // 10MB limit
          return 'File size must be less than 10MB';
        }
        if (!value.type.startsWith('image/')) {
          return 'File must be an image';
        }
      }
      return null;
    }
    
    const stringValue = value as string;
    if (!stringValue || stringValue.trim() === '') {
      return `Car ${field === 'carName' ? 'name' : 'color'} is required`;
    }
    if (stringValue.length < 2) {
      return `Car ${field === 'carName' ? 'name' : 'color'} must be at least 2 characters`;
    }
    if (stringValue.length > 50) {
      return `Car ${field === 'carName' ? 'name' : 'color'} must be less than 50 characters`;
    }
    return null;
  };

  const handleInputChange = (field: 'carName' | 'carColor' | 'carPhoto', value: string | File | null) => {
    updateFormData({ [field]: value });
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Real-time validation for individual fields
    const error = validateCarField(field, value as string | File | undefined);
    setErrors(prev => ({ 
      ...prev, 
      [field]: error || '',
      // Clear general error when user starts typing
      carDetails: ''
    }));
  };

  const handleBlur = (field: 'carName' | 'carColor' | 'carPhoto') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    let value: string | File | undefined;
    if (field === 'carPhoto') {
      value = formData.carPhoto;
    } else {
      value = formData[field] || '';
    }
    const error = validateCarField(field, value);
    setErrors(prev => ({ 
      ...prev, 
      [field]: error || ''
    }));
  };

  const handleNext = () => {
    // Mark form as touched when user tries to submit
    setTouched({
      inputMethod: true,
      carName: true,
      carColor: true,
      carPhoto: true,
    });
    
    const { isValid, errors: validationErrors } = validateForm();
    setErrors(validationErrors);
    
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-8">Car Details</h1>
      
      {/* Accordion Style Input Method Selection */}
      <div className="space-y-4">
        {errors.carDetails && touched.inputMethod && (
          <div className="bg-red-900 border border-red-500 text-red-200 px-4 py-3 rounded animate-in fade-in-0 slide-in-from-top-2 duration-300">
            <div className="flex items-center">
              <span className="mr-2">⚠️</span>
              {errors.carDetails}
            </div>
          </div>
        )}
        
        {/* Manual Input Accordion */}
        <div className={`border border-white rounded transition-all duration-300 ${
          inputMethod === 'manual' ? 'border-white shadow-lg' : 'border-gray-500'
        }`}>
          <button
            type="button"
            onClick={() => handleInputMethodChange('manual')}
            className={`w-full p-4 text-left flex items-center justify-between transition-all duration-300 ${
              inputMethod === 'manual' ? 'bg-white text-black' : 'bg-black text-white hover:bg-gray-900'
            }`}
          >
            <span>Enter your car&apos;s name and color</span>
            <span className={`transform transition-transform duration-300 ease-in-out ${
              inputMethod === 'manual' ? 'rotate-180' : ''
            }`}>
              ▼
            </span>
          </button>
          
          {inputMethod === 'manual' && (
            <div className="overflow-hidden transition-all duration-300 ease-in-out">
              <div className="p-4 border-t border-white space-y-4 animate-in fade-in-0 slide-in-from-top-2 duration-300">
                <div>
                  <input
                    type="text"
                    placeholder="Enter your car&apos;s name"
                    value={formData.carName || ''}
                    onChange={(e) => handleInputChange('carName', e.target.value)}
                    onBlur={() => handleBlur('carName')}
                    className={`w-full p-3 bg-black border text-white placeholder-gray-400 rounded focus:outline-none transition-all duration-200 ${
                      touched.carName && errors.carName 
                        ? 'border-red-500 focus:border-red-400' 
                        : touched.carName && !errors.carName && formData.carName
                        ? 'border-green-500 focus:border-green-400'
                        : 'border-white focus:border-gray-400'
                    }`}
                  />
                  {touched.carName && errors.carName && (
                    <p className="text-red-400 text-sm mt-1 animate-in fade-in-0 slide-in-from-top-1 duration-200">
                      <span className="mr-1">❌</span>{errors.carName}
                    </p>
                  )}
                  {touched.carName && !errors.carName && formData.carName && (
                    <p className="text-green-400 text-sm mt-1 animate-in fade-in-0 slide-in-from-top-1 duration-200">
                      <span className="mr-1">✅</span>Car name looks good!
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Enter your car&apos;s color"
                    value={formData.carColor || ''}
                    onChange={(e) => handleInputChange('carColor', e.target.value)}
                    onBlur={() => handleBlur('carColor')}
                    className={`w-full p-3 bg-black border text-white placeholder-gray-400 rounded focus:outline-none transition-all duration-200 ${
                      touched.carColor && errors.carColor 
                        ? 'border-red-500 focus:border-red-400' 
                        : touched.carColor && !errors.carColor && formData.carColor
                        ? 'border-green-500 focus:border-green-400'
                        : 'border-white focus:border-gray-400'
                    }`}
                  />
                  {touched.carColor && errors.carColor && (
                    <p className="text-red-400 text-sm mt-1 animate-in fade-in-0 slide-in-from-top-1 duration-200">
                      <span className="mr-1">❌</span>{errors.carColor}
                    </p>
                  )}
                  {touched.carColor && !errors.carColor && formData.carColor && (
                    <p className="text-green-400 text-sm mt-1 animate-in fade-in-0 slide-in-from-top-1 duration-200">
                      <span className="mr-1">✅</span>Car color looks good!
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Photo Upload Accordion */}
        <div className={`border border-white rounded transition-all duration-300 ${
          inputMethod === 'photo' ? 'border-white shadow-lg' : 'border-gray-500'
        }`}>
          <button
            type="button"
            onClick={() => handleInputMethodChange('photo')}
            className={`w-full p-4 text-left flex items-center justify-between transition-all duration-300 ${
              inputMethod === 'photo' ? 'bg-white text-black' : 'bg-black text-white hover:bg-gray-900'
            }`}
          >
            <span>Upload a photo of your car</span>
            <span className={`transform transition-transform duration-300 ease-in-out ${
              inputMethod === 'photo' ? 'rotate-180' : ''
            }`}>
              ▼
            </span>
          </button>
          
          {inputMethod === 'photo' && (
            <div className="overflow-hidden transition-all duration-300 ease-in-out">
              <div className="p-4 border-t border-white animate-in fade-in-0 slide-in-from-top-2 duration-300 space-y-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full p-4 border-2 border-dashed text-white rounded transition-all duration-200 hover:bg-gray-900 ${
                    touched.carPhoto && errors.carPhoto 
                      ? 'border-red-500 bg-red-50/5' 
                      : touched.carPhoto && !errors.carPhoto && formData.carPhoto
                      ? 'border-green-500 bg-green-50/5'
                      : 'border-white hover:border-gray-400'
                  }`}
                >
                  {formData.carPhoto ? (
                    <div>
                      <span className="text-green-400 mr-2">✅</span>
                      {formData.carPhoto.name}
                    </div>
                  ) : (
                    'Click to upload photo'
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  onBlur={() => handleBlur('carPhoto')}
                  className="hidden"
                />
                {touched.carPhoto && errors.carPhoto && (
                  <p className="text-red-400 text-sm animate-in fade-in-0 slide-in-from-top-1 duration-200">
                    <span className="mr-1">❌</span>{errors.carPhoto}
                  </p>
                )}
                {touched.carPhoto && !errors.carPhoto && formData.carPhoto && (
                  <p className="text-green-400 text-sm animate-in fade-in-0 slide-in-from-top-1 duration-200">
                    <span className="mr-1">✅</span>Photo uploaded successfully!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
        <div className="border border-gray-600 rounded p-4 transition-all duration-200 hover:border-gray-400">
          <p className="text-white mb-3 font-medium">Would you like a custom base?</p>
          <div className="flex space-x-6">
            <label className="flex items-center space-x-2 cursor-pointer transition-all duration-200 hover:scale-105">
              <input
                type="checkbox"
                checked={formData.customBase}
                onChange={(e) => handleCustomBaseChange(e.target.checked)}
                className="w-4 h-4 transition-all duration-200"
              />
              <span className="text-white">Yes</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer transition-all duration-200 hover:scale-105">
              <input
                type="checkbox"
                checked={!formData.customBase}
                onChange={(e) => handleCustomBaseChange(!e.target.checked)}
                className="w-4 h-4 transition-all duration-200"
              />
              <span className="text-white">No</span>
            </label>
          </div>
        </div>

        <div className="border border-gray-600 rounded p-4 transition-all duration-200 hover:border-gray-400">
          <p className="text-white mb-3 font-medium">Would you like an acrylic display case?</p>
          <div className="flex space-x-6">
            <label className="flex items-center space-x-2 cursor-pointer transition-all duration-200 hover:scale-105">
              <input
                type="checkbox"
                checked={formData.acrylicCase}
                onChange={(e) => handleAcrylicCaseChange(e.target.checked)}
                className="w-4 h-4 transition-all duration-200"
              />
              <span className="text-white">Yes</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer transition-all duration-200 hover:scale-105">
              <input
                type="checkbox"
                checked={!formData.acrylicCase}
                onChange={(e) => handleAcrylicCaseChange(!e.target.checked)}
                className="w-4 h-4 transition-all duration-200"
              />
              <span className="text-white">No</span>
            </label>
          </div>
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={!isFormValid()}
        className={`w-full py-3 px-6 rounded font-medium transition-all duration-300 transform hover:scale-105 ${
          isFormValid()
            ? 'bg-white text-black hover:bg-gray-200 hover:shadow-lg'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}
      >
        Next →
      </button>
    </div>
  );
}
