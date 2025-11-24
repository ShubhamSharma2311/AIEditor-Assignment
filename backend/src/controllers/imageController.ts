import { Request, Response, NextFunction } from 'express';
import { editImageWithGemini } from '../services/geminiService';
import { AppError } from '../middleware/errorHandler';
import { EditHistory } from '../models/EditHistory';
import { AuthRequest } from '../middleware/auth';

/**
 * Controller to handle image editing requests
 */
export const editImage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  
  try {
    // Get instruction from request body
    const { instruction } = req.body;

    // Validate instruction
    if (!instruction || typeof instruction !== 'string' || instruction.trim().length === 0) {
      throw new AppError('Instruction is required and must be a non-empty string', 400);
    }

    // Get image from request
    // Support both file upload (via multer) and base64 in body
    let imageBuffer: Buffer;

    if (req.file) {
      // Image uploaded as multipart/form-data
      imageBuffer = req.file.buffer;
    } else if (req.body.image) {
      // Image provided as base64 string
      const base64Data = req.body.image.replace(/^data:image\/\w+;base64,/, '');
      imageBuffer = Buffer.from(base64Data, 'base64');
    } else {
      throw new AppError('Image is required (either as file upload or base64 string)', 400);
    }

    // Validate image size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (imageBuffer.length > maxSize) {
      throw new AppError('Image size exceeds maximum allowed size of 10MB', 400);
    }

    // Call Gemini service to edit the image
    console.log(`Processing image edit request with instruction: "${instruction}"`);
    const editedImageBuffer = await editImageWithGemini(imageBuffer, instruction);

    // Convert original image to base64 for storage
    const originalImageBase64 = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
    
    // Convert edited image to base64 for response
    const editedImageBase64 = `data:image/jpeg;base64,${editedImageBuffer.toString('base64')}`;

    const processingTime = Date.now() - startTime;

    // Save to edit history if user is authenticated
    if (req.userId) {
      try {
        await EditHistory.create({
          userId: req.userId,
          originalImageUrl: originalImageBase64,
          editedImageUrl: editedImageBase64,
          instruction,
          metadata: {
            modelUsed: 'Gemini 1.5 Flash',
            processingTime
          }
        });
      } catch (historyError) {
        console.error('Failed to save edit history:', historyError);
        // Don't fail the request if history save fails
      }
    }

    // Return success response
    res.json({
      success: true,
      editedImage: editedImageBase64,
      metadata: {
        instruction: instruction,
        modelUsed: 'Gemini 1.5 Flash',
        processedAt: new Date().toISOString(),
        processingTime
      }
    });

  } catch (error) {
    // Pass error to error handling middleware
    next(error);
  }
};
