/*
 * Copyright (c) 2025 Trifecta Collections. All rights reserved.
 * 
 * This software is proprietary and confidential. Unauthorized copying, 
 * distribution, or use is strictly prohibited.
 */

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
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
  // Handle file upload if present - store as base64 for serverless compatibility
  let carPhotoData = null;
  if (data.carPhoto && data.carPhoto.size > 0) {
    try {
      // Convert File to base64 for database storage
      const bytes = await data.carPhoto.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      
      // Store photo metadata and base64 data as JSON
      carPhotoData = JSON.stringify({
        name: data.carPhoto.name,
        size: data.carPhoto.size,
        type: data.carPhoto.type,
        data: base64, // Store base64 data instead of file path
      });
      
      console.log(`Image stored as base64 data (${data.carPhoto.size} bytes)`);
    } catch (error) {
      console.error('Error processing image file:', error);
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
    ${data.carPhoto ? `- Photo uploaded: ${data.carPhoto.name} (${(data.carPhoto.size / 1024).toFixed(1)} KB)` : ''}
    
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
