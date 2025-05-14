import React, { useState, useEffect } from 'react'
import Header from '../header';
import Footer from '../Footer';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/product');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && typeof data === 'object') {
          if (Array.isArray(data.products)) {
            setProducts(data.products);
          } else if (Array.isArray(data.data)) {
            setProducts(data.data);
          } else if (Array.isArray(data.items)) {
            setProducts(data.items);
          } else {
            const productsArray = Object.values(data).filter(item => item && typeof item === 'object');
            if (productsArray.length > 0) {
              setProducts(productsArray);
            } else {
              throw new Error('Unexpected data format from API');
            }
          }
        } else {
          throw new Error('Invalid response format from API');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  const getProductsArray = () => {
    if (!Array.isArray(products)) {
      console.error('Products is not an array:', products);
      return [];
    }
    return products;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-col lg:flex-row p-6 gap-6 flex-grow">
        <aside className="w-full lg:w-1/5 space-y-4">
          <h2 className="font-semibold text-lg">Filter</h2>
          <input
            type="text"
            placeholder="Search"
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <div className="space-y-2 text-sm">
            <div className="font-medium">Mobile</div>
            <label className="block">
              <input type="checkbox" className="mr-2" /> Mobile
            </label>
            <label className="block">
              <input type="checkbox" className="mr-2" /> Electronics
            </label>
            <label className="block">
              <input type="checkbox" className="mr-2" /> House Appliances
            </label>
            <label className="block">
              <input type="checkbox" className="mr-2" /> Accessories
            </label>
          </div>
        </aside>

        <main className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg font-medium">Loading products...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg font-medium text-red-500">Error: {error}</p>
            </div>
          ) : getProductsArray().length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg font-medium">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {getProductsArray().map((product) => (
                <div
                  key={product.id || Math.random().toString()}
                  className="border rounded-lg p-4 flex flex-col items-center text-center"
                >
                  <img
                    src={product.images || "https://via.placeholder.com/150"}
                    alt={product.name}
                    className="w-28 h-28 object-contain mb-4"
                  />
                  <h3 className="text-sm font-medium mb-2">{product.name}</h3>
                  <p className="text-lg font-bold mb-2">${product.price}</p>
                  <button className="bg-black text-white px-4 py-2 text-sm rounded hover:bg-gray-800">
                    Buy Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      
      <Footer />
    </div>
  );
}

export default Product