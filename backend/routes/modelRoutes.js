const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs'); // Add this line
const { uploadModel, getModels } = require('../controllers/modelController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create uploads directory if it doesn't exist
    fs.mkdirSync('uploads', { recursive: true });
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

router.post('/', upload.single('model'), uploadModel);
router.get('/', getModels);
router.get('/export/:id', exportModel);
module.exports = router;