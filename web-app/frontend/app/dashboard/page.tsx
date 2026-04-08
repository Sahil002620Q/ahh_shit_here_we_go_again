'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { listings, buyRequests, admin } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (userData.role === 'seller' || userData.role === 'admin') {
        const listingsRes = await listings.getMy();
        setMyListings(listingsRes.data);
      }
      
      const requestsRes = await buyRequests.getAll();
      setRequests(requestsRes.data);
      
      if (userData.role === 'admin') {
        const statsRes = await admin.getStats();
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: number, status: string) => {
    try {
      await buyRequests.update(requestId, { status });
      fetchData();
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-12 px-6">
        <div className="container mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard</h1>
            <p className="text-gray-600">Manage your listings and requests</p>
          </div>

          {/* Admin Stats */}
          {user.role === 'admin' && stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slide-up">
              {[
                { label: 'Total Listings', value: stats.total_listings, icon: '📦', color: 'from-blue-500 to-blue-600' },
                { label: 'Active Listings', value: stats.active_listings, icon: '✅', color: 'from-green-500 to-green-600' },
                { label: 'Total Requests', value: stats.total_requests, icon: '📨', color: 'from-purple-500 to-purple-600' },
                { label: 'Pending Commissions', value: stats.pending_commissions, icon: '💰', color: 'from-yellow-500 to-yellow-600' },
              ].map((stat, index) => (
                <div key={index} className="glass-effect rounded-2xl p-6 card-hover">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-2xl mb-4`}>
                    {stat.icon}
                  </div>
                  <h3 className="text-gray-600 text-sm font-semibold mb-1">{stat.label}</h3>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* My Listings */}
          {(user.role === 'seller' || user.role === 'admin') && (
            <div className="glass-effect rounded-2xl p-8 mb-8 animate-slide-up">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">📦 My Listings</h2>
                <button
                  onClick={() => router.push('/listings/create')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold hover:shadow-lg transition-all"
                >
                  + New Listing
                </button>
              </div>
              
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border-2 border-gray-100 rounded-xl p-6 animate-pulse">
                      <div className="h-6 bg-gray-200 rounded mb-2 w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : myListings.length > 0 ? (
                <div className="space-y-4">
                  {myListings.map((listing) => (
                    <div key={listing.id} className="border-2 border-gray-100 rounded-xl p-6 hover:border-blue-300 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">
                            {listing.category} - {listing.brand} {listing.model}
                          </h3>
                          <div className="flex gap-3 mb-2">
                            <span className="text-2xl font-bold text-blue-600">${listing.price}</span>
                            <span className="text-gray-600">📍 {listing.location}</span>
                          </div>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            listing.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {listing.status}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => router.push(`/listings/${listing.id}/edit`)}
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => router.push(`/listings/${listing.id}`)}
                            className="px-4 py-2 rounded-lg border-2 border-gray-300 hover:bg-gray-100 transition-all"
                          >
                            👁️ View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-gray-600 mb-4">No listings yet</p>
                  <button
                    onClick={() => router.push('/listings/create')}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg transition-all"
                  >
                    Create Your First Listing
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Buy Requests */}
          <div className="glass-effect rounded-2xl p-8 animate-slide-up">
            <h2 className="text-2xl font-bold mb-6">
              {user.role === 'seller' ? '📨 Buy Requests Received' : '🛒 My Buy Requests'}
            </h2>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="border-2 border-gray-100 rounded-xl p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-2 w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : requests.length > 0 ? (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="border-2 border-gray-100 rounded-xl p-6 hover:border-blue-300 transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-lg font-bold mb-2">Request #{request.id}</p>
                        <p className="text-gray-600 mb-1">Listing ID: {request.listing_id}</p>
                        <div className="flex gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            request.status === 'accepted' ? 'bg-green-100 text-green-700' :
                            request.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {request.status}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            Commission: {request.commission_status}
                          </span>
                        </div>
                      </div>
                      {user.role === 'seller' && request.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStatusUpdate(request.id, 'accepted')}
                            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all"
                          >
                            ✅ Accept
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(request.id, 'rejected')}
                            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all"
                          >
                            ❌ Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-600">No requests yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
