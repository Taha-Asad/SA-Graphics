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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_PATH);
  },
  filename: function (req, file, cb) {
    // Create a unique filename with timestamp and random number
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, uniqueSuffix + fileExtension);
  }
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(createError(400, 'Only image files (jpg, jpeg, png, gif) are allowed!'));
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only allow 1 file per request
  }
});

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

module.exports = {
  upload,
  handleMulterError,
  UPLOADS_FOLDER,
  UPLOAD_PATH
};
