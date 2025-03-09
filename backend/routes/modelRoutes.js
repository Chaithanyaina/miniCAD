import express from 'express';
import multer from 'multer';
import { uploadModel, getModels, exportModel } from '../controllers/modelController.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

router.post('/', upload.single('model'), uploadModel);
router.get('/', getModels);
router.get('/export/:id', exportModel);

export default router;