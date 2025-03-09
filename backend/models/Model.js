import mongoose from 'mongoose';

const ModelSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalname: { type: String, required: true },
  cloudinaryUrl: { type: String, required: true },
  publicId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Model', ModelSchema);