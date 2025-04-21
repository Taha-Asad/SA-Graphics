const multer = require('multer');
const path = require('path');
const fs = require('fs');
const createError = require('http-errors');

// Define uploads folder relative to project root
const UPLOADS_FOLDER = 'uploads';
const UPLOAD_PATH = path.join(__dirname, '..', UPLOADS_FOLDER);

// Ensure the uploads folder exists
try {
  if (!fs.existsSync(UPLOAD_PATH)) {
    fs.mkdirSync(UPLOAD_PATH, { recursive: true });
    console.log(`Created uploads directory at: ${UPLOAD_PATH}`);
  } else {
    console.log(`Uploads directory exists at: ${UPLOAD_PATH}`);
  }
} catch (error) {
  console.error('Error creating uploads directory:', error);
  throw new Error(`Failed to create uploads directory: ${error.message}`);
}

// Create storage engine for different types of uploads
const createStorage = (subFolder) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(UPLOAD_PATH, subFolder);
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
        console.log(`Created ${subFolder} directory at: ${uploadPath}`);
      }
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExtension = path.extname(file.originalname).toLowerCase();
      const filename = `${subFolder}-${uniqueSuffix}${fileExtension}`;
      cb(null, filename);
    }
  });
};

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(createError(400, 'Only image files (jpg, jpeg, png, gif) are allowed!'));
};

// Create multer upload instances for different purposes
const courseUpload = multer({
  storage: createStorage('courses'),
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only allow 1 file per request
  }
});

const paymentProofUpload = multer({
  storage: createStorage('payment-proofs'),
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only allow 1 file per request
  }
});

const profileUpload = multer({
  storage: createStorage('profiles'),
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit for profile photos
    files: 1
  }
});

// For backward compatibility
const upload = profileUpload; // This ensures existing code using 'upload' still works

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Maximum size is 5MB' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files uploaded. Maximum is 1 file' });
    }
    return res.status(400).json({ message: err.message });
  }
  next(err);
};

// Create required directories
const requiredDirs = ['courses', 'payment-proofs', 'profiles'];
requiredDirs.forEach(dir => {
  const dirPath = path.join(UPLOAD_PATH, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created ${dir} directory at: ${dirPath}`);
  }
});

module.exports = {
  courseUpload,
  paymentProofUpload,
  profileUpload,
  upload, // For backward compatibility
  handleMulterError,
  UPLOADS_FOLDER,
  UPLOAD_PATH
};
