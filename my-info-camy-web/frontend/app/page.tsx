'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { listings } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function Home() {
  const router = useRouter();
  const [listingData, setListingData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    location: '',
    min_price: '',
    max_price: '',
    condition: '',
  });

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      );
      const response = await listings.getAll(params);
      setListingData(response.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchListings();
  };

  const categories = ['Smartphones', 'Laptops', 'Tablets', 'Monitors', 'Components', 'Accessories'];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center animate-fade-in">
          <h1 className="text-6xl font-bold mb-6 gradient-text">
            Buy & Sell Electronic Parts
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The marketplace for broken devices, spare parts, and recovery electronics. 
            Turn your old tech into cash or find the perfect part for your repair.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.push('/register')}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Start Selling
            </button>
            <button
              onClick={() => document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 rounded-xl border-2 border-gray-300 text-gray-700 text-lg font-semibold hover:bg-gray-100 transition-all"
            >
              Browse Parts
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-6 mb-12 animate-slide-up">
        <h2 className="text-2xl font-bold mb-6 text-center">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setFilters({ ...filters, category: cat });
                setTimeout(() => fetchListings(), 100);
              }}
              className="glass-effect p-6 rounded-xl text-center hover:scale-105 transition-all"
            >
              <div className="text-3xl mb-2">📱</div>
              <div className="font-semibold">{cat}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filter */}
      <div id="listings" className="container mx-auto px-6 mb-12 animate-slide-up">
        <div className="glass-effect rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-6">🔍 Find Your Part</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <input
              type="text"
              placeholder="Category (e.g., Laptop)"
              className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-all"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            />
            <input
              type="text"
              placeholder="Brand (e.g., Apple)"
              className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-all"
              value={filters.brand}
              onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
            />
            <input
              type="text"
              placeholder="Location"
              className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-all"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />
            <select
              className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-all"
              value={filters.condition}
              onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
            >
              <option value="">All Conditions</option>
              <option value="broken">Broken</option>
              <option value="partially_working">Partially Working</option>
              <option value="for_parts">For Parts</option>
              <option value="working">Working</option>
            </select>
            <input
              type="number"
              placeholder="Min Price"
              className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-all"
              value={filters.min_price}
              onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
            />
            <input
              type="number"
              placeholder="Max Price"
              className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-all"
              value={filters.max_price}
              onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
            />
          </div>
          <button
            onClick={handleSearch}
            className="w-full md:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg transition-all"
          >
            🔍 Search
          </button>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="container mx-auto px-6 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-effect rounded-2xl p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listingData.map((listing, index) => (
              <div
                key={listing.id}
                className="glass-effect rounded-2xl p-6 card-hover cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => router.push(`/listings/${listing.id}`)}
              >
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 h-48 rounded-xl mb-4 flex items-center justify-center">
                  <span className="text-6xl">📦</span>
                </div>
                <div className="mb-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {listing.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{listing.brand} {listing.model}</h3>
                <p className="text-gray-600 mb-3">
                  <span className="inline-block px-2 py-1 bg-gray-100 rounded text-sm">
                    {listing.condition}
                  </span>
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">${listing.price}</span>
                  <span className="text-gray-500">📍 {listing.location}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && listingData.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No listings found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later</p>
          </div>
        )}
      </div>
    </div>
  );
}
