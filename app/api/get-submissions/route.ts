import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const session = cookieStore.get('admin-session');

    if (!session || session.value !== 'authenticated') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const submissions = await prisma.submission.findMany({
      orderBy: {
        submittedAt: 'desc', // Newest first
      },
    });

    // Transform data to match the expected format
    const transformedSubmissions = submissions.map((submission) => ({
      id: submission.id,
      carName: submission.carName,
      carColor: submission.carColor,
      carPhoto: submission.carPhoto ? JSON.parse(submission.carPhoto) : null,
      customBase: submission.customBase ? 'yes' : 'no',
      acrylicCase: submission.acrylicCase ? 'yes' : 'no',
      name: submission.name,
      phone: submission.phone,
      email: submission.email,
      submittedAt: submission.submittedAt.toISOString(),
    }));
    
    return NextResponse.json(transformedSubmissions);
  } catch (error) {
    console.error('Error reading submissions:', error);
    return NextResponse.json(
      { error: 'Failed to read submissions' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
