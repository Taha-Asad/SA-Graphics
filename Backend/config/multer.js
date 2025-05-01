const multer = require('multer');
const path = require('path');
const fs = require('fs');
const createError = require('http-errors');

// Define uploads folder structure
const UPLOADS_FOLDER = 'uploads';  // Changed from 'public/uploads' to match actual structure
const UPLOAD_PATH = path.join(__dirname, '..', UPLOADS_FOLDER);
const BOOKS_FOLDER = path.join(UPLOADS_FOLDER, 'books');
const BOOKS_PATH = path.join(__dirname, '..', BOOKS_FOLDER);
const PROFILES_FOLDER = path.join(UPLOADS_FOLDER, 'profiles');
const PROFILES_PATH = path.join(__dirname, '..', PROFILES_FOLDER);
const PROJECTS_FOLDER = path.join(UPLOADS_FOLDER, 'projects');
const PROJECTS_PATH = path.join(__dirname, '..', PROJECTS_FOLDER);
const PAYMENT_PROOFS_FOLDER = path.join(UPLOADS_FOLDER, 'payment-proofs');
const PAYMENT_PROOFS_PATH = path.join(__dirname, '..', PAYMENT_PROOFS_FOLDER);

// Ensure all upload folders exist
try {
  [
    UPLOAD_PATH,
    BOOKS_PATH,
    PROFILES_PATH,
    PROJECTS_PATH,
    PAYMENT_PROOFS_PATH
  ].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory at: ${dir}`);
    }
  });
} catch (error) {
  console.error('Error creating directories:', error);
  throw new Error(`Failed to create directories: ${error.message}`);
}

// Storage configuration for books
const bookStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, BOOKS_PATH);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, uniqueSuffix + ext);
  }
});

// Storage configuration for profiles
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, PROFILES_PATH);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'profiles-' + uniqueSuffix + ext);
  }
});

// Storage configuration for projects
const projectStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, PROJECTS_PATH);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, uniqueSuffix + ext);  // Removed 'project-' prefix to match existing files
  }
});

// Storage configuration for payment proofs
const paymentProofStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, PAYMENT_PROOFS_PATH);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(createError(400, 'Only image files (jpg, jpeg, png, gif) are allowed!'));
};

// Upload middlewares for different types
const bookUpload = multer({
  storage: bookStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const profileUpload = multer({
  storage: profileStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const projectUpload = multer({
  storage: projectStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const paymentProofUpload = multer({
  storage: paymentProofStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Error handling middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Maximum size is 5MB' });
    }
    return res.status(400).json({ message: err.message });
  }
  next(err);
};

module.exports = {
  bookUpload,
  profileUpload,
  projectUpload,
  paymentProofUpload,
  handleMulterError,
  UPLOADS_FOLDER,
  UPLOAD_PATH,
  BOOKS_FOLDER,
  BOOKS_PATH,
  PROFILES_FOLDER,
  PROFILES_PATH,
  PROJECTS_FOLDER,
  PROJECTS_PATH,
  PAYMENT_PROOFS_FOLDER,
  PAYMENT_PROOFS_PATH
};