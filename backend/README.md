# AI Image Editor - Backend

Backend for AI-Powered Natural-Language Image Editor

## 🚀 Quick Deploy on Render

### Step 1: Prepare MongoDB (Required for User Auth & History)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)
2. Create a cluster
3. Create a database user
4. Whitelist all IPs: `0.0.0.0/0` (for Render access)
5. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/AIEditor`

### Step 2: Deploy to Render

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository
5. Configure:

**Basic Settings:**
- **Name**: `ai-image-editor-backend`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

**Environment Variables** (Click "Add Environment Variable"):
```
PORT=5000
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/AIEditor
JWT_SECRET=your_long_random_secret_key_minimum_32_characters
FRONTEND_URL=https://your-frontend-url.vercel.app
NODE_ENV=production
```

6. Click **"Create Web Service"**

### Step 3: Get Your Backend URL

After deployment (takes 2-3 minutes), you'll get:
```
https://ai-image-editor-backend.onrender.com
```

Use this in your frontend `.env`:
```
VITE_API_URL=https://ai-image-editor-backend.onrender.com
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
