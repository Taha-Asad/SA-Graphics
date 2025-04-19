// Get the base URL for API requests
const baseUrl = import.meta.env.DEV 
  ? 'http://localhost:5000'
  : import.meta.env.VITE_API_URL;

/**
 * Utility function to resolve image URLs consistently across the application
 * @param {string} imagePath - The image path to resolve
 * @returns {string} The resolved image URL
 */
export const resolveImageUrl = (imagePath) => {
  if (!imagePath) {
    return '/images/placeholder-course.jpg';
  }

  // If it's a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If it's a local system path, return as is
  if (imagePath.startsWith('file://')) {
    return imagePath;
  }

  // If it's a path from the uploads folder
  if (imagePath.startsWith('uploads/') || imagePath.startsWith('/uploads/')) {
    const cleanPath = imagePath.replace(/^\/+/, '');
    return `${baseUrl}/${cleanPath}`;
  }

  // If it's a relative path in the public folder
  if (imagePath.startsWith('images/') || imagePath.startsWith('/images/')) {
    const cleanPath = imagePath.replace(/^\/+/, '');
    return `/${cleanPath}`;
  }

  // Default case: assume it's a relative path in the public/courses folder
  return `/images/courses/${imagePath}`;
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