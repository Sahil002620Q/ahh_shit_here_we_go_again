'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'glass-effect shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => router.push('/')}
            className="text-2xl font-bold gradient-text hover:scale-105 transition-transform"
          >
            ⚡ TechParts
          </button>
          
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <span className="text-gray-700">👋 {user.name}</span>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transition-all"
                >
                  Dashboard
                </button>
                {(user.role === 'seller' || user.role === 'admin') && (
                  <button
                    onClick={() => router.push('/listings/create')}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 text-white hover:shadow-lg transition-all"
                  >
                    + New Listing
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
