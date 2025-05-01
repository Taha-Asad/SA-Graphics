const path = require('path');
const fs = require('fs');

/**
 * Resolves an image path to a URL that can be used in the frontend
 * @param {string} imagePath - The path to the image (can be relative or absolute)
 * @returns {string} - The resolved URL without leading slash for consistency
 */
const resolveImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'images/placeholder.jpg';
  }

  // If it's already a full URL, return it
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If it's a local system path, convert it to a URL
  if (imagePath.startsWith('file://')) {
    return imagePath;
  }

  // Clean up the path to ensure consistent format
  const cleanPath = imagePath.replace(/^\/+/, '').replace(/\\/g, '/');

  // If it's in the uploads directory, return the clean path
  if (cleanPath.includes('uploads/')) {
    return cleanPath;
  }

  // Default case: assume it's a relative path in the uploads directory
  return `uploads/${cleanPath}`;
};

/**
 * Saves an uploaded file to the uploads directory
 * @param {Object} file - The uploaded file object
 * @param {string} subdirectory - The subdirectory to save the file in (e.g., 'courses', 'profile')
 * @returns {string} - The path where the file was saved
 */
const saveUploadedFile = (file, subdirectory) => {
  const uploadDir = path.join(__dirname, '..', 'uploads', subdirectory);

  // Ensure directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Generate unique filename
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);

  // Save to uploads directory
  const uploadPath = path.join(uploadDir, filename);
  fs.copyFileSync(file.path, uploadPath);

  // Return the path relative to the uploads directory
  return `uploads/${subdirectory}/${filename}`;
};

module.exports = {
  resolveImageUrl,
  saveUploadedFile
}; 