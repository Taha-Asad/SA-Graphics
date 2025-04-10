import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1';

// Create axios instance with auth header
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Dashboard statistics
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// User management
export const getUsers = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const blockUser = async (userId) => {
  try {
    const response = await api.patch(`/admin/users/${userId}/block`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const unblockUser = async (userId) => {
  try {
    const response = await api.patch(`/admin/users/${userId}/unblock`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Order management
export const getOrders = async (page = 1, limit = 10, status = '') => {
  try {
    const response = await api.get(`/admin/orders?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.patch(`/admin/orders/${orderId}/status`, { status });
    if (response.data.status === 'success') {
      return response.data;
    }
    throw new Error(response.data.message || 'Failed to update order status');
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error.response?.data?.message || error.message || 'Failed to update order status';
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const response = await api.delete(`/admin/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Review management
export const getReviews = async (page = 1, limit = 10, status = '') => {
  try {
    const response = await api.get(`/admin/reviews?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateReviewStatus = async (reviewId, status) => {
  try {
    const response = await api.patch(`/admin/reviews/${reviewId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const response = await api.delete(`/admin/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 