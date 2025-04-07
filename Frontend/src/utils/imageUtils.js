// Check if we're in development or production
const baseUrl = import.meta.env.DEV 
  ? 'http://localhost:5000'
  : import.meta.env.VITE_API_URL;

export const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/300x200?text=No+Image';
  return imagePath.startsWith('http') 
    ? imagePath 
    : `http://localhost:5000${imagePath}`;
};

// Helper function to check if URL is valid
export const isValidImageUrl = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}; 