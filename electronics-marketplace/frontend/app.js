const { useState, useEffect, createContext, useContext } = React;

// --- API Configuration ---
const api = axios.create({
    baseURL: 'http://localhost:8000',
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- Auth Context ---
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await api.get('/auth/me');
                    setUser(res.data);
                } catch (err) {
                    console.error("Auth check failed", err);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const formData = new FormData(); // FastAPI OAuth2 expects form data strictly? No, our schema is JSON
        // Wait, our backend expects JSON for /auth/login based on schema? 
        // Let's check schemas.UserLogin. It's a Pydantic model, so JSON body is expected.
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.access_token);
        setUser(res.data.user);
    };

    const register = async (userData) => {
        const res = await api.post('/auth/register', userData);
        localStorage.setItem('token', res.data.access_token);
        setUser(res.data.user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

// --- Components ---

const Navbar = ({ setPage }) => {
    const { user, logout } = useAuth();
    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex cursor-pointer items-center" onClick={() => setPage('home')}>
                        <span className="text-xl font-bold text-primary">ElectroRecover</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setPage('home')} className="text-gray-600 hover:text-gray-900">Browse</button>
                        {user ? (
                            <>
                                <button onClick={() => setPage('create-listing')} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600">Sell Item</button>
                                <button onClick={() => setPage('dashboard')} className="text-gray-600 hover:text-gray-900">Dashboard</button>
                                {user.role === 'admin' && (
                                    <button onClick={() => setPage('admin')} className="text-purple-600 hover:text-purple-900 font-medium">Admin</button>
                                )}
                                <div className="flex items-center space-x-2 border-l pl-4 ml-4">
                                    <span className="text-sm font-medium">{user.name}</span>
                                    <button onClick={logout} className="text-sm text-red-600 hover:text-red-800">Logout</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setPage('login')} className="text-gray-600 hover:text-gray-900">Login</button>
                                <button onClick={() => setPage('register')} className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700">Register</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

const ListingCard = ({ listing, onRequest }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
                {listing.photos && listing.photos.length > 0 ? (
                    <img src={listing.photos[0]} alt={listing.title} className="h-full w-full object-cover" />
                ) : (
                    <span className="text-gray-400">No Image</span>
                )}
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                            {listing.category}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900">{listing.title}</h3>
                        <p className="text-sm text-gray-500">{listing.brand} {listing.model}</p>
                    </div>
                    <span className="text-lg font-bold text-gray-900">${listing.price}</span>
                </div>

                <div className="mt-3 space-y-1">
                    <p className="text-sm font-medium text-gray-700">Condition: <span className={listing.condition === 'broken' ? 'text-red-600' : 'text-green-600'}>{listing.condition}</span></p>
                    <p className="text-sm text-gray-500 truncate">{listing.location}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${listing.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {listing.status}
                    </span>
                    {listing.status === 'active' && (
                        <button
                            onClick={() => onRequest(listing.id)}
                            className="text-sm font-medium text-primary hover:text-blue-700"
                        >
                            Request to Buy →
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Pages ---

const HomePage = ({ setPage }) => {
    const [listings, setListings] = useState([]);
    const [filters, setFilters] = useState({ category: '', condition: '' });

    useEffect(() => {
        fetchListings();
    }, [filters]);

    const fetchListings = async () => {
        try {
            const params = {};
            if (filters.category) params.category = filters.category;
            if (filters.condition) params.condition = filters.condition;

            const res = await api.get('/listings/', { params });
            setListings(res.data);
        } catch (err) {
            console.error("Failed to fetch listings", err);
        }
    };

    const handleBuyRequest = async (listingId) => {
        try {
            await api.post('/requests/', { listing_id: listingId });
            alert("Buy request sent successfully! Check your dashboard.");
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to send request. You might need to login.");
            if (err.response?.status === 401) setPage('login');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex gap-8">
                {/* Sidebar Filters */}
                <div className="w-64 flex-shrink-0">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input
                                type="text"
                                className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                                placeholder="e.g. Phone, Laptop"
                                value={filters.category}
                                onChange={e => setFilters({ ...filters, category: e.target.value })}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                            <select
                                className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                                value={filters.condition}
                                onChange={e => setFilters({ ...filters, condition: e.target.value })}
                            >
                                <option value="">All</option>
                                <option value="broken">Broken</option>
                                <option value="for_parts">For Parts</option>
                                <option value="used">Used</option>
                                <option value="new">New</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Listing Grid */}
                <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listings.map(listing => (
                            <ListingCard key={listing.id} listing={listing} onRequest={handleBuyRequest} />
                        ))}
                    </div>
                    {listings.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No listings found matching your criteria.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const LoginPage = ({ setPage }) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            setPage('home');
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login to your account</h2>
                {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full bg-primary text-white py-2 rounded-md hover:bg-blue-600 font-medium">
                        Sign In
                    </button>
                </form>
                <div className="mt-4 text-center text-sm">
                    Don't have an account? <button onClick={() => setPage('register')} className="text-primary hover:underline">Register</button>
                </div>
            </div>
        </div>
    );
};

const RegisterPage = ({ setPage }) => {
    const { register } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'buyer', location: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            setPage('home');
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12">
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Create an account</h2>
                {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="buyer">Buyer</option>
                            <option value="seller">Seller</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="w-full bg-primary text-white py-2 rounded-md hover:bg-blue-600 font-medium">
                        Register
                    </button>
                </form>
                <div className="mt-4 text-center text-sm">
                    Already have an account? <button onClick={() => setPage('login')} className="text-primary hover:underline">Login</button>
                </div>
            </div>
        </div>
    );
};

const CreateListingPage = ({ setPage }) => {
    const [formData, setFormData] = useState({
        title: '', category: '', brand: '', model: '',
        condition: 'broken', price: '', location: '', description: '',
        working_parts: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/listings/', {
                ...formData,
                price: parseFloat(formData.price),
                photos: [] // Placeholder for now
            });
            alert('Listing created!');
            setPage('dashboard');
        } catch (err) {
            alert('Failed to create listing: ' + (err.response?.data?.detail || err.message));
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6">Create New Listing</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <input type="text" required className="w-full border p-2 rounded" placeholder="Smartphone"
                            value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Brand</label>
                        <input type="text" className="w-full border p-2 rounded" placeholder="Apple"
                            value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Model</label>
                        <input type="text" className="w-full border p-2 rounded" placeholder="iPhone 12"
                            value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Condition</label>
                        <select className="w-full border p-2 rounded"
                            value={formData.condition} onChange={e => setFormData({ ...formData, condition: e.target.value })}>
                            <option value="broken">Broken / Damaged</option>
                            <option value="for_parts">For Parts Only</option>
                            <option value="used">Used / Working</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input type="text" required className="w-full border p-2 rounded" placeholder="Broken Screen iPhone 12 Pro Max"
                        value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Working Parts (if any)</label>
                    <textarea className="w-full border p-2 rounded" placeholder="Motherboard, Battery seem fine..."
                        value={formData.working_parts} onChange={e => setFormData({ ...formData, working_parts: e.target.value })} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea required className="w-full border p-2 rounded h-24" placeholder="Detailed description of the item..."
                        value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                        <input type="number" step="0.01" required className="w-full border p-2 rounded" placeholder="0.00"
                            value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input type="text" required className="w-full border p-2 rounded" placeholder="City, State"
                            value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                    </div>
                </div>

                <div className="pt-4">
                    <button type="submit" className="w-full bg-primary text-white py-3 rounded-md hover:bg-blue-600 font-bold">
                        Post Listing
                    </button>
                    <button type="button" onClick={() => setPage('home')} className="w-full mt-2 text-gray-600 py-2 hover:bg-gray-50 rounded">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

const DashboardPage = () => {
    const { user } = useAuth();
    const [myListings, setMyListings] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState([]);

    useEffect(() => {
        if (user) loadDashboardData();
    }, [user]);

    const loadDashboardData = async () => {
        try {
            // In a real app we'd have a specific endpoint for my listings
            // Using logic: fetch all and filter by seller_id (not efficient but works for now)
            // Or use an endpoint if we made one. We haven't made a specific "my-listings" endpoint, 
            // but we can add one or just use correct endpoint. 
            // Actually, we should probably add one, but for now let's just use the requests endpoints which we DID make on "my-requests" and "incoming".

            // Note: listings router has generic filter, but getting "my" listings specifically might need a query param or separate endpoint.
            // Let's leave listings empty for now or try to fetch generic and filter client side (bad practice but works for demo).
            // Better: update backend to support "seller_id" filter.

            const reqSent = await api.get('/requests/my-requests');
            setSentRequests(reqSent.data);

            const reqInc = await api.get('/requests/incoming');
            setIncomingRequests(reqInc.data);

            // Hack for listings:
            const listRes = await api.get('/listings/?limit=100');
            setMyListings(listRes.data.filter(l => l.seller_id === user.id));

        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateStatus = async (reqId, status) => {
        try {
            if (status === 'accept') await api.put(`/requests/${reqId}/accept`);
            if (status === 'reject') await api.put(`/requests/${reqId}/reject`);
            loadDashboardData();
        } catch (err) {
            alert("Action failed");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Incoming Requests (As Seller) */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Incoming Buy Requests</h2>
                    {incomingRequests.length === 0 ? (
                        <p className="text-gray-500">No incoming requests.</p>
                    ) : (
                        <div className="space-y-4">
                            {incomingRequests.map(req => (
                                <div key={req.id} className="border p-4 rounded-md">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className={`px-2 py-1 rounded-full text-xs ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                            {req.status}
                                        </span>
                                        <span className="text-sm text-gray-500">{new Date(req.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="font-medium">Request for Listing #{req.listing_id}</p>

                                    {req.status === 'pending' && (
                                        <div className="mt-3 flex space-x-2">
                                            <button onClick={() => handleUpdateStatus(req.id, 'accept')} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">Accept</button>
                                            <button onClick={() => handleUpdateStatus(req.id, 'reject')} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">Reject</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sent Requests (As Buyer) */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">My Sent Requests</h2>
                    {sentRequests.length === 0 ? (
                        <p className="text-gray-500">You haven't made any requests.</p>
                    ) : (
                        <div className="space-y-4">
                            {sentRequests.map(req => (
                                <div key={req.id} className="border p-4 rounded-md">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Listing #{req.listing_id}</span>
                                        <span className={`px-2 py-1 rounded-full text-xs ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : req.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                                            {req.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* My Listings */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">My Listings</h2>
                {myListings.length === 0 ? (
                    <p className="text-gray-500">No listings active.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {myListings.map(l => (
                            <div key={l.id} className="border p-4 rounded-md">
                                <h3 className="font-medium">{l.title}</h3>
                                <div className="flex justify-between mt-2 text-sm text-gray-600">
                                    <span>${l.price}</span>
                                    <span>{l.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- App Container ---

const App = () => {
    const [page, setPage] = useState('home');

    return (
        <AuthProvider>
            <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
                <Navbar setPage={setPage} />
                <main>
                    {page === 'home' && <HomePage setPage={setPage} />}
                    {page === 'login' && <LoginPage setPage={setPage} />}
                    {page === 'register' && <RegisterPage setPage={setPage} />}
                    {page === 'create-listing' && <CreateListingPage setPage={setPage} />}
                    {page === 'dashboard' && <DashboardPage />}
                </main>
            </div>
        </AuthProvider>
    );
};

// Render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
