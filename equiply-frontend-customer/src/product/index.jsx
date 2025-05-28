import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../header";
import Footer from "../Footer";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
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
      const response = await axios.get('http://localhost:3000/wishlist', {
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
  const currentPage = parseInt(params.get("page")) || 1;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    productsPerPage: 10
  });
  
  const { wishlistItems, updateWishlist } = useContext(WishlistContext);

  // Debounced fetch function
  const debouncedFetch = useCallback(
    (search, categories, page) => {
      const timeoutId = setTimeout(async () => {
        try {
          setLoading(true);
          setError(null); // Clear any previous errors
          const searchParams = new URLSearchParams();
          
          // Add search term if it exists
          if (search && search.trim()) {
            searchParams.append('search', search.trim());
          }
          
          // Add categories if they exist
          if (categories && categories.length > 0) {
            searchParams.append('category', categories.join(','));
          }
          
          // Add pagination parameters
          searchParams.append('page', page);
          searchParams.append('limit', 10);

          const url = `http://localhost:3000/product/search?${searchParams.toString()}`;
          console.log('Fetching products with filters:', {
            search: search?.trim(),
            categories,
            page,
            url
          });
          
          const response = await fetch(url);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to load products');
          }
          
          const data = await response.json();
          console.log('Received products data:', data);
          
          if (!data.success) {
            throw new Error(data.message || 'Failed to load products');
          }
          
          setProducts(data.products || []);
          setPagination(data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalProducts: 0,
            productsPerPage: 10
          });
          setLoading(false);
        } catch (err) {
          console.error('Error fetching products:', err);
          setError(err.message || "Failed to load products");
          setProducts([]); // Clear products on error
          setLoading(false);
        }
      }, 300); // 300ms delay

      return () => clearTimeout(timeoutId);
    },
    []
  );

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  // Effect to handle URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search") || "";
    const categoryParam = params.get("category") || "";
    const pageParam = parseInt(params.get("page")) || 1;

    // Set initial category filter from URL parameter
    if (categoryParam) {
      setSelectedCategories(categoryParam.split(',').map(cat => cat.trim()));
    } else {
      setSelectedCategories([]); // Clear categories if no category param
    }

    // Fetch products with current parameters
    debouncedFetch(searchParam, categoryParam ? categoryParam.split(',').map(cat => cat.trim()) : [], pageParam);
  }, [location.search, debouncedFetch]);

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(location.search);
    newParams.set('page', newPage);
    const newUrl = `${location.pathname}?${newParams.toString()}`;
    navigate(newUrl);
  };

  const handleCategoryChange = (category) => {
    const newCategories = selectedCategories.includes(category) 
      ? selectedCategories.filter((c) => c !== category) 
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    
    // Update URL to reflect current filters and reset to page 1
    const newParams = new URLSearchParams(location.search);
    if (newCategories.length > 0) {
      newParams.set('category', newCategories.join(','));
    } else {
      newParams.delete('category');
    }
    newParams.set('page', '1'); // Reset to first page when changing categories
    
    const newUrl = `${location.pathname}?${newParams.toString()}`;
    navigate(newUrl);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCategories([]);
    const newParams = new URLSearchParams();
    newParams.set('page', '1');
    const newUrl = `${location.pathname}?${newParams.toString()}`;
    navigate(newUrl);
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
      // Check if product is in wishlist using both _id and id fields
      const isInWishlist = wishlistItems.some(item => 
        item._id === productId || 
        item.id === productId || 
        item.product?._id === productId
      );
      
      if (isInWishlist) {
        await axios.delete(`http://localhost:3000/wishlist/remove/${productId}`, {
          headers: { 'x-access-token': token }
        });
        setToast({
          show: true,
          message: 'Removed from wishlist',
          type: 'success'
        });
      } else {
        await axios.post('http://localhost:3000/wishlist/add', 
          { productId },
          { headers: { 'x-access-token': token } }
        );
        setToast({
          show: true,
          message: 'Added to wishlist',
          type: 'success'
        });
      }
      updateWishlist(); // Update wishlist count globally
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
    <div className="flex flex-col min-h-screen">
      <Header />
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}

      <div className="flex flex-col lg:flex-row p-6 gap-6 flex-grow">
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
          
          {/* Clear filters button */}
          {selectedCategories.length > 0 && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          )}
        </aside>

        <main className="flex-1">
          {/* Show active filters */}
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
            <div className="text-center py-20 text-lg font-medium">Loading products...</div>
          ) : error ? (
            <div className="text-center py-20 text-lg font-medium text-red-600">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-lg font-medium">
              {selectedCategories.length > 0 
                ? `No products found in ${selectedCategories.join(', ')} category.`
                : "No products found."
              }
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => {
                  const isInWishlist = wishlistItems.some(item => 
                    item._id === product._id || 
                    item.id === product._id || 
                    item.product?._id === product._id
                  );
                  
                  return (
                    <div
                      key={product._id || product.id}
                      className="border rounded-lg p-4 flex flex-col items-center text-center hover:shadow-lg transition-shadow relative no-underline text-inherit"
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
                        className="w-full flex flex-col items-center"
                      >
                        <img
                          src={Array.isArray(product.images) ? product.images[0] : product.images || "https://via.placeholder.com/150"}
                          alt={product.name}
                          className="w-28 h-28 object-contain mb-4"
                        />
                        <h3 className="text-sm font-medium mb-2 text-black">{product.name}</h3>
                        <p className="text-lg font-bold mb-2 text-black">₹{product.price}</p>
                        <button className="bg-black text-white px-4 py-2 text-sm rounded hover:bg-gray-800">
                          Rent Now
                        </button>
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === 1
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    {[...Array(pagination.totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      if (
                        pageNumber === 1 ||
                        pageNumber === pagination.totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`px-4 py-2 rounded-md ${
                              currentPage === pageNumber
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return <span key={pageNumber}>...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === pagination.totalPages
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

// Wrap the export with the provider
export default function ProductWithProvider() {
  return (
    <WishlistProvider>
      <Product />
    </WishlistProvider>
  );
}
