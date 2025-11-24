import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Image Editor API',
      version: '1.0.0',
      description: 'API for AI-powered natural language image editing using Gemini AI',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            name: { type: 'string', example: 'John Doe' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        EditHistory: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            userId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            originalImageUrl: { type: 'string', example: 'data:image/jpeg;base64,...' },
            editedImageUrl: { type: 'string', example: 'data:image/jpeg;base64,...' },
            instruction: { type: 'string', example: 'remove background' },
            timestamp: { type: 'string', format: 'date-time' },
            metadata: {
              type: 'object',
              properties: {
                modelUsed: { type: 'string', example: 'Gemini 1.5 Flash' },
                processingTime: { type: 'number', example: 2500 }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Error message' },
            details: { type: 'string', example: 'Additional error details' }
          }
        }
      }
    },
    tags: [
      { name: 'Authentication', description: 'User authentication endpoints' },
      { name: 'Image Editing', description: 'AI-powered image editing' },
      { name: 'History', description: 'Edit history management' }
    ]
  },
  apis: ['./src/routes/*.ts'] // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options);
