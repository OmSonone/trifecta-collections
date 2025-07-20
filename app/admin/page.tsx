/*
 * Copyright (c) 2025 Trifecta Collections. All rights reserved.
 * 
 * This software is proprietary and confidential. Unauthorized copying, 
 * distribution, or use is strictly prohibited.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Submission {
  carName?: string;
  carColor?: string;
  carPhoto?: {
    name: string;
    size: number;
    type: string;
    path?: string; // Add path for the saved image
  } | null;
  customBase: string;
  acrylicCase: string;
  name: string;
  phone: string;
  email: string;
  submittedAt: string;
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth');
        const data = await response.json();
        
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/admin/login');
      } finally {
        setAuthLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/get-submissions');
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      } else {
        setError('Failed to load submissions');
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
      setError('Error loading submissions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Checking authentication...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading submissions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Form Submissions</h1>
          <div className="flex gap-4">
            <button
              onClick={fetchSubmissions}
              className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p className="text-xl">No submissions yet</p>
            <p className="mt-2">Submissions will appear here when customers fill out the form</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-gray-400 mb-4">
              Total submissions: {submissions.length}
            </div>
            
            {submissions.map((submission, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-white">Customer Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-400">Name:</span> {submission.name}</p>
                      <p><span className="text-gray-400">Phone:</span> {submission.phone}</p>
                      <p><span className="text-gray-400">Email:</span> {submission.email}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-white">Car Details</h3>
                    <div className="space-y-2 text-sm">
                      {submission.carName && (
                        <p><span className="text-gray-400">Car Name:</span> {submission.carName}</p>
                      )}
                      {submission.carColor && (
                        <p><span className="text-gray-400">Car Color:</span> {submission.carColor}</p>
                      )}
                      {submission.carPhoto && (
                        <div className="space-y-2">
                          <p><span className="text-gray-400">Photo:</span> {submission.carPhoto.name} ({(submission.carPhoto.size / 1024).toFixed(1)} KB)</p>
                          {submission.carPhoto.path && (
                            <div className="mt-2">
                              <Image 
                                src={submission.carPhoto.path} 
                                alt={`Car photo: ${submission.carPhoto.name}`}
                                width={300}
                                height={200}
                                className="max-w-xs max-h-48 rounded-lg border border-gray-600 object-cover cursor-pointer hover:border-gray-400 transition-all duration-200"
                                onClick={() => window.open(submission.carPhoto!.path!, '_blank')}
                                title="Click to view full size"
                              />
                            </div>
                          )}
                        </div>
                      )}
                      <p><span className="text-gray-400">Custom Base:</span> {submission.customBase}</p>
                      <p><span className="text-gray-400">Acrylic Case:</span> {submission.acrylicCase}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400">
                    Submitted: {formatDate(submission.submittedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
