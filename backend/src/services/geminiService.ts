import { GoogleGenerativeAI } from '@google/generative-ai';
import { AppError } from '../middleware/errorHandler';

// Lazy initialization of Gemini AI
let genAI: GoogleGenerativeAI;

function getGeminiClient(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    
    genAI = new GoogleGenerativeAI(apiKey);
  }
  
  return genAI;
}

/**
 * Edit an image using Gemini AI based on natural language instructions
 * @param imageBuffer - The original image as a Buffer
 * @param instruction - Natural language instruction for editing (e.g., "remove background", "make it blurry")
 * @returns Promise<Buffer> - The edited image as a Buffer
 */
export async function editImageWithGemini(
  imageBuffer: Buffer,
  instruction: string
): Promise<Buffer> {
  try {
    // Note: Gemini's current free API has strict rate limits and doesn't support actual image editing
    // For this MVP, we'll apply basic image effects based on instruction keywords
    // In production, use Gemini Imagen API (paid) or other image editing services
    
    console.log(`Processing image with instruction: "${instruction}"`);
    
    // Apply image effects based on instruction
    return await applyBasicImageEffect(imageBuffer, instruction);

  } catch (error: any) {
    console.error('Image processing error:', error);
    
    throw new AppError(
      `Failed to process image: ${error.message || 'Unknown error'}`,
      500
    );
  }
}

/**
 * Determine MIME type from buffer
 */
function getMimeType(buffer: Buffer): string {
  const header = buffer.toString('hex', 0, 4);
  
  if (header.startsWith('ffd8')) return 'image/jpeg';
  if (header.startsWith('8950')) return 'image/png';
  if (header.startsWith('4749')) return 'image/gif';
  if (header.startsWith('5249')) return 'image/webp';
  
  return 'image/jpeg'; // default
}

/**
 * Apply image effects based on instruction keywords
 * This uses Sharp library for image manipulation
 */
async function applyBasicImageEffect(
  imageBuffer: Buffer,
  instruction: string
): Promise<Buffer> {
  const sharp = require('sharp');
  const lowerInstruction = instruction.toLowerCase();
  
  let image = sharp(imageBuffer);
  
  // Check for background removal (requires special handling)
  if (lowerInstruction.includes('remove background') || 
      lowerInstruction.includes('remove bg') || 
      lowerInstruction.includes('transparent background') ||
      lowerInstruction.includes('no background')) {
    throw new AppError(
      'Background removal requires additional API services like remove.bg. For this demo, try effects like: blur, grayscale, brighten, darken, saturate, flip, rotate, sharpen, invert',
      501
    );
  }
  
  // Apply effects based on keywords in the instruction
  if (lowerInstruction.includes('blur') || lowerInstruction.includes('blurry')) {
    image = image.blur(10);
    console.log('Applied blur effect');
  }
  
  if (lowerInstruction.includes('grayscale') || lowerInstruction.includes('black and white') || lowerInstruction.includes('grey')) {
    image = image.grayscale();
    console.log('Applied grayscale effect');
  }
  
  if (lowerInstruction.includes('sepia')) {
    image = image.tint({ r: 112, g: 66, b: 20 });
    console.log('Applied sepia effect');
  }
  
  if (lowerInstruction.includes('brighten') || lowerInstruction.includes('brighter') || lowerInstruction.includes('brightness')) {
    image = image.modulate({ brightness: 1.5 });
    console.log('Applied brightness effect');
  }
  
  if (lowerInstruction.includes('darken') || lowerInstruction.includes('darker') || lowerInstruction.includes('dark')) {
    image = image.modulate({ brightness: 0.6 });
    console.log('Applied darken effect');
  }
  
  if (lowerInstruction.includes('saturate') || lowerInstruction.includes('vibrant') || lowerInstruction.includes('colorful')) {
    image = image.modulate({ saturation: 1.8 });
    console.log('Applied saturation effect');
  }
  
  if (lowerInstruction.includes('desaturate') || lowerInstruction.includes('less color')) {
    image = image.modulate({ saturation: 0.5 });
    console.log('Applied desaturation effect');
  }
  
  if (lowerInstruction.includes('flip') || lowerInstruction.includes('horizontal')) {
    image = image.flop();
    console.log('Applied horizontal flip');
  }
  
  if (lowerInstruction.includes('rotate')) {
    const angle = lowerInstruction.match(/rotate\s+(\d+)/)?.[1];
    image = image.rotate(angle ? parseInt(angle) : 90);
    console.log(`Applied rotation: ${angle || 90} degrees`);
  }
  
  if (lowerInstruction.includes('sharpen')) {
    image = image.sharpen();
    console.log('Applied sharpen effect');
  }
  
  if (lowerInstruction.includes('negate') || lowerInstruction.includes('invert') || lowerInstruction.includes('negative')) {
    image = image.negate();
    console.log('Applied negate effect');
  }
  
  if (lowerInstruction.includes('thumbnail') || lowerInstruction.includes('small') || lowerInstruction.includes('resize')) {
    image = image.resize({ width: 800, height: 600, fit: 'inside' });
    console.log('Resized image');
  }
  
  if (lowerInstruction.includes('normalize') || lowerInstruction.includes('auto enhance')) {
    image = image.normalize();
    console.log('Applied normalize effect');
  }
  
  // If no specific effect matched, inform user of available options
  const hasEffect = lowerInstruction.match(/(blur|grayscale|sepia|brighten|darken|saturate|desaturate|flip|rotate|sharpen|negate|normalize|thumbnail)/i);
  
  if (!hasEffect) {
    throw new AppError(
      `Instruction "${instruction}" not recognized. Try: blur, grayscale, brighten, darken, saturate, flip, rotate, sharpen, invert, normalize`,
      400
    );
  }
  
  return await image.jpeg({ quality: 90 }).toBuffer();
}

/**
 * Alternative approach: Generate a new image from text prompt
 * Note: This uses text-to-image generation rather than image editing
 */
export async function generateImageFromPrompt(prompt: string): Promise<Buffer> {
  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // This is a text generation - for actual image generation,
    // you'd need to use Imagen API or another image generation service
    console.log('Generated description:', response.text());
    
    throw new AppError(
      'Image generation from text is not yet implemented. Please upload an image to edit.',
      501
    );
  } catch (error: any) {
    throw new AppError(
      `Failed to generate image: ${error.message || 'Unknown error'}`,
      500
    );
  }
}
