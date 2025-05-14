import React, { useState, useEffect } from 'react';
import { Star, StarHalf, Heart } from 'lucide-react';
import { useParams } from 'react-router-dom';
import Header from '../header';
import Footer from '../Footer';

const Review = ({ name, date, comment, rating }) => (
  <div className="border-b py-4">
    <div className="flex items-center justify-between">
      <p className="font-semibold">{name}</p>
      <p className="text-sm text-gray-500">{date}</p>
    </div>
    <div className="flex items-center gap-1 text-yellow-500">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} fill={i < rating ? 'currentColor' : 'none'} />
      ))}
    </div>
    <p className="text-sm mt-2 text-gray-700">{comment}</p>
  </div>
);

const ProductVeiw = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductById = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/product/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        
        const data = await response.json();
        console.log('Product Details:', data);
        
        // Extract the product from the nested structure
        if (data && data.success && data.product) {
          setProduct(data.product);
        } else {
          throw new Error('Invalid product data format from API');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    if (id) {
      fetchProductById();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex justify-center items-center">
          <p className="text-lg font-medium">Loading product details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex justify-center items-center">
          <p className="text-lg font-medium text-red-500">Error: {error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex justify-center items-center">
          <p className="text-lg font-medium">Product not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8 flex-grow">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={product.images || "https://via.placeholder.com/500x300?text=No+Image+Available"}
              alt={product.name}
              className="w-full rounded-xl shadow-md"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="mb-4">
              <p className="text-xl font-semibold text-gray-800">Rental Pricing:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {product.renting && (
                  <>
                    {product.renting.hours && (
                      <div className="border rounded-lg p-2 text-center">
                        <p className="font-semibold">${product.renting.hours}</p>
                        <p className="text-sm text-gray-500">per hour</p>
                      </div>
                    )}
                    {product.renting.days && (
                      <div className="border rounded-lg p-2 text-center bg-black text-white">
                        <p className="font-semibold">${product.renting.days}</p>
                        <p className="text-sm">per day</p>
                      </div>
                    )}
                    {product.renting.weeks && (
                      <div className="border rounded-lg p-2 text-center">
                        <p className="font-semibold">${product.renting.weeks}</p>
                        <p className="text-sm text-gray-500">per week</p>
                      </div>
                    )}
                    {product.renting.months && (
                      <div className="border rounded-lg p-2 text-center">
                        <p className="font-semibold">${product.renting.months}</p>
                        <p className="text-sm text-gray-500">per month</p>
                      </div>
                    )}
                  </>
                )}
                {!product.renting && (
                  <div className="border rounded-lg p-2 text-center">
                    <p className="font-semibold">${product.price}</p>
                    <p className="text-sm text-gray-500">per day</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <button className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-100">
                <Heart size={18} /> to Wishlist
              </button>
              <button className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-90">
                Rent Now
              </button>
            </div>
            <div className="text-sm text-gray-600 mb-2"> Available for: {product.availability || 'Limited time'}</div>
            <div className="text-sm text-gray-600 mb-2"> Location: {product.location || 'Not specified'}</div>
            <div className="text-sm text-gray-600 mb-2"> Seller: {product.seller || 'Anonymous'}</div>
            <div className="text-sm text-gray-600"> Category: {product.category || 'Uncategorized'}</div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-bold mb-2">Details</h2>
          <p className="text-gray-700">
            {product.description || 'No description available for this product.'}
          </p>
          <button className="mt-4 text-blue-600 hover:underline">View More ⌄</button>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Reviews</h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl font-bold">4.8</div>
            <div className="text-yellow-500 flex gap-1">
              {[...Array(4)].map((_, i) => (
                <Star key={i} fill="currentColor" />
              ))}
              <StarHalf fill="currentColor" />
            </div>
            <div className="text-gray-600">411 ratings</div>
          </div>
          <div className="space-y-1 text-sm text-gray-700">
            <div>Excellent — 100</div>
            <div>Good — 11</div>
            <div>Average — 3</div>
            <div>Below Average — 2</div>
            <div>Poor — 1</div>
          </div>
          <div className="mt-6 space-y-6">
            <Review
              name="Oscar Carey"
              date="21 January 2024"
              rating={5}
              comment="One of the best! I've long considered iPhones from America, but I couldn't be happier with this procurement. I have a SIM plan and also use this for my main phone. The camera system is crazy good. The battery lasts all day and I love the always-on screen and lock screen widgets. Plus the cinematic effect on videos is MIND-BLOWING!"
            />
            <Review
              name="Reehal Kashers"
              date="11 January 2024"
              rating={5}
              comment="This is one of the most capable Android rivals out there. iPhone 14 Pro Max is great! Apple is pushing out the curve forward. Just about the best camera setup in phones if you're serious about quality. The iPhone 14 performs at top-tier and gives smooth social media sync."
            />
            <Review
              name="Darry Krug"
              date="04 January 2024"
              rating={3}
              comment="Only 4 stars for me (my low tier) but the camera is a little funky. Hoping it will change with a software update, otherwise, love the phone!"
            />
          </div>
          <button className="mt-6 text-blue-600 hover:underline">View More ⌄</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductVeiw;