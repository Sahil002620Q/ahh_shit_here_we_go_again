'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { listings, buyRequests } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function ListingDetail() {
  const router = useRouter();
  const params = useParams();
  const [listing, setListing] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchListing();
  }, [params.id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await listings.getOne(Number(params.id));
      setListing(response.data);
    } catch (error) {
      console.error('Error fetching listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyRequest = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    try {
      await buyRequests.create({ listing_id: listing.id });
      setMessage('✅ Buy request sent successfully! The seller will be notified.');
    } catch (error: any) {
      setMessage('❌ ' + (error.response?.data?.detail || 'Failed to send request'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-12 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="glass-effect rounded-3xl p-8 animate-pulse">
              <div className="h-96 bg-gray-200 rounded-2xl mb-6"></div>
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-4 w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-5xl">
          <button
            onClick={() => router.push('/')}
            className="mb-6 px-4 py-2 rounded-lg border-2 border-gray-300 hover:bg-gray-100 transition-all"
          >
            ← Back to Listings
          </button>

          <div className="glass-effect rounded-3xl p-8 animate-scale-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl h-96 flex items-center justify-center mb-6">
                  <span className="text-9xl">📦</span>
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {listing.category}
                  </span>
                </div>
                
                <h1 className="text-4xl font-bold mb-3">{listing.brand} {listing.model}</h1>
                
                <div className="mb-6">
                  <span className="text-5xl font-bold text-blue-600">${listing.price}</span>
                </div>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📍</span>
                    <span className="text-lg">{listing.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {listing.condition === 'broken' ? '❌' :
                       listing.condition === 'partially_working' ? '⚠️' :
                       listing.condition === 'for_parts' ? '🔧' : '✅'}
                    </span>
                    <span className="text-lg capitalize">{listing.condition.replace('_', ' ')}</span>
                  </div>
                  {listing.working_parts && (
                    <div className="p-4 bg-green-50 rounded-xl">
                      <p className="font-semibold mb-1">✅ Working Parts:</p>
                      <p className="text-gray-700">{listing.working_parts}</p>
                    </div>
                  )}
                </div>

                {message && (
                  <div className={`p-4 rounded-xl mb-6 animate-fade-in ${
                    message.includes('✅') ? 'bg-green-50 border-2 border-green-200 text-green-700' : 'bg-red-50 border-2 border-red-200 text-red-700'
                  }`}>
                    {message}
                  </div>
                )}

                {user && user.role === 'buyer' && (
                  <button
                    onClick={handleBuyRequest}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold hover:shadow-lg transition-all"
                  >
                    📨 Send Buy Request
                  </button>
                )}
                
                {!user && (
                  <button
                    onClick={() => router.push('/login')}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold hover:shadow-lg transition-all"
                  >
                    🔓 Login to Buy
                  </button>
                )}
              </div>
            </div>

            {listing.description && (
              <div className="mt-8 pt-8 border-t-2 border-gray-100">
                <h2 className="text-2xl font-bold mb-4">📝 Description</h2>
                <p className="text-gray-700 text-lg whitespace-pre-wrap leading-relaxed">
                  {listing.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
