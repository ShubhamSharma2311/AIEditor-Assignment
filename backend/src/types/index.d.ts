// Type definitions for the project

export interface ImageEditRequest {
  image: string | Buffer; // base64 string or Buffer
  instruction: string;
}

export interface ImageEditResponse {
  success: boolean;
  editedImage: string; // base64 data URL
  metadata: {
    instruction: string;
    modelUsed: string;
    processedAt: string;
  };
}

export interface ErrorResponse {
  error: string;
  status: 'error';
}
