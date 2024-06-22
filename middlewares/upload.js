const multer = require('multer');
const path = require('path');

// Multer disk storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Destination folder
  },
  filename: function (req, file, cb) {
    // Rename the file with a timestamp to ensure uniqueness
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname); // Extract file extension
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// File filter for multer (optional)
const fileFilter = (req, file, cb) => {
  // Accept only certain file types
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('application/pdf')) {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDFs are allowed!'), false);
  }
};

// Multer upload middleware
const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;