# Experience API Documentation

This document provides comprehensive documentation for the Experience APIs, including About Me, Contacts, Experiences, and Skills endpoints.

## Base URL

```
http://localhost:8888/api
```

**Note:** Replace `localhost:8888` with your production server URL when deploying.

---

## Authentication

### Public Endpoints
All `GET` endpoints are **public** and do not require authentication.

### Protected Endpoints
All `POST`, `PUT`, and `DELETE` endpoints require authentication. Include the Firebase authentication token in the request headers:

```javascript
headers: {
  'Content-Type': 'application/json',
  'authtoken': 'YOUR_FIREBASE_ID_TOKEN'
}
```

---

## About Me API

### Get About Me
**GET** `/api/about-me`

Returns the about me information.

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "About Me",
  "content": "I'm a Frontend Developer with 4+ years of professional experience...",
  "image": "/me.jpeg",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `404` - Not found
- `500` - Server error

---

### Create About Me
**POST** `/api/about-me` (Protected)

Creates a new about me entry. Only one about me entry can exist.

**Request Body:**
```json
{
  "title": "About Me",
  "content": "Your about me content here...",
  "image": "/me.jpeg"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "About Me",
  "content": "Your about me content here...",
  "image": "/me.jpeg",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `201` - Created successfully
- `409` - Already exists
- `500` - Server error

---

### Update About Me
**PUT** `/api/about-me` (Protected)

Updates the existing about me entry.

**Request Body:**
```json
{
  "title": "About Me",
  "content": "Updated content here...",
  "image": "/updated-me.jpeg"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "About Me",
  "content": "Updated content here...",
  "image": "/updated-me.jpeg",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

**Status Codes:**
- `200` - Updated successfully
- `500` - Server error

---

### Delete About Me
**DELETE** `/api/about-me` (Protected)

Deletes the about me entry.

**Response:**
```json
{
  "success": true,
  "message": "About me deleted successfully"
}
```

**Status Codes:**
- `200` - Deleted successfully
- `404` - Not found
- `500` - Server error

---

## Contacts API

### Get All Contacts
**GET** `/api/contacts`

Returns all contacts.

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "id": "1",
    "type": "email",
    "label": "Email",
    "value": "azizjon.nigmatjonov2@gmail.com",
    "url": "mailto:azizjon.nigmatjonov2@gmail.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "id": "2",
    "type": "website",
    "label": "Website",
    "value": "azizjon7.uz",
    "url": "https://azizjon7.uz/",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

### Get Contact by ID
**GET** `/api/contacts/:id`

Returns a specific contact by ID. The `:id` can be either a MongoDB ObjectId or a custom string ID.

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "id": "1",
  "type": "email",
  "label": "Email",
  "value": "azizjon.nigmatjonov2@gmail.com",
  "url": "mailto:azizjon.nigmatjonov2@gmail.com",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `404` - Contact not found
- `500` - Server error

---

### Create Contact
**POST** `/api/contacts` (Protected)

Creates a new contact.

**Request Body:**
```json
{
  "id": "5",
  "type": "phone",
  "label": "Phone",
  "value": "+998 99 123 45 67",
  "url": "tel:+998991234567"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "id": "5",
  "type": "phone",
  "label": "Phone",
  "value": "+998 99 123 45 67",
  "url": "tel:+998991234567",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `201` - Created successfully
- `500` - Server error

---

### Update Contact
**PUT** `/api/contacts/:id` (Protected)

Updates an existing contact. The `:id` can be either a MongoDB ObjectId or a custom string ID.

**Request Body:**
```json
{
  "type": "email",
  "label": "Email",
  "value": "newemail@example.com",
  "url": "mailto:newemail@example.com"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "id": "1",
  "type": "email",
  "label": "Email",
  "value": "newemail@example.com",
  "url": "mailto:newemail@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

**Status Codes:**
- `200` - Updated successfully
- `404` - Contact not found
- `500` - Server error

---

### Delete Contact
**DELETE** `/api/contacts/:id` (Protected)

Deletes a contact. The `:id` can be either a MongoDB ObjectId or a custom string ID.

**Response:**
```json
{
  "success": true,
  "message": "Contact deleted successfully"
}
```

**Status Codes:**
- `200` - Deleted successfully
- `404` - Contact not found
- `500` - Server error

---

## Experiences API

### Get All Experiences
**GET** `/api/experiences`

Returns all experiences, sorted by start date (most recent first).

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "id": "1",
    "company": "MARK FORMELLE",
    "position": "Middle Frontend Developer",
    "location": "Manufacturing & Retail (Fashion / FMCG)",
    "startDate": "2024-08",
    "endDate": null,
    "description": "Developing Android applications and React-based platforms...",
    "technologies": ["React", "React Native", "Expo", "TypeScript", "Jest", "Cypress"],
    "achievements": [
      "Developed Android application for automating production processes...",
      "Built React Native and Expo-based Android application..."
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

### Get Experience by ID
**GET** `/api/experiences/:id`

Returns a specific experience by ID. The `:id` can be either a MongoDB ObjectId or a custom string ID.

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "id": "1",
  "company": "MARK FORMELLE",
  "position": "Middle Frontend Developer",
  "location": "Manufacturing & Retail (Fashion / FMCG)",
  "startDate": "2024-08",
  "endDate": null,
  "description": "Developing Android applications and React-based platforms...",
  "technologies": ["React", "React Native", "Expo", "TypeScript", "Jest", "Cypress"],
  "achievements": [
    "Developed Android application for automating production processes...",
    "Built React Native and Expo-based Android application..."
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `404` - Experience not found
- `500` - Server error

---

### Create Experience
**POST** `/api/experiences` (Protected)

Creates a new experience.

**Request Body:**
```json
{
  "id": "6",
  "company": "New Company",
  "position": "Senior Frontend Developer",
  "location": "Remote",
  "startDate": "2024-01",
  "endDate": null,
  "description": "Leading frontend development...",
  "technologies": ["React", "TypeScript", "Next.js"],
  "achievements": [
    "Achievement 1",
    "Achievement 2"
  ]
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439016",
  "id": "6",
  "company": "New Company",
  "position": "Senior Frontend Developer",
  "location": "Remote",
  "startDate": "2024-01",
  "endDate": null,
  "description": "Leading frontend development...",
  "technologies": ["React", "TypeScript", "Next.js"],
  "achievements": [
    "Achievement 1",
    "Achievement 2"
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `201` - Created successfully
- `500` - Server error

---

### Update Experience
**PUT** `/api/experiences/:id` (Protected)

Updates an existing experience. The `:id` can be either a MongoDB ObjectId or a custom string ID.

**Request Body:**
```json
{
  "company": "Updated Company",
  "position": "Updated Position",
  "location": "Updated Location",
  "startDate": "2024-01",
  "endDate": "2024-12",
  "description": "Updated description...",
  "technologies": ["React", "TypeScript"],
  "achievements": ["Updated achievement"]
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "id": "1",
  "company": "Updated Company",
  "position": "Updated Position",
  "location": "Updated Location",
  "startDate": "2024-01",
  "endDate": "2024-12",
  "description": "Updated description...",
  "technologies": ["React", "TypeScript"],
  "achievements": ["Updated achievement"],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

**Status Codes:**
- `200` - Updated successfully
- `404` - Experience not found
- `500` - Server error

---

### Delete Experience
**DELETE** `/api/experiences/:id` (Protected)

Deletes an experience. The `:id` can be either a MongoDB ObjectId or a custom string ID.

**Response:**
```json
{
  "success": true,
  "message": "Experience deleted successfully"
}
```

**Status Codes:**
- `200` - Deleted successfully
- `404` - Experience not found
- `500` - Server error

---

## Skills API

### Get All Skills
**GET** `/api/skills`

Returns all skills, sorted by category and name.

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "id": "1",
    "name": "JavaScript (ES6+)",
    "category": "Core Technologies",
    "proficiency": 95,
    "icon": "🟨",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "id": "2",
    "name": "React",
    "category": "Core Technologies",
    "proficiency": 95,
    "icon": "⚛️",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

### Get Skill by ID
**GET** `/api/skills/:id`

Returns a specific skill by ID. The `:id` can be either a MongoDB ObjectId or a custom string ID.

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "id": "1",
  "name": "JavaScript (ES6+)",
  "category": "Core Technologies",
  "proficiency": 95,
  "icon": "🟨",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `404` - Skill not found
- `500` - Server error

---

### Create Skill
**POST** `/api/skills` (Protected)

Creates a new skill.

**Request Body:**
```json
{
  "id": "58",
  "name": "New Skill",
  "category": "Core Technologies",
  "proficiency": 85,
  "icon": "⭐"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439018",
  "id": "58",
  "name": "New Skill",
  "category": "Core Technologies",
  "proficiency": 85,
  "icon": "⭐",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `201` - Created successfully
- `500` - Server error

---

### Update Skill
**PUT** `/api/skills/:id` (Protected)

Updates an existing skill. The `:id` can be either a MongoDB ObjectId or a custom string ID.

**Request Body:**
```json
{
  "name": "Updated Skill",
  "category": "Updated Category",
  "proficiency": 90,
  "icon": "🔥"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "id": "1",
  "name": "Updated Skill",
  "category": "Updated Category",
  "proficiency": 90,
  "icon": "🔥",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

**Status Codes:**
- `200` - Updated successfully
- `404` - Skill not found
- `500` - Server error

---

### Delete Skill
**DELETE** `/api/skills/:id` (Protected)

Deletes a skill. The `:id` can be either a MongoDB ObjectId or a custom string ID.

**Response:**
```json
{
  "success": true,
  "message": "Skill deleted successfully"
}
```

**Status Codes:**
- `200` - Deleted successfully
- `404` - Skill not found
- `500` - Server error

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message description"
}
```

### Common Status Codes

- `200` - Success
- `201` - Created successfully
- `400` - Bad Request
- `401` - Unauthorized (missing or invalid authentication token)
- `404` - Resource not found
- `409` - Conflict (resource already exists)
- `500` - Internal server error

---

## Example Usage

### JavaScript/Fetch Example

```javascript
// Get all experiences
const getExperiences = async () => {
  try {
    const response = await fetch('http://localhost:8888/api/experiences');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Create a new experience (with authentication)
const createExperience = async (experienceData) => {
  try {
    const response = await fetch('http://localhost:8888/api/experiences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authtoken': 'YOUR_FIREBASE_ID_TOKEN'
      },
      body: JSON.stringify(experienceData)
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Update an experience
const updateExperience = async (id, experienceData) => {
  try {
    const response = await fetch(`http://localhost:8888/api/experiences/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'authtoken': 'YOUR_FIREBASE_ID_TOKEN'
      },
      body: JSON.stringify(experienceData)
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Delete an experience
const deleteExperience = async (id) => {
  try {
    const response = await fetch(`http://localhost:8888/api/experiences/${id}`, {
      method: 'DELETE',
      headers: {
        'authtoken': 'YOUR_FIREBASE_ID_TOKEN'
      }
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Axios Example

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8888/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('firebaseToken');
  if (token) {
    config.headers.authtoken = token;
  }
  return config;
});

// Get all skills
const getSkills = async () => {
  try {
    const response = await api.get('/skills');
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

// Create a skill
const createSkill = async (skillData) => {
  try {
    const response = await api.post('/skills', skillData);
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};
```

---

## Data Types Reference

### Contact Types
- `email` - Email address
- `phone` - Phone number
- `website` - Website URL
- `linkedin` - LinkedIn profile
- `github` - GitHub profile
- `twitter` - Twitter profile
- Custom types are also supported

### Skill Categories
- `Core Technologies`
- `Performance & Architecture`
- `Testing & Quality`
- `Development Tools`
- `APIs & State Management`
- `UI Libraries & Design`
- `Leadership & Collaboration`
- `Additional Skills`

### Date Format
- Dates are stored in ISO 8601 format: `YYYY-MM` (e.g., "2024-08")
- `endDate` can be `null` for current positions

---

## Notes

1. **ID Format**: All endpoints accept both MongoDB ObjectId (24-character hex string) and custom string IDs.

2. **Timestamps**: All resources automatically include `createdAt` and `updatedAt` timestamps.

3. **Sorting**: 
   - Experiences are sorted by `startDate` (descending)
   - Skills are sorted by `category` and `name` (ascending)
   - Contacts are sorted by `_id` (descending)

4. **Initialization**: The database is automatically initialized with default data on first server start if collections are empty.

5. **CORS**: The API supports CORS and accepts requests from any origin.

---

## Support

For questions or issues, please contact the backend team or refer to the main project documentation.
