import { Router } from 'express';
import multer from 'multer';
import { editImage } from '../controllers/imageController';

const router = Router();

// Configure multer for memory storage (storing files in memory as Buffer)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

/**
 * POST /api/image/edit
 * Edit an image based on natural language instruction
 * 
 * Request can be either:
 * 1. multipart/form-data with 'image' file and 'instruction' text field
 * 2. JSON with 'image' (base64 string) and 'instruction' fields
 */
router.post('/edit', upload.single('image'), editImage);

export { router as imageRoutes };
