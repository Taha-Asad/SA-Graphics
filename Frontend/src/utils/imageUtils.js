// Check if we're in development or production
const baseUrl = import.meta.env.DEV 
  ? 'http://localhost:5000'
  : import.meta.env.VITE_API_URL;

export const getImageUrl = (filename) => {
  if (!filename) return '';
  
  // Remove any leading slashes from filename
  const cleanFilename = filename.replace(/^\/+/, '');
  
  // Construct the full URL
  return `${baseUrl}/uploads/${cleanFilename}`;
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