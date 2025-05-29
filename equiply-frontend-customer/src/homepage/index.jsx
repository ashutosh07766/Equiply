import React, { useState, useEffect } from "react";
import Header from "../header";
import Footer from "../Footer";
import { Link } from "react-router-dom";

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Get featured products from the public endpoint
        const featuredResponse = await fetch("https://equiply-jrej.onrender.com/product/featured");
        const featuredData = await featuredResponse.json();
        
        if (featuredData.success && Array.isArray(featuredData.featuredProducts)) {
          setFeaturedProducts(featuredData.featuredProducts);
        } else {
          setFeaturedProducts([]);
        }
        
        // Get all products for the "Most Popular" section
        const response = await fetch("https://equiply-jrej.onrender.com/product");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(Array.isArray(data.products) ? data.products : []);
        
        setLoading(false);
      } catch (err) {
        console.error("Error in fetchProducts:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <Header />
      <div className="max-w-[90%] mx-auto px-2 sm:px-4 pb-8">
        <div className="flex justify-center items-center m-[12px] w-full h-52 bg-slate-800 rounded-2xl mb-8">
          <div className="text-center px-8">
            <div className="text-white text-3xl font-normal font-['Inter'] leading-loose">
              Why Buy?
            </div>
            <div className="text-white text-5xl font-normal font-['Inter'] leading-loose">
              When you can rent one.
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="text-center text-neutral-700 text-4xl font-bold font-['Oxygen'] mb-6">
            Featured Products
          </div>
          {loading ? (
            <div className="text-center py-8">Loading products...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">Error: {error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.isArray(featuredProducts) && featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <div
                    key={product._id || Math.random().toString()}
                    className="border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
                  >
                    <img
                      src={product.images || "https://via.placeholder.com/150"}
                      alt={product.name}
                      className="w-32 h-32 object-contain mb-4"
                    />
                    <h3 className="text-base font-medium mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-lg font-bold mb-4 text-slate-700">₹{product.price}</p>
                    <Link to={`/productview/${product._id}`} className="w-full">
                      <button className="w-full bg-black text-white px-4 py-2 text-sm rounded hover:bg-gray-800 transition-colors">
                        Rent Now
                      </button>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No featured products available at the moment.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mb-8">
          <div className="flex w-full justify-between items-center mb-6">
            <div className="text-neutral-700 text-4xl font-bold font-['Oxygen']">
              Most Popular Products
            </div>
            <Link to="/product">
              <div className="px-6 py-3 bg-zinc-800 rounded-full inline-flex justify-center items-center gap-2 hover:bg-zinc-700 transition-colors">
                <div className="text-white text-lg font-semibold font-['Exo']">
                  View All
                </div>
                <div className="w-5 h-5 text-white">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.isArray(products) && products.length > 0 ? (
              products.slice(0, 8).map((product) => (
                <div
                  key={product._id || Math.random().toString()}
                  className="border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src={product.images || "https://via.placeholder.com/150"}
                    alt={product.name}
                    className="w-32 h-32 object-contain mb-4"
                  />
                  <h3 className="text-base font-medium mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-lg font-bold mb-4 text-slate-700">₹{product.price}</p>
                  <Link to={`/productview/${product._id}`} className="w-full">
                    <button className="w-full bg-black text-white px-4 py-2 text-sm rounded hover:bg-gray-800 transition-colors">
                      Rent Now
                    </button>
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No products available at the moment.
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Homepage;