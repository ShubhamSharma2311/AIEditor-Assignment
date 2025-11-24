# AI Image Editor - Backend

Backend for AI-Powered Natural-Language Image Editor

## Deployment on Render

This backend is ready to deploy on Render with zero configuration!

### Environment Variables Required:

```
PORT=5000
DATABASE_URL=your_mongodb_connection_string (optional)
GEMINI_API_KEY=your_gemini_api_key (optional - only if using Gemini AI)
JWT_SECRET=your_secret_key_here
NODE_ENV=production
```

### Build Command:
```
npm install && npm run build
```

### Start Command:
```
npm start
```

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
PORT=5000
DATABASE_URL=mongodb://localhost:27017/ai-image-editor
JWT_SECRET=your_secret_key
```

3. Run in development mode:
```bash
npm run dev
```

## API Endpoints

- `GET /health` - Health check
- `GET /api-docs` - Swagger API documentation
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `POST /api/image/edit` - Edit image with AI
- `GET /api/history` - Get edit history
- `DELETE /api/history/:id` - Delete specific edit
- `DELETE /api/history` - Clear all history

## Available Image Effects

- Blur
- Grayscale
- Brighten / Darken
- Saturate / Desaturate
- Flip (horizontal)
- Rotate
- Sharpen
- Invert colors
- Normalize
- Resize / Thumbnail
