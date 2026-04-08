'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { listings } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function CreateListing() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    category: '',
    brand: '',
    model: '',
    condition: '',
    working_parts: '',
    price: '',
    location: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await listings.create({
        ...formData,
        price: parseFloat(formData.price),
        photos: [],
      });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Smartphone', 'Laptop', 'Tablet', 'Monitor', 'Component', 'Accessory', 'Other'];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="glass-effect rounded-3xl p-8 animate-scale-in">
            <h1 className="text-3xl font-bold gradient-text mb-2">Create New Listing</h1>
            <p className="text-gray-600 mb-8">List your electronic parts for sale</p>
            
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl mb-6 animate-fade-in">
                ⚠️ {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-3">Category *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.category === cat
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">📱</div>
                      <div className="text-sm font-semibold">{cat}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Brand</label>
                  <input
                    type="text"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-all"
                    placeholder="e.g., Apple, Samsung"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Model</label>
                  <input
                    type="text"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-all"
                    placeholder="e.g., iPhone 12, MacBook Pro"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-3">Condition *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: 'broken', label: 'Broken', icon: '❌' },
                    { value: 'partially_working', label: 'Partial', icon: '⚠️' },
                    { value: 'for_parts', label: 'For Parts', icon: '🔧' },
                    { value: 'working', label: 'Working', icon: '✅' },
                  ].map((cond) => (
                    <button
                      key={cond.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, condition: cond.value })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.condition === cond.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{cond.icon}</div>
                      <div className="text-sm font-semibold">{cond.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Price (USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-all"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Location *</label>
                  <input
                    type="text"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-all"
                    placeholder="City, Country"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Working Parts</label>
                <textarea
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-all"
                  rows={3}
                  value={formData.working_parts}
                  onChange={(e) => setFormData({ ...formData, working_parts: e.target.value })}
                  placeholder="List which parts are still functional..."
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                <textarea
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-all"
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide detailed information about the item..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? '⏳ Creating...' : '🚀 Create Listing'}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="px-8 py-4 rounded-xl border-2 border-gray-300 hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
