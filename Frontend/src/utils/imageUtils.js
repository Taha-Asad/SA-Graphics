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
  console.log('resolveImageUrl input:', imagePath); // Debug log

  if (!imagePath) {
    console.log('No image path provided, using placeholder');
    return '/images/placeholder-course.jpg';
  }

  // If it's a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    console.log('Full URL detected, returning as is:', imagePath);
    return imagePath;
  }

  // If it's a local system path, return as is
  if (imagePath.startsWith('file://')) {
    console.log('Local file path detected, returning as is:', imagePath);
    return imagePath;
  }

  // Remove any leading slashes and normalize the path
  const cleanPath = imagePath.replace(/^\/+/, '').replace(/\\/g, '/');
  console.log('Cleaned path:', cleanPath);

  // If it's a path from the uploads folder (with or without leading slash)
  if (cleanPath.startsWith('uploads/')) {
    const fullUrl = `${baseUrl}/${cleanPath}`;
    console.log('Uploads path detected, returning full URL:', fullUrl);
    return fullUrl;
  }

  // If it's a relative path in the public folder
  if (cleanPath.startsWith('images/')) {
    console.log('Public images path detected, returning as is:', `/${cleanPath}`);
    return `/${cleanPath}`;
  }

  // Default case: assume it's a relative path that needs the base URL
  const fullUrl = `${baseUrl}/uploads/${cleanPath}`;
  console.log('Default case: returning full URL:', fullUrl);
  return fullUrl;
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