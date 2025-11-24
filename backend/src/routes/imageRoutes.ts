import { Router } from 'express';
import multer from 'multer';
import { editImage } from '../controllers/imageController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Optional authentication middleware - adds userId if token is present
const optionalAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const cookieToken = req.cookies?.token;
  
  if (authHeader || cookieToken) {
    // If token is present (in header or cookie), verify it
    authenticateToken(req, res, next);
  } else {
    // If no token, continue without auth
    next();
  }
};

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
 * @swagger
 * /api/image/edit:
 *   post:
 *     summary: Edit an image using natural language instructions
 *     tags: [Image Editing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *               - instruction
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file (max 10MB)
 *               instruction:
 *                 type: string
 *                 example: remove background
 *                 description: Natural language instruction for editing
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *               - instruction
 *             properties:
 *               image:
 *                 type: string
 *                 example: data:image/jpeg;base64,/9j/4AAQSkZJRg...
 *                 description: Base64 encoded image
 *               instruction:
 *                 type: string
 *                 example: remove background
 *     responses:
 *       200:
 *         description: Image edited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 editedImage:
 *                   type: string
 *                   example: data:image/jpeg;base64,/9j/4AAQSkZJRg...
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     instruction:
 *                       type: string
 *                       example: remove background
 *                     modelUsed:
 *                       type: string
 *                       example: Gemini 1.5 Flash
 *                     processedAt:
 *                       type: string
 *                       format: date-time
 *                     processingTime:
 *                       type: number
 *                       example: 2500
 *       400:
 *         description: Bad request - missing or invalid input
 *       500:
 *         description: Image editing failed
 */
router.post('/edit', optionalAuth, upload.single('image'), editImage);

export { router as imageRoutes };
