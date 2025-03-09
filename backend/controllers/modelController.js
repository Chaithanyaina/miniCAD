import Model from '../models/Model.js';
import cloudinary from 'cloudinary';

// Upload model to Cloudinary
export const uploadModel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary with Promise
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          resource_type: 'raw',
          public_id: `models/${Date.now()}-${req.file.originalname}`
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Save model metadata
    const newModel = new Model({
      filename: req.file.originalname,
      originalname: req.file.originalname,
      cloudinaryUrl: result.secure_url,
      publicId: result.public_id,
    });

    await newModel.save();
    res.status(201).json(newModel);

  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ 
      message: 'Failed to upload file',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Get all models
export const getModels = async (req, res) => {
  try {
    const models = await Model.find().sort({ createdAt: -1 });
    res.json(models);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ 
      message: 'Failed to fetch models',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Export model
export const exportModel = async (req, res) => {
  try {
    const model = await Model.findById(req.params.id);
    
    if (!model?.cloudinaryUrl) {
      return res.status(404).json({ message: 'Model not found' });
    }

    // Redirect to Cloudinary download URL
    res.redirect(model.cloudinaryUrl.replace('/upload/', '/upload/fl_attachment/'));

  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({ 
      message: 'Export failed',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};