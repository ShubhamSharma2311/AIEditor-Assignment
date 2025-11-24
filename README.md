# AI-Powered Natural Language Image Editor

## Overview

This is a full-stack web application that enables users to edit images using natural language instructions. The system processes user commands such as "blur the image", "make it grayscale", or "brighten the image" and applies the corresponding transformations. Built with modern web technologies, this project demonstrates the integration of image processing capabilities with a user-friendly interface, complete with authentication and edit history tracking.

## Tech Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcrypt
- **Image Processing**: Sharp library
- **API Documentation**: Swagger (OpenAPI 3.0)
- **File Upload**: Multer
- **Additional Libraries**: cors, cookie-parser, dotenv

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **State Management**: React Context API

### Development Tools
- TypeScript compiler
- ESLint for code quality
- ts-node-dev for development server

## Backend Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # MongoDB connection configuration
│   │   └── swagger.ts            # Swagger/OpenAPI specification
│   ├── controllers/
│   │   ├── authController.ts     # Authentication logic (signup, login, logout)
│   │   ├── historyController.ts  # Edit history CRUD operations
│   │   └── imageController.ts    # Image editing controller
│   ├── middleware/
│   │   ├── auth.ts               # JWT authentication middleware
│   │   └── errorHandler.ts       # Global error handling middleware
│   ├── models/
│   │   ├── EditHistory.ts        # Edit history schema
│   │   └── User.ts               # User schema with password hashing
│   ├── routes/
│   │   ├── authRoutes.ts         # Authentication endpoints
│   │   ├── historyRoutes.ts      # History endpoints
│   │   └── imageRoutes.ts        # Image editing endpoints
│   ├── services/
│   │   └── geminiService.ts      # Image processing service with Sharp
│   ├── types/
│   │   └── index.d.ts            # TypeScript type definitions
│   ├── app.ts                    # Express application configuration
│   └── index.ts                  # Application entry point
├── .env                          # Environment variables (not in repo)
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── API_DOCUMENTATION.md          # Detailed API documentation
└── README.md                     # Backend setup instructions
```

## Frontend Folder Structure

```
frontend/
├── public/                       # Static assets
├── src/
│   ├── assets/                   # Images, icons, and other assets
│   ├── components/
│   │   ├── ErrorAlert.tsx        # Error display component
│   │   ├── ImageEditor.tsx       # Main image editing interface
│   │   ├── ImagePreview.tsx      # Before/after image comparison
│   │   └── Loader.tsx            # Loading spinner component
│   ├── contexts/
│   │   └── AuthContext.tsx       # Authentication state management
│   ├── hooks/
│   │   └── useAuth.ts            # Custom authentication hook
│   ├── lib/
│   │   └── api.ts                # Axios instance and API functions
│   ├── pages/
│   │   ├── History.tsx           # Edit history page
│   │   ├── Home.tsx              # Landing page with image editor
│   │   ├── Login.tsx             # User login page
│   │   └── Signup.tsx            # User registration page
│   ├── App.css                   # Application styles
│   ├── App.tsx                   # Root component with routing
│   ├── index.css                 # Global styles with Tailwind
│   └── main.tsx                  # Application entry point
├── .gitignore                    # Git ignore rules
├── eslint.config.js              # ESLint configuration
├── index.html                    # HTML template
├── package.json                  # Dependencies and scripts
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── tsconfig.app.json             # App-specific TypeScript config
├── tsconfig.node.json            # Node-specific TypeScript config
└── vite.config.ts                # Vite build configuration
```

## Database Schema

### User Model
```typescript
{
  email: String (required, unique, validated)
  password: String (required, hashed with bcrypt)
  name: String (required)
  createdAt: Date (default: now)
}
```

**Methods:**
- `comparePassword(candidatePassword)`: Validates password against hashed version

**Hooks:**
- Pre-save: Automatically hashes password before storing

### EditHistory Model
```typescript
{
  userId: ObjectId (required, indexed, references User)
  originalImageUrl: String (required, base64 encoded)
  editedImageUrl: String (required, base64 encoded)
  instruction: String (required)
  timestamp: Date (default: now, indexed)
  metadata: {
    modelUsed: String (optional)
    processingTime: Number (optional, in milliseconds)
  }
}
```

**Indexes:**
- Single index on `userId` for user-based queries
- Single index on `timestamp` for chronological sorting
- Compound index on `userId + timestamp` for optimized history retrieval

## Backend Setup

### Prerequisites
- Node.js v18 or higher
- MongoDB Atlas account or local MongoDB instance
- Git

### Installation Steps

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```bash
PORT=5000
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/AIEditor
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

6. Start production server:
```bash
npm start
```

The backend server will run on `http://localhost:5000`

### API Endpoints

Access the interactive API documentation at: `http://localhost:5000/api-docs`

**Authentication Endpoints:**
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

**Image Editing Endpoints:**
- `POST /api/image/edit` - Edit image with natural language instruction

**History Endpoints:**
- `GET /api/history` - Get user's edit history
- `GET /api/history/:id` - Get specific edit by ID
- `DELETE /api/history/:id` - Delete specific edit
- `DELETE /api/history` - Clear all history

### Swagger API Documentation

![Swagger API Documentation](./frontend/src/assets/swagger.png)

The Swagger UI provides interactive API documentation where you can test all endpoints directly from the browser. Access it at `/api-docs` when the server is running.

## Frontend Setup

### Prerequisites
- Node.js v18 or higher
- Backend server running

### Installation Steps

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```bash
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

6. Preview production build:
```bash
npm run preview
```

The frontend application will run on `http://localhost:5173`

### Available Image Effects

The application supports the following image transformations:
- Blur effect
- Grayscale conversion
- Brightness adjustment (brighten/darken)
- Saturation control (saturate/desaturate)
- Horizontal flip
- Rotation (90 degrees or custom angle)
- Sharpen filter
- Color inversion
- Normalization
- Resize/thumbnail generation

## Conclusion

This AI-Powered Natural Language Image Editor demonstrates a complete full-stack application with modern web development practices. The system successfully implements user authentication, image processing capabilities, and persistent storage of edit history. Built with TypeScript for type safety and maintainability, the application provides a robust foundation that can be extended with additional image processing features or AI capabilities in the future. The modular architecture and comprehensive API documentation make it easy to understand, maintain, and scale the application as requirements evolve.
