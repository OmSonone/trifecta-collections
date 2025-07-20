import { z } from 'zod';

// Car details validation schema
export const carDetailsSchema = z.object({
  // Either manual entry or photo upload is required
  carName: z.string().optional(),
  carColor: z.string().optional(),
  carPhoto: z.instanceof(File).optional(),
  customBase: z.boolean(),
  acrylicCase: z.boolean(),
}).refine(
  (data) => {
    // Either both name and color are provided, or a photo is provided
    const hasManualData = data.carName && data.carColor && data.carName.trim() !== '' && data.carColor.trim() !== '';
    const hasPhoto = data.carPhoto;
    return hasManualData || hasPhoto;
  },
  {
    message: "Either provide car name and color, or upload a photo",
    path: ["carDetails"],
  }
);

// Contact information validation schema
export const contactSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[\+]?[\d\s\-\(\)]+$/, "Please enter a valid phone number"),
  
  email: z.string()
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must be less than 100 characters"),
});

// Complete form validation schema
export const completeFormSchema = carDetailsSchema.merge(contactSchema);

// Type inference from schemas
export type CarDetailsData = z.infer<typeof carDetailsSchema>;
export type ContactData = z.infer<typeof contactSchema>;
export type CompleteFormData = z.infer<typeof completeFormSchema>;

// Validation helper functions
export const validateCarDetails = (data: unknown) => {
  return carDetailsSchema.safeParse(data);
};

export const validateContact = (data: unknown) => {
  return contactSchema.safeParse(data);
};

export const validateCompleteForm = (data: unknown) => {
  return completeFormSchema.safeParse(data);
};
