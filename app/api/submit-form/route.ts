/*
 * Copyright (c) 2025 Trifecta Collections. All rights reserved.
 * 
 * This software is proprietary and confidential. Unauthorized copying, 
 * distribution, or use is strictly prohibited.
 */

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { validateCompleteForm } from '../../lib/validation';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SubmissionData {
  carName?: string;
  carColor?: string;
  carPhoto?: File;
  customBase: string;
  acrylicCase: string;
  name: string;
  phone: string;
  email: string;
  submittedAt: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const data: SubmissionData = {
      carName: formData.get('carName') as string,
      carColor: formData.get('carColor') as string,
      carPhoto: formData.get('carPhoto') as File,
      customBase: formData.get('customBase') as string,
      acrylicCase: formData.get('acrylicCase') as string,
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      submittedAt: new Date().toISOString(),
    };

    // Validate the data
    const validation = validateCompleteForm({
      carName: data.carName || undefined,
      carColor: data.carColor || undefined,
      carPhoto: data.carPhoto || undefined,
      customBase: data.customBase === 'yes',
      acrylicCase: data.acrylicCase === 'yes',
      name: data.name,
      phone: data.phone,
      email: data.email,
    });

    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validation.error.issues 
        },
        { status: 400 }
      );
    }

    // Save to database
    await saveToDatabase(data);

    // Send email notification
    await sendEmailNotification(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing form submission:', error);
    return NextResponse.json(
      { error: 'Failed to process form submission' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

async function saveToDatabase(data: SubmissionData) {
  // Handle file upload if present
  let carPhotoData = null;
  if (data.carPhoto && data.carPhoto.size > 0) {
    try {
      // Create unique filename with timestamp
      const timestamp = Date.now();
      const fileExtension = data.carPhoto.name.split('.').pop();
      const fileName = `car_${timestamp}.${fileExtension}`;
      const uploadPath = path.join(process.cwd(), 'public', 'uploads', fileName);
      
      // Convert File to buffer and save
      const bytes = await data.carPhoto.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Ensure uploads directory exists
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      fs.writeFileSync(uploadPath, buffer);
      const carPhotoPath = `/uploads/${fileName}`;
      
      // Store photo metadata as JSON
      carPhotoData = JSON.stringify({
        name: data.carPhoto.name,
        size: data.carPhoto.size,
        type: data.carPhoto.type,
        path: carPhotoPath,
      });
      
      console.log(`Image saved to: ${uploadPath}`);
    } catch (error) {
      console.error('Error saving image file:', error);
    }
  }

  // Save to database
  await prisma.submission.create({
    data: {
      carName: data.carName || null,
      carColor: data.carColor || null,
      carPhoto: carPhotoData,
      customBase: data.customBase === 'yes',
      acrylicCase: data.acrylicCase === 'yes',
      name: data.name,
      phone: data.phone,
      email: data.email,
    },
  });
}

async function sendEmailNotification(data: SubmissionData) {
  // Configure email settings using SMTP environment variables
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const emailContent = `
    New Car Collection Request
    
    Customer Information:
    - Name: ${data.name}
    - Phone: ${data.phone}
    - Email: ${data.email}
    
    Car Details:
    ${data.carName ? `- Car Name: ${data.carName}` : ''}
    ${data.carColor ? `- Car Color: ${data.carColor}` : ''}
    ${data.carPhoto ? `- Photo uploaded: ${data.carPhoto.name}` : ''}
    
    Options:
    - Custom Base: ${data.customBase}
    - Acrylic Display Case: ${data.acrylicCase}
    
    Submitted at: ${data.submittedAt}
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER, // Send to same email for now
      subject: 'New Car Collection Request - Trifecta Collections',
      text: emailContent,
    });
    console.log('Email notification sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't throw error here so form submission still succeeds even if email fails
  }
}
