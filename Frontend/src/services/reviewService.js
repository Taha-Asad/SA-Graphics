import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

// Create axios instance with auth header
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get user's reviews
export const getUserReviews = async () => {
  try {
    const response = await axiosInstance.get('/reviews/user');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch reviews' };
  }
};

// Add a new review
export const addReview = async (reviewData) => {
  try {
    const response = await axiosInstance.post('/reviews', reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to add review' };
  }
};

// Update a review
export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await axiosInstance.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update review' };
  }
};

// Delete a review
export const deleteReview = async (reviewId) => {
  try {
    const response = await axiosInstance.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete review' };
  }
}; 