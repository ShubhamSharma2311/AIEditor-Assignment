# API Endpoints

## Base URL
`http://localhost:5000`

---

## Authentication Endpoints

### 1. Sign Up
**POST** `/api/auth/signup`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

### 2. Login
**POST** `/api/auth/login`

Login to existing account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

### 3. Get Profile
**GET** `/api/auth/profile`

Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2025-11-24T00:00:00.000Z"
  }
}
```

---

## Image Editing Endpoint

### 4. Edit Image
**POST** `/api/image/edit`

Edit an image with natural language instruction.

**Optional Authentication:** If `Authorization` header is present, the edit will be saved to user's history.

**Headers:**
```
Authorization: Bearer <jwt_token>  (optional)
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
- `image`: Image file (max 10MB)
- `instruction`: Text instruction (e.g., "remove background")

**Response:**
```json
{
  "success": true,
  "editedImage": "data:image/jpeg;base64,...",
  "metadata": {
    "instruction": "remove background",
    "modelUsed": "Gemini 1.5 Flash",
    "processedAt": "2025-11-24T00:00:00.000Z",
    "processingTime": 2500
  }
}
```

---

## Edit History Endpoints (All require authentication)

### 5. Get Edit History
**GET** `/api/history?limit=20&skip=0`

Get user's edit history with pagination.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `limit`: Number of records to return (default: 20)
- `skip`: Number of records to skip (default: 0)

**Response:**
```json
{
  "history": [
    {
      "_id": "edit_id",
      "userId": "user_id",
      "originalImageUrl": "data:image/jpeg;base64,...",
      "editedImageUrl": "data:image/jpeg;base64,...",
      "instruction": "remove background",
      "timestamp": "2025-11-24T00:00:00.000Z",
      "metadata": {
        "modelUsed": "Gemini 1.5 Flash",
        "processingTime": 2500
      }
    }
  ],
  "total": 50,
  "hasMore": true
}
```

---

### 6. Get Single Edit
**GET** `/api/history/:id`

Get a specific edit by ID.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "edit": {
    "_id": "edit_id",
    "userId": "user_id",
    "originalImageUrl": "data:image/jpeg;base64,...",
    "editedImageUrl": "data:image/jpeg;base64,...",
    "instruction": "remove background",
    "timestamp": "2025-11-24T00:00:00.000Z",
    "metadata": {
      "modelUsed": "Gemini 1.5 Flash",
      "processingTime": 2500
    }
  }
}
```

---

### 7. Delete Edit
**DELETE** `/api/history/:id`

Delete a specific edit from history.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "Edit deleted successfully"
}
```

---

### 8. Clear All History
**DELETE** `/api/history`

Clear all edit history for the user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "Edit history cleared successfully"
}
```

---

## Error Responses

All endpoints return error responses in this format:

```json
{
  "error": "Error message here",
  "details": "Additional details (optional)"
}
```

Common HTTP status codes:
- `400`: Bad Request (invalid input)
- `401`: Unauthorized (missing or invalid token)
- `403`: Forbidden (expired token)
- `404`: Not Found
- `409`: Conflict (e.g., email already exists)
- `500`: Internal Server Error
