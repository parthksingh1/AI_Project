import React, { useState } from 'react';
import { FiShoppingCart, FiStar, FiThumbsUp } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { getImgUrl } from '../../utils/getImgUrl';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { useFetchBookByIdQuery } from '../../redux/features/books/booksApi';

const SingleBook = () => {
  const { id } = useParams();
  const { data: book, isLoading, isError } = useFetchBookByIdQuery(id);
  const dispatch = useDispatch();
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0); // For star rating
  const [reviews, setReviews] = useState([
    { id: 1, user: 'Utkarsh Purohit', reviewText: 'Great book! Highly recommended.', likes: 12, rating: 4.5 },
    { id: 2, user: 'Parth Kumar Singh', reviewText: 'Good Read', likes: 5, rating: 3.4 }
  ]);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (review && rating) {
      setReviews([...reviews, { id: Date.now(), user: 'Anonymous', reviewText: review, likes: 0, rating }]); // Adding star rating
      setReview(''); // Clear the input after submission
      setRating(0); // Reset the rating
    }
  };

  const handleLike = (id) => {
    setReviews(
      reviews.map((rev) =>
        rev.id === id ? { ...rev, likes: rev.likes + 1 } : rev
      )
    );
  };

  const handleStarClick = (index) => {
    setRating(index);
  };

  const calculateOverallRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return (totalRating / reviews.length).toFixed(1); // Returns average rating with 1 decimal
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error happened to load book info</div>;

  return (
    <div className="flex space-x-10">
      {/* Book Details */}
      <div className="max-w-lg shadow-md p-5">
        <h1 className="text-2xl font-bold mb-6">{book.title}</h1>

        <div>
          <img
            src={`${getImgUrl(book.coverImage)}`}
            alt={book.title}
            className="mb-8"
          />
          <div className='mb-5'>
            <p className="text-gray-700 mb-2">
              <strong>Author:</strong> {book.author || 'admin'}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Published:</strong> {new Date(book?.createdAt).toLocaleDateString()}
            </p>
            <p className="text-gray-700 mb-4 capitalize">
              <strong>Category:</strong> {book?.category}
            </p>
            <p className="text-gray-700">
              <strong>Description:</strong> {book.description}
            </p>
          </div>

          <button
            onClick={() => handleAddToCart(book)}
            className="btn-primary px-6 space-x-1 flex items-center gap-1"
          >
            <FiShoppingCart />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>

      {/* Review Section */}
      <div className="max-w-lg shadow-md p-5">
      {/* Increased width */}
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>

        {/* Overall Rating */}
        <div className="flex items-center mb-6">
          <span className="text-xl font-semibold">{calculateOverallRating()}</span>
          <div className="flex ml-2 text-yellow-500">
            {[...Array(5)].map((_, index) => (
              <FiStar
                key={index}
                className={index < Math.round(calculateOverallRating()) ? "text-yellow-500" : "text-gray-300"}
              />
            ))}
          </div>
          <span className="ml-2 text-gray-500">{reviews.length} Reviews</span>
        </div>

        {/* Review Form */}
        <form onSubmit={handleReviewSubmit} className="mb-6">
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full border p-3 rounded mb-4"
            placeholder="Write your feedback or review..."
            rows="4"
          />

          {/* Star Rating for Feedback */}
          <div className="flex mb-4">
            {[...Array(5)].map((_, index) => (
              <FiStar
                key={index}
                className={index < rating ? "text-yellow-500 cursor-pointer" : "text-gray-300 cursor-pointer"}
                onClick={() => handleStarClick(index + 1)}
              />
            ))}
          </div>

          <button type="submit" className="btn-primary px-6">Submit Review</button>
        </form>

        {/* Display Reviews */}
        <div>
          {reviews.length === 0 ? (
            <p>No reviews yet. Be the first to leave a review!</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="mb-4 p-3 bg-gray-100 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{rev.user}</span>
                  <div className="flex items-center">
                    <span className="mr-1 text-yellow-500">{rev.rating}</span>
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, index) => (
                        <FiStar
                          key={index}
                          className={index < Math.round(rev.rating) ? "text-yellow-500" : "text-gray-300"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-2">{rev.reviewText}</p>
                <div className="flex items-center text-gray-500">
                  <button
                    className="flex items-center"
                    onClick={() => handleLike(rev.id)}
                  >
                    <FiThumbsUp className="mr-1" />
                    <span>{rev.likes} Likes</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleBook;
