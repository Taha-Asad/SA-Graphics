import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

// Get user's reviews
export const getUserReviews = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    console.log('Fetching reviews with token:', token);
    
    const config = {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    
    // Make sure we're hitting the correct endpoint
    const url = `${API_URL}/reviews/user`;  // Changed from /reviews/me to /reviews/user
    console.log('Making request to:', url);
    console.log('With config:', config);
    
    const response = await axios.get(url, config);
    console.log('Full API response:', response);
    
    // Check if we got HTML instead of JSON
    if (typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
      console.error('Received HTML instead of JSON. API endpoint might be incorrect.');
      throw new Error('Invalid API response - received HTML instead of JSON');
    }
    
    // Ensure we're returning the data array
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.error('Invalid response structure:', response.data);
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    console.error('Detailed error in getUserReviews:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
      config: error.config
    });
    
    if (error.message.includes('Invalid API response')) {
      throw new Error('Server configuration error - please contact support');
    } else if (error.response?.status === 401) {
      throw new Error('Please login to view your reviews');
    } else if (error.response?.status === 404) {
      throw new Error('Review service not found');
    } else if (!error.response) {
      throw new Error('Cannot connect to review service - please try again later');
    }
    throw error.response?.data?.message || error.message || 'Failed to fetch reviews';
  }
};

// Create a service review
export const createServiceReview = async (reviewData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Ensure we have the required fields
    if (!reviewData.serviceId || !reviewData.rating || !reviewData.comment) {
      throw new Error('Missing required fields: service, rating, or comment');
    }

    const response = await axios.post(
      `${API_URL}/reviews`, 
      {
        serviceId: reviewData.serviceId,
        rating: parseInt(reviewData.rating),
        comment: reviewData.comment.trim()
      },
      {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error in createServiceReview:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Failed to create review');
  }
};

// Create a book review
export const createBookReview = async (bookId, reviewData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/books/${bookId}/reviews`, reviewData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update a service review
export const updateServiceReview = async (reviewId, reviewData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/reviews/services/${reviewId}`, reviewData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update a book review
export const updateBookReview = async (bookId, reviewId, reviewData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/books/${bookId}/reviews/${reviewId}`, reviewData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete a service review
export const deleteServiceReview = async (reviewId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/reviews/services/${reviewId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete a book review
export const deleteBookReview = async (bookId, reviewId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/books/${bookId}/reviews/${reviewId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get book reviews
export const getBookReviews = async (bookId) => {
  try {
    const response = await axios.get(`${API_URL}/books/${bookId}/reviews`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 