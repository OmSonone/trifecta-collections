/*
 * Copyright (c) 2025 Trifecta Collections. All rights reserved.
 * 
 * This software is proprietary and confidential. Unauthorized copying, 
 * distribution, or use is strictly prohibited.
 */

'use client';

import { useState } from 'react';
import CarDetailsForm from '@/app/components/CarDetailsForm';
import ContactForm from '@/app/components/ContactForm';
import ThankYouPage from '@/app/components/ThankYouPage';
import Logo from '@/app/components/Logo';

export interface FormData {
  // Car details
  carName?: string;
  carColor?: string;
  carPhoto?: File;
  customBase: boolean;
  acrylicCase: boolean;
  
  // Contact details
  name: string;
  phone: string;
  email: string;
}

export default function LandingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({
    customBase: false,
    acrylicCase: false,
  });

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CarDetailsForm
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <ContactForm
            formData={formData}
            updateFormData={updateFormData}
            onSubmit={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return <ThankYouPage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen">
        {/* Left Side - Logo */}
        <div className="w-1/2 flex items-center justify-center">
          <Logo />
        </div>
        
        {/* Right Side - Form */}
        <div className="w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
}
