# API Documentation

This document provides comprehensive API documentation for the Digital Psychological Intervention System.

## 🔗 Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## 🔐 Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📚 API Endpoints

### Authentication Endpoints

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "studentId": "STU001",
  "email": "student@college.edu",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "college": "Engineering",
  "department": "Computer Science",
  "year": "3rd Year",
  "phone": "+1234567890",
  "preferredLanguage": "en"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "studentId": "STU001",
    "email": "student@college.edu",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student",
    "college": "Engineering",
    "department": "Computer Science",
    "year": "3rd Year"
  }
}
```

#### POST /auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "student@college.edu",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "studentId": "STU001",
    "email": "student@college.edu",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student",
    "college": "Engineering",
    "department": "Computer Science",
    "year": "3rd Year",
    "preferredLanguage": "en"
  }
}
```

#### GET /auth/profile
Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "user-id",
  "studentId": "STU001",
  "email": "student@college.edu",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student",
  "college": "Engineering",
  "department": "Computer Science",
  "year": "3rd Year",
  "phone": "+1234567890",
  "preferredLanguage": "en",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### PUT /auth/profile
Update user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "preferredLanguage": "hi"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "user-id",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "preferredLanguage": "hi"
  }
}
```

### Chat Endpoints

#### POST /chat/start
Start a new chat session.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "userId": "user-id"
}
```

**Response:**
```json
{
  "message": "Chat session started",
  "sessionId": "session_1234567890_abc123",
  "chatSession": {
    "userId": "user-id",
    "sessionId": "session_1234567890_abc123",
    "messages": [],
    "status": "active",
    "riskLevel": "low",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /chat/message
Send a message in chat session.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "sessionId": "session_1234567890_abc123",
  "message": "I'm feeling anxious about my exams",
  "userId": "user-id"
}
```

**Response:**
```json
{
  "message": "Message sent successfully",
  "userMessage": {
    "sender": "user",
    "content": "I'm feeling anxious about my exams",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "messageType": "text"
  },
  "aiMessage": {
    "sender": "ai",
    "content": "I understand you're feeling anxious. Let's try some breathing exercises together...",
    "timestamp": "2024-01-01T00:00:01.000Z",
    "messageType": "text",
    "metadata": {
      "confidence": 0.8,
      "suggestedActions": ["breathing_exercise", "grounding_technique", "schedule_appointment"]
    }
  },
  "riskLevel": "low",
  "status": "active"
}
```

#### GET /chat/history/:sessionId
Get chat history for a session.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "userId": "user-id",
  "sessionId": "session_1234567890_abc123",
  "messages": [
    {
      "sender": "user",
      "content": "I'm feeling anxious about my exams",
      "timestamp": "2024-01-01T00:00:00.000Z",
      "messageType": "text"
    },
    {
      "sender": "ai",
      "content": "I understand you're feeling anxious...",
      "timestamp": "2024-01-01T00:00:01.000Z",
      "messageType": "text",
      "metadata": {
        "confidence": 0.8,
        "suggestedActions": ["breathing_exercise", "grounding_technique"]
      }
    }
  ],
  "status": "active",
  "riskLevel": "low",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### GET /chat/sessions/:userId
Get user's chat sessions.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "userId": "user-id",
    "sessionId": "session_1234567890_abc123",
    "status": "active",
    "riskLevel": "low",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### POST /chat/escalate
Escalate chat to counselor.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "sessionId": "session_1234567890_abc123",
  "counselorId": "counselor-id",
  "reason": "User expressing suicidal thoughts"
}
```

**Response:**
```json
{
  "message": "Chat escalated to counselor successfully",
  "chatSession": {
    "sessionId": "session_1234567890_abc123",
    "status": "escalated",
    "escalatedTo": "counselor-id",
    "riskLevel": "high"
  }
}
```

### Appointment Endpoints

#### GET /appointments/counselors
Get list of available counselors.

**Response:**
```json
[
  {
    "_id": "counselor-id",
    "firstName": "Dr. Jane",
    "lastName": "Smith",
    "email": "jane.smith@college.edu",
    "phone": "+1234567890",
    "department": "Psychology"
  }
]
```

#### GET /appointments/availability/:counselorId
Get available time slots for a counselor.

**Query Parameters:**
- `date`: Date in YYYY-MM-DD format

**Response:**
```json
[
  {
    "time": "2024-01-15T09:00:00.000Z",
    "displayTime": "09:00 AM"
  },
  {
    "time": "2024-01-15T10:00:00.000Z",
    "displayTime": "10:00 AM"
  }
]
```

#### POST /appointments/book
Book a new appointment.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "studentId": "user-id",
  "counselorId": "counselor-id",
  "appointmentDate": "2024-01-15T09:00:00.000Z",
  "reason": "Anxiety and stress management",
  "type": "individual",
  "mode": "in-person",
  "priority": "medium"
}
```

**Response:**
```json
{
  "message": "Appointment booked successfully",
  "appointment": {
    "_id": "appointment-id",
    "studentId": "user-id",
    "counselorId": "counselor-id",
    "appointmentDate": "2024-01-15T09:00:00.000Z",
    "duration": 60,
    "status": "scheduled",
    "type": "individual",
    "mode": "in-person",
    "reason": "Anxiety and stress management",
    "priority": "medium",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /appointments/student/:studentId
Get student's appointments.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "appointment-id",
    "appointmentDate": "2024-01-15T09:00:00.000Z",
    "duration": 60,
    "status": "scheduled",
    "type": "individual",
    "mode": "in-person",
    "reason": "Anxiety and stress management",
    "priority": "medium",
    "counselorId": {
      "_id": "counselor-id",
      "firstName": "Dr. Jane",
      "lastName": "Smith",
      "email": "jane.smith@college.edu",
      "phone": "+1234567890"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### PUT /appointments/:appointmentId/status
Update appointment status.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "completed",
  "notes": "Session went well, follow-up scheduled"
}
```

**Response:**
```json
{
  "message": "Appointment status updated successfully",
  "appointment": {
    "_id": "appointment-id",
    "status": "completed",
    "counselorNotes": "Session went well, follow-up scheduled",
    "followUpRequired": true,
    "followUpDate": "2024-01-22T09:00:00.000Z"
  }
}
```

#### PUT /appointments/:appointmentId/cancel
Cancel an appointment.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "reason": "Schedule conflict"
}
```

**Response:**
```json
{
  "message": "Appointment cancelled successfully",
  "appointment": {
    "_id": "appointment-id",
    "status": "cancelled",
    "studentNotes": "Schedule conflict"
  }
}
```

#### POST /appointments/:appointmentId/feedback
Submit appointment feedback.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": 5,
  "comments": "Very helpful session, counselor was understanding and provided good advice."
}
```

**Response:**
```json
{
  "message": "Feedback submitted successfully",
  "appointment": {
    "_id": "appointment-id",
    "feedback": {
      "rating": 5,
      "comments": "Very helpful session, counselor was understanding and provided good advice.",
      "submittedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Resource Endpoints

#### GET /resources
Get all resources with optional filtering.

**Query Parameters:**
- `category`: Filter by category (anxiety, depression, stress, etc.)
- `type`: Filter by type (video, audio, article, etc.)
- `language`: Filter by language (en, hi, ta)
- `difficulty`: Filter by difficulty (beginner, intermediate, advanced)
- `search`: Search in title and description

**Response:**
```json
[
  {
    "_id": "resource-id",
    "title": "Managing Anxiety: A Complete Guide",
    "description": "Comprehensive guide to understanding and managing anxiety",
    "type": "article",
    "category": "anxiety",
    "language": "en",
    "difficulty": "beginner",
    "tags": ["anxiety", "coping", "techniques"],
    "views": 150,
    "likes": 25,
    "rating": {
      "average": 4.5,
      "count": 20
    },
    "createdBy": {
      "_id": "user-id",
      "firstName": "Dr. John",
      "lastName": "Doe"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### GET /resources/:id
Get a specific resource by ID.

**Response:**
```json
{
  "_id": "resource-id",
  "title": "Managing Anxiety: A Complete Guide",
  "description": "Comprehensive guide to understanding and managing anxiety",
  "type": "article",
  "category": "anxiety",
  "language": "en",
  "difficulty": "beginner",
  "content": {
    "text": "Anxiety is a normal emotion that everyone experiences...",
    "url": "https://example.com/anxiety-guide.pdf"
  },
  "tags": ["anxiety", "coping", "techniques"],
  "views": 151,
  "likes": 25,
  "rating": {
    "average": 4.5,
    "count": 20
  },
  "createdBy": {
    "_id": "user-id",
    "firstName": "Dr. John",
    "lastName": "Doe"
  },
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### POST /resources
Create a new resource (admin/counselor only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "New Resource Title",
  "description": "Resource description",
  "type": "video",
  "category": "anxiety",
  "language": "en",
  "content": {
    "url": "https://example.com/video.mp4",
    "duration": 15
  },
  "tags": ["anxiety", "video"],
  "difficulty": "beginner",
  "targetAudience": "all"
}
```

**Response:**
```json
{
  "message": "Resource created successfully",
  "resource": {
    "_id": "new-resource-id",
    "title": "New Resource Title",
    "description": "Resource description",
    "type": "video",
    "category": "anxiety",
    "language": "en",
    "createdBy": "user-id",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /resources/:id/rate
Rate a resource.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": 4
}
```

**Response:**
```json
{
  "message": "Rating submitted successfully",
  "rating": {
    "average": 4.2,
    "count": 21
  }
}
```

#### POST /resources/:id/like
Like a resource.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Resource liked successfully",
  "likes": 26
}
```

### Peer Support Endpoints

#### GET /peer-support/posts
Get all posts with optional filtering.

**Query Parameters:**
- `category`: Filter by category
- `status`: Filter by status (pending, approved, rejected)
- `page`: Page number for pagination
- `limit`: Number of posts per page

**Response:**
```json
{
  "posts": [
    {
      "_id": "post-id",
      "title": "Feeling overwhelmed with studies",
      "content": "I'm struggling to balance my studies and personal life...",
      "category": "academic-stress",
      "tags": ["studies", "stress", "balance"],
      "isAnonymous": false,
      "status": "approved",
      "likes": [
        {
          "userId": "user-id",
          "likedAt": "2024-01-01T00:00:00.000Z"
        }
      ],
      "comments": [
        {
          "_id": "comment-id",
          "authorId": "user-id",
          "content": "I understand how you feel. Here are some tips that helped me...",
          "isAnonymous": false,
          "status": "approved",
          "createdAt": "2024-01-01T00:00:00.000Z"
        }
      ],
      "views": 45,
      "authorId": {
        "_id": "author-id",
        "firstName": "John",
        "lastName": "Doe"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totalPages": 5,
  "currentPage": 1,
  "total": 50
}
```

#### POST /peer-support/posts
Create a new post.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Post Title",
  "content": "Post content here...",
  "category": "general",
  "tags": ["tag1", "tag2"],
  "isAnonymous": false
}
```

**Response:**
```json
{
  "message": "Post created successfully",
  "post": {
    "_id": "new-post-id",
    "title": "Post Title",
    "content": "Post content here...",
    "category": "general",
    "tags": ["tag1", "tag2"],
    "isAnonymous": false,
    "status": "pending",
    "authorId": "user-id",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /peer-support/posts/:id/comments
Add a comment to a post.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "content": "This is a helpful comment",
  "isAnonymous": false
}
```

**Response:**
```json
{
  "message": "Comment added successfully",
  "comment": {
    "authorId": "user-id",
    "content": "This is a helpful comment",
    "isAnonymous": false,
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /peer-support/posts/:id/like
Like a post.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Post liked successfully",
  "likes": 5
}
```

### Screening Endpoints

#### GET /screening/questions/:type
Get screening questions for a specific type.

**Path Parameters:**
- `type`: Screening type (phq-9, gad-7)

**Response:**
```json
{
  "type": "PHQ-9",
  "questions": [
    {
      "questionId": "phq-9_1",
      "question": "Little interest or pleasure in doing things",
      "options": [
        { "text": "Not at all", "score": 0 },
        { "text": "Several days", "score": 1 },
        { "text": "More than half the days", "score": 2 },
        { "text": "Nearly every day", "score": 3 }
      ]
    }
  ]
}
```

#### POST /screening/submit
Submit screening results.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "userId": "user-id",
  "screeningType": "PHQ-9",
  "responses": [
    {
      "questionId": "phq-9_1",
      "response": 2
    },
    {
      "questionId": "phq-9_2",
      "response": 1
    }
  ]
}
```

**Response:**
```json
{
  "message": "Screening completed successfully",
  "result": {
    "totalScore": 15,
    "severity": "moderately-severe",
    "interpretation": "Moderately severe depression symptoms",
    "recommendations": [
      "Strongly recommend professional help",
      "Consider medication evaluation",
      "Increase support network"
    ],
    "followUpRequired": true,
    "followUpDate": "2024-01-08T00:00:00.000Z"
  }
}
```

#### GET /screening/history/:userId
Get user's screening history.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "screening-id",
    "screeningType": "PHQ-9",
    "totalScore": 15,
    "severity": "moderately-severe",
    "interpretation": "Moderately severe depression symptoms",
    "followUpRequired": true,
    "completedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Admin Endpoints

#### GET /admin/dashboard/stats
Get dashboard statistics (admin only).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "overview": {
    "totalUsers": 1250,
    "totalCounselors": 25,
    "totalAppointments": 500,
    "totalChatSessions": 750,
    "totalScreeningResults": 300,
    "totalPosts": 200,
    "totalResources": 150
  },
  "recentActivity": {
    "appointments": [
      {
        "_id": "appointment-id",
        "appointmentDate": "2024-01-01T09:00:00.000Z",
        "status": "scheduled",
        "studentId": {
          "firstName": "John",
          "lastName": "Doe"
        },
        "counselorId": {
          "firstName": "Dr. Jane",
          "lastName": "Smith"
        }
      }
    ],
    "screeningResults": [
      {
        "_id": "screening-id",
        "screeningType": "PHQ-9",
        "severity": "moderate",
        "userId": {
          "firstName": "Alice",
          "lastName": "Johnson"
        },
        "completedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  },
  "distributions": {
    "riskLevels": [
      { "_id": "low", "count": 600 },
      { "_id": "medium", "count": 100 },
      { "_id": "high", "count": 40 },
      { "_id": "critical", "count": 10 }
    ],
    "severityLevels": [
      { "_id": "minimal", "count": 100 },
      { "_id": "mild", "count": 80 },
      { "_id": "moderate", "count": 70 },
      { "_id": "moderately-severe", "count": 30 },
      { "_id": "severe", "count": 20 }
    ]
  }
}
```

#### GET /admin/users
Get users with optional filtering (admin only).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `role`: Filter by role (student, counselor, admin)
- `page`: Page number
- `limit`: Number of users per page
- `search`: Search in name, email, studentId

**Response:**
```json
{
  "users": [
    {
      "_id": "user-id",
      "studentId": "STU001",
      "email": "student@college.edu",
      "firstName": "John",
      "lastName": "Doe",
      "role": "student",
      "college": "Engineering",
      "department": "Computer Science",
      "year": "3rd Year",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totalPages": 10,
  "currentPage": 1,
  "total": 100
}
```

#### PUT /admin/users/:id/status
Update user status (admin only).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "isActive": false
}
```

**Response:**
```json
{
  "message": "User status updated successfully",
  "user": {
    "_id": "user-id",
    "isActive": false
  }
}
```

## 🔒 Error Responses

All endpoints may return error responses in the following format:

```json
{
  "message": "Error description",
  "error": "Detailed error information"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `500` - Internal Server Error

### Example Error Responses

#### 401 Unauthorized
```json
{
  "message": "Access token required"
}
```

#### 403 Forbidden
```json
{
  "message": "Admin access required"
}
```

#### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

#### 422 Validation Error
```json
{
  "message": "Validation failed",
  "error": {
    "email": "Invalid email address",
    "password": "Password must be at least 6 characters"
  }
}
```

## 📊 Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **General endpoints**: 100 requests per 15 minutes per IP
- **Authentication endpoints**: 10 requests per 15 minutes per IP
- **Chat endpoints**: 50 requests per 15 minutes per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 🔄 WebSocket Events

The chat system uses WebSocket for real-time communication:

### Connection
```javascript
const socket = io('ws://localhost:5000');
```

### Events

#### Join Chat Room
```javascript
socket.emit('join-chat', { roomId: 'session_1234567890_abc123' });
```

#### Send Message
```javascript
socket.emit('send-message', {
  roomId: 'session_1234567890_abc123',
  message: 'Hello, I need help',
  sender: 'user',
  timestamp: new Date().toISOString()
});
```

#### Receive Message
```javascript
socket.on('receive-message', (data) => {
  console.log('New message:', data);
});
```

## 📝 Request/Response Examples

### Complete Chat Flow

1. **Start Chat Session**
```bash
curl -X POST http://localhost:5000/api/chat/start \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-id"}'
```

2. **Send Message**
```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_1234567890_abc123",
    "message": "I am feeling very anxious",
    "userId": "user-id"
  }'
```

3. **Get Chat History**
```bash
curl -X GET http://localhost:5000/api/chat/history/session_1234567890_abc123 \
  -H "Authorization: Bearer <token>"
```

### Complete Appointment Flow

1. **Get Available Counselors**
```bash
curl -X GET http://localhost:5000/api/appointments/counselors
```

2. **Get Available Time Slots**
```bash
curl -X GET "http://localhost:5000/api/appointments/availability/counselor-id?date=2024-01-15"
```

3. **Book Appointment**
```bash
curl -X POST http://localhost:5000/api/appointments/book \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "user-id",
    "counselorId": "counselor-id",
    "appointmentDate": "2024-01-15T09:00:00.000Z",
    "reason": "Anxiety management",
    "type": "individual",
    "mode": "in-person"
  }'
```

## 🧪 Testing

### Postman Collection

A Postman collection is available for testing all endpoints:
- Import the collection from `/docs/postman-collection.json`
- Set up environment variables for different environments
- Use the pre-request scripts for authentication

### API Testing Scripts

```bash
# Test authentication
npm run test:auth

# Test chat endpoints
npm run test:chat

# Test appointment endpoints
npm run test:appointments

# Test all endpoints
npm run test:api
```

---

**Note**: This API documentation is automatically generated and updated with each release. For the most current version, always refer to the latest documentation in your deployment.



