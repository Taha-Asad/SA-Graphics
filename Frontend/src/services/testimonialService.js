import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/testimonials';

// Get all testimonials (admin only)
export const getAllTestimonials = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(`${API_URL}/all`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Debug log
    console.log('Raw API Response:', response);

    // Handle different response formats
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.testimonials && Array.isArray(response.data.testimonials)) {
      return response.data.testimonials;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.error('Unexpected response format:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error in getAllTestimonials:', error.response || error);
    if (error.response?.status === 401) {
      throw new Error('Please login to access testimonials');
    } else if (error.response?.status === 403) {
      throw new Error('You do not have permission to access testimonials');
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch testimonials');
  }
};

// Approve testimonial
export const approveTestimonial = async (testimonialId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.patch(
      `${API_URL}/${testimonialId}/approve`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error in approveTestimonial:', error.response || error);
    throw new Error(error.response?.data?.message || 'Failed to approve testimonial');
  }
};

// Reject testimonial
export const rejectTestimonial = async (testimonialId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.patch(
      `${API_URL}/${testimonialId}/reject`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error in rejectTestimonial:', error.response || error);
    throw new Error(error.response?.data?.message || 'Failed to reject testimonial');
  }
};

// Delete testimonial
export const deleteTestimonial = async (testimonialId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.delete(`${API_URL}/${testimonialId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error in deleteTestimonial:', error.response || error);
    throw new Error(error.response?.data?.message || 'Failed to delete testimonial');
  }
}; 