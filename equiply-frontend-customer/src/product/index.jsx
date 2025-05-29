import { useState, useEffect, createContext, useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Header from "../header";
import Footer from "../Footer";
import { Heart, ArrowLeft } from "lucide-react";
import axios from "axios";

// Create Wishlist Context
export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistUpdateTrigger, setWishlistUpdateTrigger] = useState(0);

  const fetchWishlist = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    
    try {
      const response = await axios.get('https://equiply-jrej.onrender.com/wishlist', {
        headers: { 'x-access-token': token }
      });
      console.log('Wishlist API Response:', response.data);
      
      // Handle different response formats
      const items = Array.isArray(response.data) ? response.data : response.data.items || [];
      setWishlistItems(items);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      // Set empty array on error instead of failing
      setWishlistItems([]);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [wishlistUpdateTrigger]);

  const updateWishlist = () => {
    setWishlistUpdateTrigger(prev => prev + 1);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, updateWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 ease-in-out bg-blue-500 text-white">
      {message}
    </div>
  );
};

const Product = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const searchTerm = params.get("search") || "";
  const categoryParam = params.get("category") || "";
  const pageParam = params.get("page") || "1";
  const limitParam = params.get("limit") || "10";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [pagination, setPagination] = useState({
    currentPage: parseInt(pageParam),
    totalPages: 1,
    totalProducts: 0,
    productsPerPage: parseInt(limitParam)
  });
  
  // Add default empty arrays to prevent "undefined.map()" errors
  const { wishlistItems = [], updateWishlist } = useContext(WishlistContext) || {};

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    // Set initial category filter from URL parameter
    if (categoryParam) {
      setSelectedCategories(categoryParam.split(','));
    }
  }, [categoryParam]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const searchParams = new URLSearchParams();
        if (searchTerm) {
          searchParams.append('search', searchTerm);
        }
        if (selectedCategories.length > 0) {
          searchParams.append('category', selectedCategories.join(','));
        }
        searchParams.append('page', pagination.currentPage.toString());
        searchParams.append('limit', pagination.productsPerPage.toString());

        const url = `https://equiply-jrej.onrender.com/product/search?${searchParams.toString()}`;
        console.log('Fetching products from:', url);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        console.log('Received products data:', data);

        if (!data.success) {
          throw new Error(data.message || 'Failed to load products');
        }

        // Ensure products is always an array even if the API returns null/undefined
        setProducts(data.products || []);
        setPagination(prev => ({
          ...prev,
          totalPages: data.pagination?.totalPages || 1,
          totalProducts: data.pagination?.totalProducts || 0
        }));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message || "Failed to load products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, selectedCategories, pagination.currentPage, pagination.productsPerPage]);

  const handleCategoryChange = (category) => {
    const newCategories = selectedCategories.includes(category) 
      ? selectedCategories.filter((c) => c !== category) 
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page when changing categories
    
    const newParams = new URLSearchParams(location.search);
    if (newCategories.length > 0) {
      newParams.set('category', newCategories.join(','));
    } else {
      newParams.delete('category');
    }
    newParams.set('page', '1'); // Reset to first page
    
    navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page when clearing filters
    
    const newParams = new URLSearchParams(location.search);
    newParams.delete('category');
    newParams.set('page', '1'); // Reset to first page
    
    navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
    const newParams = new URLSearchParams(location.search);
    newParams.set('page', newPage.toString());
    navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
  };

  const handleItemsPerPageChange = (newLimit) => {
    setPagination(prev => ({ ...prev, productsPerPage: newLimit, currentPage: 1 }));
    const newParams = new URLSearchParams(location.search);
    newParams.set('limit', newLimit.toString());
    newParams.set('page', '1');
    navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
  };

  const handleWishlistClick = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const isInWishlist = wishlistItems.some(item => 
        item._id === productId || 
        item.id === productId || 
        item.product?._id === productId
      );
      
      if (isInWishlist) {
        await axios.delete(`https://equiply-jrej.onrender.com/wishlist/remove/${productId}`, {
          headers: { 'x-access-token': token }
        });
        setToast({
          show: true,
          message: 'Removed from wishlist',
          type: 'success'
        });
      } else {
        await axios.post('https://equiply-jrej.onrender.com/wishlist/add', 
          { productId },
          { headers: { 'x-access-token': token } }
        );
        setToast({
          show: true,
          message: 'Added to wishlist',
          type: 'success'
        });
      }
      updateWishlist();
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      setToast({
        show: true,
        message: error.response?.data?.message || 'Error updating wishlist',
        type: 'error'
      });
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/login');
      }
    }
  };

  return (
    <div>
      <Header />
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}

      <div className="max-w-[90%] mx-auto px-2 sm:px-4 pb-8">
        {/* Back Button */}
        <div className="mt-8 mb-6">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-black hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Title Section */}
        <div className="mb-8">
          <div className="text-center text-neutral-700 text-4xl font-bold font-['Oxygen'] mb-6">
            Browse Products
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-1/5 space-y-4">
            <h2 className="font-semibold text-lg">Filter by Category</h2>
            {["Mobile", "Electronics", "House Appliances", "Accessories", "Tools", "Music", "Transport", "Gaming", "Books", "Costume", "Other"].map((cat) => (
              <label key={cat} className="block text-sm">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                />
                {cat}
              </label>
            ))}
            
            {selectedCategories.length > 0 && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-blue-600 hover:underline"
              >
                Clear filters
              </button>
            )}
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {selectedCategories.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Active filters:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {category}
                      <button
                        onClick={() => handleCategoryChange(category)}
                        className="ml-2 hover:text-blue-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">Loading products...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-8">Error: {error}</div>
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                {selectedCategories.length > 0 
                  ? `No products found in ${selectedCategories.join(', ')} category.`
                  : "No products found."
                }
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((product) => {
                    const isInWishlist = wishlistItems.some(item => 
                      item._id === product._id || 
                      item.id === product._id || 
                      item.product?._id === product._id
                    );
                    
                    return (
                      <div
                        key={product._id || product.id}
                        className="border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow relative"
                      >
                        <button
                          className={`absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-gray-100 transition-colors ${
                            isInWishlist ? 'text-red-500' : 'text-gray-400'
                          }`}
                          onClick={(e) => handleWishlistClick(e, product._id)}
                          title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                        >
                          <Heart size={18} fill={isInWishlist ? 'currentColor' : 'none'} />
                        </button>
                        <Link
                          to={`/productview/${product._id || product.id}`}
                          className="w-full flex flex-col items-center no-underline"
                        >
                          <img
                            src={Array.isArray(product.images) ? product.images[0] : product.images || "https://via.placeholder.com/150"}
                            alt={product.name}
                            className="w-32 h-32 object-contain mb-4"
                          />
                          <h3 className="text-base font-medium mb-2 line-clamp-2 text-gray-800 no-underline">{product.name}</h3>
                          <p className="text-lg font-bold mb-4 text-slate-700">₹{product.price}</p>
                          <button className="w-full bg-black text-white px-4 py-2 text-sm rounded hover:bg-gray-800 transition-colors">
                            Rent Now
                          </button>
                        </Link>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Items per page:</span>
                    <select
                      value={pagination.productsPerPage}
                      onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    <span className="text-sm">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>

                  <div className="text-sm text-gray-600">
                    Showing {products.length} of {pagination.totalProducts} products
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default function ProductWithProvider() {
  return (
    <WishlistProvider>
      <Product />
    </WishlistProvider>
  );
}
