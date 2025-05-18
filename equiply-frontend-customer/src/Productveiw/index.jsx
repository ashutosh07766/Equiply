import React, { useState, useEffect } from 'react';
import { Star, StarHalf, Heart } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../header';
import Footer from '../Footer';

// Helper function to format dates
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

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
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

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
        
        // Extract the product and reviews from the response
        if (data && data.success && data.product) {
          setProduct(data.product);
          
          // Set review statistics if available
          if (data.reviewStats) {
            setReviewStats(data.reviewStats);
          }
          
          // Set recent reviews if available
          if (data.recentReviews) {
            setReviews(data.recentReviews);
          }
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

    // Fetch all reviews for this product
    const fetchAllReviews = async () => {
      try {
        const response = await fetch(`http://localhost:3000/review/product/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        
        const data = await response.json();
        if (data && data.success && data.reviews) {
          setReviews(data.reviews);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    if (id) {
      fetchProductById();
      fetchAllReviews();
    }
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      // Redirect to login page if not logged in
      navigate('/login');
      return;
    }
    
    if (!newReview.comment.trim()) {
      setReviewError('Please enter a comment');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setReviewError(null);
      
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3000/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify({
          productId: id,
          rating: newReview.rating,
          comment: newReview.comment
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit review');
      }
      
      // Reset form and refresh reviews
      setNewReview({ rating: 5, comment: '' });
      
      // Refetch reviews to include the new one
      const updatedReviewsResponse = await fetch(`http://localhost:3000/review/product/${id}`);
      const updatedReviewsData = await updatedReviewsResponse.json();
      
      if (updatedReviewsData && updatedReviewsData.success) {
        setReviews(updatedReviewsData.reviews);
      }
      
      // Refetch product to update review stats
      const updatedProductResponse = await fetch(`http://localhost:3000/product/${id}`);
      const updatedProductData = await updatedProductResponse.json();
      
      if (updatedProductData && updatedProductData.success && updatedProductData.reviewStats) {
        setReviewStats(updatedProductData.reviewStats);
      }
      
    } catch (error) {
      console.error('Error submitting review:', error);
      setReviewError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Reviews</h2>
          
          /* Review statistics */
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl font-bold">
              {reviewStats ? reviewStats.averageRating : '0.0'}
            </div>
            <div className="text-yellow-500 flex gap-1">
              {[...Array(5)].map((_, i) => {
                if (!reviewStats) return <Star key={i} />;
                
                const rating = reviewStats.averageRating;
                if (i < Math.floor(rating)) {
                  return <Star key={i} fill="currentColor" />;
                } else if (i === Math.floor(rating) && rating % 1 >= 0.5) {
                  return <StarHalf key={i} fill="currentColor" />;
                } else {
                  return <Star key={i} />;
                }
              })}
            </div>
            <div className="text-gray-600">
              {reviewStats ? reviewStats.totalReviews : 0} ratings
            </div>
          </div>
          
          /* Rating distribution */
          <div className="space-y-1 text-sm text-gray-700">
            {reviewStats && (
              <>
                <div>Excellent — {reviewStats.ratingDistribution['5']}</div>
                <div>Good — {reviewStats.ratingDistribution['4']}</div>
                <div>Average — {reviewStats.ratingDistribution['3']}</div>
                <div>Below Average — {reviewStats.ratingDistribution['2']}</div>
                <div>Poor — {reviewStats.ratingDistribution['1']}</div>
              </>
            )}
          </div>
          
          /* Review submission form */
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Write a Review</h3>
            {!isLoggedIn && (
              <p className="text-gray-600 mb-2">
                Please <a href="/login" className="text-blue-600 hover:underline">login</a> to submit a review
              </p>
            )}
            <form onSubmit={handleSubmitReview}>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="text-yellow-500"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      disabled={!isLoggedIn}
                    >
                      <Star 
                        size={24} 
                        fill={star <= newReview.rating ? 'currentColor' : 'none'} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Comment</label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows={4}
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your experience with this product"
                  disabled={!isLoggedIn}
                ></textarea>
              </div>
              {reviewError && (
                <div className="text-red-500 text-sm mb-2">{reviewError}</div>
              )}
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg ${
                  isLoggedIn
                    ? "bg-black text-white hover:opacity-90"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
                disabled={!isLoggedIn || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
          
          /* Display reviews */
          <div className="mt-6 space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <Review
                  key={review._id}
                  name={review.userName}
                  date={formatDate(review.date)}
                  rating={review.rating}
                  comment={review.comment}
                />
              ))
            ) : (
              <p className="text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
            )}
          </div>
          
          {reviews.length > 3 && (
            <button className="mt-6 text-blue-600 hover:underline">
              View More ⌄
            </button>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductVeiw;