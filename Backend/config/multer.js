const multer = require('multer');
const path = require('path');
const fs = require('fs');
const createError = require('http-errors');

// Define uploads folder relative to project root
const UPLOADS_FOLDER = 'uploads';
const UPLOAD_PATH = path.join(__dirname, '..', UPLOADS_FOLDER);

// Ensure the uploads folder exists
if (!fs.existsSync(UPLOAD_PATH)) {
  fs.mkdirSync(UPLOAD_PATH, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_PATH);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
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

// Export the upload instance and folder name
module.exports = {
  upload,
  UPLOADS_FOLDER
};
