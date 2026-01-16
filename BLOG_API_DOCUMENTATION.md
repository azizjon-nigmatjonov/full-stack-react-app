# Blog API Documentation

This document provides comprehensive documentation for the Blog APIs, including blog posts, categories, tags, and interactions.

## Base URL

```
http://localhost:8888/api
```

**Note:** Replace `localhost:8888` with your production server URL when deploying.

---

## Authentication

### Public Endpoints
All `GET` endpoints and the `POST /api/blog/posts/:id/views` endpoint are **public** and do not require authentication.

### Protected Endpoints
All `POST`, `PUT`, and `DELETE` endpoints (except views) require authentication. Include the Firebase authentication token in the request headers:

```javascript
headers: {
  'Content-Type': 'application/json',
  'authtoken': 'YOUR_FIREBASE_ID_TOKEN'
}
```

---

## Blog Posts API

### Get All Blog Posts
**GET** `/api/blog/posts`

Returns all blog posts, sorted by published date (most recent first).

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "id": "1",
    "slug": "building-modern-web-applications-with-nextjs",
    "title": "Building Modern Web Applications with Next.js 14",
    "excerpt": "Explore the latest features in Next.js 14...",
    "author": {
      "name": "Azizjon Nigmatjonov",
      "avatar": "https://i.ibb.co/BVKxNsNR/1760214133973-57f431a58820974d58c926865d32dffa-1756801360-jpeg.jpg"
    },
    "publishedAt": "2024-01-15T10:00:00Z",
    "readTime": 8,
    "tags": ["Next.js", "React", "Web Development", "SSR"],
    "category": "Web Development",
    "featuredImage": "https://i.ibb.co/whHyJXxQ/1768381644936-2025-12-10-10-27-51-jpg.jpg",
    "content": [
      {
        "id": "1",
        "type": "paragraph",
        "content": "Next.js 14 has revolutionized..."
      },
      {
        "id": "2",
        "type": "heading",
        "content": "What's New in Next.js 14",
        "level": 2
      }
    ],
    "views": 1250,
    "likes": 89,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

### Get Blog Post by ID or Slug
**GET** `/api/blog/posts/:id`

Returns a specific blog post by ID or slug. The `:id` parameter can be:
- MongoDB ObjectId (24-character hex string)
- Numeric ID (string or number)
- Slug (URL-friendly identifier)

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "id": "1",
  "slug": "building-modern-web-applications-with-nextjs",
  "title": "Building Modern Web Applications with Next.js 14",
  "excerpt": "Explore the latest features in Next.js 14...",
  "author": {
    "name": "Azizjon Nigmatjonov",
    "avatar": "https://i.ibb.co/BVKxNsNR/1760214133973-57f431a58820974d58c926865d32dffa-1756801360-jpeg.jpg"
  },
  "publishedAt": "2024-01-15T10:00:00Z",
  "readTime": 8,
  "tags": ["Next.js", "React", "Web Development", "SSR"],
  "category": "Web Development",
  "featuredImage": "https://i.ibb.co/whHyJXxQ/1768381644936-2025-12-10-10-27-51-jpg.jpg",
  "content": [
    {
      "id": "1",
      "type": "paragraph",
      "content": "Next.js 14 has revolutionized..."
    }
  ],
  "views": 1250,
  "likes": 89,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `404` - Blog post not found
- `500` - Server error

---

### Get Blog Post by Slug (Alternative)
**GET** `/api/blog/posts/slug/:slug`

Returns a blog post by its slug. This is an alternative endpoint specifically for slug-based lookups.

**Example:**
```
GET /api/blog/posts/slug/building-modern-web-applications-with-nextjs
```

**Status Codes:**
- `200` - Success
- `404` - Blog post not found
- `500` - Server error

---

### Create Blog Post
**POST** `/api/blog/posts` (Protected)

Creates a new blog post.

**Request Body:**
```json
{
  "id": "4",
  "slug": "my-new-blog-post",
  "title": "My New Blog Post",
  "excerpt": "This is a brief description of the blog post...",
  "author": {
    "name": "Azizjon Nigmatjonov",
    "avatar": "https://i.ibb.co/BVKxNsNR/1760214133973-57f431a58820974d58c926865d32dffa-1756801360-jpeg.jpg"
  },
  "publishedAt": "2024-01-20T10:00:00Z",
  "readTime": 5,
  "tags": ["React", "JavaScript"],
  "category": "Web Development",
  "featuredImage": "https://i.ibb.co/example/image.jpg",
  "content": [
    {
      "id": "1",
      "type": "paragraph",
      "content": "This is the first paragraph of the blog post."
    },
    {
      "id": "2",
      "type": "heading",
      "content": "Introduction",
      "level": 2
    },
    {
      "id": "3",
      "type": "image",
      "content": "",
      "imageUrl": "https://i.ibb.co/example/image.jpg",
      "imageAlt": "Example image"
    },
    {
      "id": "3.5",
      "type": "video",
      "content": "",
      "videoUrl": "https://youtu.be/H19-at0u354?si=PhDmTNG600AFT0fR",
      "videoTitle": "Example Video Tutorial"
    },
    {
      "id": "4",
      "type": "code",
      "content": "console.log('Hello World');",
      "language": "javascript"
    },
    {
      "id": "5",
      "type": "quote",
      "content": "This is a quote from the article."
    },
    {
      "id": "6",
      "type": "list",
      "content": "Key points",
      "items": [
        "Point 1",
        "Point 2",
        "Point 3"
      ]
    }
  ]
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "id": "4",
  "slug": "my-new-blog-post",
  "title": "My New Blog Post",
  "excerpt": "This is a brief description of the blog post...",
  "author": {
    "name": "Azizjon Nigmatjonov",
    "avatar": "https://i.ibb.co/BVKxNsNR/1760214133973-57f431a58820974d58c926865d32dffa-1756801360-jpeg.jpg"
  },
  "publishedAt": "2024-01-20T10:00:00Z",
  "readTime": 5,
  "tags": ["React", "JavaScript"],
  "category": "Web Development",
  "featuredImage": "https://i.ibb.co/example/image.jpg",
  "content": [...],
  "views": 0,
  "likes": 0,
  "createdAt": "2024-01-20T10:00:00.000Z",
  "updatedAt": "2024-01-20T10:00:00.000Z"
}
```

**Status Codes:**
- `201` - Created successfully
- `409` - Blog post with this slug already exists
- `500` - Server error

---

### Update Blog Post
**PUT** `/api/blog/posts/:id` (Protected)

Updates an existing blog post. The `:id` can be MongoDB ObjectId, numeric ID, or slug.

**Request Body:**
```json
{
  "title": "Updated Blog Post Title",
  "excerpt": "Updated excerpt...",
  "content": [...],
  "tags": ["Updated", "Tags"]
}
```

**Note:** You can update any field. Only include the fields you want to update.

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "id": "1",
  "slug": "building-modern-web-applications-with-nextjs",
  "title": "Updated Blog Post Title",
  "excerpt": "Updated excerpt...",
  ...
  "updatedAt": "2024-01-21T10:00:00.000Z"
}
```

**Status Codes:**
- `200` - Updated successfully
- `404` - Blog post not found
- `409` - Blog post with this slug already exists (if updating slug)
- `500` - Server error

---

### Delete Blog Post
**DELETE** `/api/blog/posts/:id` (Protected)

Deletes a blog post. The `:id` can be MongoDB ObjectId, numeric ID, or slug.

**Response:**
```json
{
  "success": true,
  "message": "Blog post deleted successfully"
}
```

**Status Codes:**
- `200` - Deleted successfully
- `404` - Blog post not found
- `500` - Server error

---

## Blog Interactions API

### Increment Views
**POST** `/api/blog/posts/:id/views` (Public)

Increments the view count for a blog post. This endpoint is public and can be called without authentication.

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "id": "1",
  "slug": "building-modern-web-applications-with-nextjs",
  ...
  "views": 1251,
  ...
}
```

**Status Codes:**
- `200` - Success
- `404` - Blog post not found
- `500` - Server error

---

### Toggle Like
**POST** `/api/blog/posts/:id/like` (Protected)

Toggles the like count for a blog post. Increments by 1 each time it's called.

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "id": "1",
  "slug": "building-modern-web-applications-with-nextjs",
  ...
  "likes": 90,
  ...
}
```

**Status Codes:**
- `200` - Success
- `404` - Blog post not found
- `500` - Server error

---

## Categories and Tags API

### Get All Categories
**GET** `/api/blog/categories`

Returns all unique categories from all blog posts.

**Response:**
```json
[
  "Web Development",
  "Programming",
  "Design",
  "Tutorial"
]
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

### Get All Tags
**GET** `/api/blog/tags`

Returns all unique tags from all blog posts, sorted alphabetically.

**Response:**
```json
[
  "JavaScript",
  "Next.js",
  "Performance",
  "React",
  "SSR",
  "TypeScript",
  "Web Development"
]
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

### Get Blog Posts by Category
**GET** `/api/blog/category/:category`

Returns all blog posts in a specific category, sorted by published date (most recent first).

**Example:**
```
GET /api/blog/category/Web Development
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "id": "1",
    "slug": "building-modern-web-applications-with-nextjs",
    "title": "Building Modern Web Applications with Next.js 14",
    "category": "Web Development",
    ...
  }
]
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

### Get Blog Posts by Tag
**GET** `/api/blog/tag/:tag`

Returns all blog posts with a specific tag, sorted by published date (most recent first).

**Example:**
```
GET /api/blog/tag/React
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "id": "1",
    "slug": "building-modern-web-applications-with-nextjs",
    "title": "Building Modern Web Applications with Next.js 14",
    "tags": ["Next.js", "React", "Web Development", "SSR"],
    ...
  }
]
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

## Content Block Types

Blog posts contain a `content` array with different types of content blocks. Here are the supported types:

### 1. Paragraph
```json
{
  "id": "1",
  "type": "paragraph",
  "content": "This is a paragraph of text."
}
```

### 2. Heading
```json
{
  "id": "2",
  "type": "heading",
  "content": "This is a Heading",
  "level": 2
}
```
**Note:** `level` can be 1-6 (h1 to h6)

### 3. Image
```json
{
  "id": "3",
  "type": "image",
  "content": "",
  "imageUrl": "https://i.ibb.co/example/image.jpg",
  "imageAlt": "Description of the image"
}
```
**Note:** `imageUrl` must be a full URL, not a relative path.

### 4. Video
```json
{
  "id": "4",
  "type": "video",
  "content": "",
  "videoUrl": "https://youtu.be/H19-at0u354?si=PhDmTNG600AFT0fR",
  "videoTitle": "Video Title (optional)"
}
```
**Note:** 
- `videoUrl` should be a YouTube URL (or any video platform URL)
- `videoTitle` is optional but recommended for accessibility
- The URL can be in any format (youtu.be, youtube.com, etc.)

### 5. Code Block
```json
{
  "id": "5",
  "type": "code",
  "content": "console.log('Hello World');",
  "language": "javascript"
}
```
**Note:** `language` can be any programming language (e.g., "javascript", "typescript", "python", "css", etc.)

### 6. Quote
```json
{
  "id": "6",
  "type": "quote",
  "content": "This is a quote from the article."
}
```

### 7. List
```json
{
  "id": "6",
  "type": "list",
  "content": "List title (optional)",
  "items": [
    "Item 1",
    "Item 2",
    "Item 3"
  ]
}
```

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
- `409` - Conflict (resource already exists, e.g., duplicate slug)
- `500` - Internal server error

---

## Example Usage

### JavaScript/Fetch Examples

#### Get All Blog Posts
```javascript
const getBlogPosts = async () => {
  try {
    const response = await fetch('http://localhost:8888/api/blog/posts');
    const posts = await response.json();
    console.log(posts);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

#### Get Blog Post by Slug
```javascript
const getBlogPost = async (slug) => {
  try {
    const response = await fetch(`http://localhost:8888/api/blog/posts/${slug}`);
    const post = await response.json();
    console.log(post);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

#### Create Blog Post
```javascript
const createBlogPost = async (postData) => {
  try {
    const response = await fetch('http://localhost:8888/api/blog/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authtoken': 'YOUR_FIREBASE_ID_TOKEN'
      },
      body: JSON.stringify(postData)
    });
    const post = await response.json();
    console.log(post);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Example usage
createBlogPost({
  id: "4",
  slug: "my-new-blog-post",
  title: "My New Blog Post",
  excerpt: "This is a brief description...",
  author: {
    name: "Azizjon Nigmatjonov",
    avatar: "https://i.ibb.co/BVKxNsNR/1760214133973-57f431a58820974d58c926865d32dffa-1756801360-jpeg.jpg"
  },
  publishedAt: new Date().toISOString(),
  readTime: 5,
  tags: ["React", "JavaScript"],
  category: "Web Development",
  featuredImage: "https://i.ibb.co/example/image.jpg",
  content: [
    {
      id: "1",
      type: "paragraph",
      content: "This is the first paragraph."
    }
  ]
});
```

#### Update Blog Post
```javascript
const updateBlogPost = async (id, updates) => {
  try {
    const response = await fetch(`http://localhost:8888/api/blog/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'authtoken': 'YOUR_FIREBASE_ID_TOKEN'
      },
      body: JSON.stringify(updates)
    });
    const post = await response.json();
    console.log(post);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

#### Delete Blog Post
```javascript
const deleteBlogPost = async (id) => {
  try {
    const response = await fetch(`http://localhost:8888/api/blog/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'authtoken': 'YOUR_FIREBASE_ID_TOKEN'
      }
    });
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

#### Increment Views
```javascript
const incrementViews = async (id) => {
  try {
    const response = await fetch(`http://localhost:8888/api/blog/posts/${id}/views`, {
      method: 'POST'
    });
    const post = await response.json();
    console.log(post);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

#### Get Posts by Category
```javascript
const getPostsByCategory = async (category) => {
  try {
    const response = await fetch(`http://localhost:8888/api/blog/category/${encodeURIComponent(category)}`);
    const posts = await response.json();
    console.log(posts);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

#### Get Posts by Tag
```javascript
const getPostsByTag = async (tag) => {
  try {
    const response = await fetch(`http://localhost:8888/api/blog/tag/${encodeURIComponent(tag)}`);
    const posts = await response.json();
    console.log(posts);
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

// Get all blog posts
const getBlogPosts = async () => {
  try {
    const response = await api.get('/blog/posts');
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

// Create blog post
const createBlogPost = async (postData) => {
  try {
    const response = await api.post('/blog/posts', postData);
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

// Update blog post
const updateBlogPost = async (id, updates) => {
  try {
    const response = await api.put(`/blog/posts/${id}`, updates);
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

// Delete blog post
const deleteBlogPost = async (id) => {
  try {
    const response = await api.delete(`/blog/posts/${id}`);
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};
```

---

## Data Structure Reference

### Blog Post Schema
```typescript
interface BlogPost {
  _id?: string;                    // MongoDB ObjectId
  id: string;                       // Custom ID
  slug: string;                     // URL-friendly identifier (unique)
  title: string;                    // Post title
  excerpt: string;                  // Short description
  author: {
    name: string;                   // Author name
    avatar: string;                 // Author avatar URL (full URL)
  };
  publishedAt: string;             // ISO 8601 date string
  readTime: number;                // Estimated reading time in minutes
  tags: string[];                   // Array of tags
  category: string;                // Post category
  featuredImage?: string;           // Featured image URL (full URL)
  content: ContentBlock[];          // Array of content blocks
  views: number;                    // View count (default: 0)
  likes: number;                   // Like count (default: 0)
  createdAt: string;               // ISO 8601 date string
  updatedAt: string;                // ISO 8601 date string
}
```

### Content Block Schema
```typescript
interface ContentBlock {
  id: string;                       // Unique block ID
  type: 'paragraph' | 'heading' | 'image' | 'video' | 'code' | 'quote' | 'list';
  content: string;                   // Main content
  level?: number;                   // For headings (1-6)
  imageUrl?: string;                // For images (full URL)
  imageAlt?: string;                // For images
  videoUrl?: string;                // For videos (YouTube or other video platform URL)
  videoTitle?: string;              // For videos (optional title)
  language?: string;                // For code blocks
  items?: string[];                  // For lists
}
```

---

## Important Notes

1. **Slug Uniqueness**: Each blog post must have a unique slug. The API will return a 409 error if you try to create or update a post with a slug that already exists.

2. **Image URLs**: All image fields (`featuredImage`, `author.avatar`, `content[].imageUrl`) must be **full URLs**, not relative paths. Example: `https://i.ibb.co/example/image.jpg`

3. **ID Format**: All endpoints accept:
   - MongoDB ObjectId (24-character hex string)
   - Numeric ID (string or number)
   - Slug (URL-friendly identifier)

4. **Timestamps**: All resources automatically include `createdAt` and `updatedAt` timestamps in ISO 8601 format.

5. **Sorting**: 
   - Blog posts are sorted by `publishedAt` (descending - most recent first)
   - Tags are sorted alphabetically

6. **Default Values**: 
   - `views` defaults to 0 if not provided
   - `likes` defaults to 0 if not provided

7. **Content Blocks**: The `content` array can contain any combination of the supported content block types. Order matters as it represents the order of content in the blog post.

8. **Initialization**: The database is automatically initialized with default blog posts on first server start if the collection is empty.

9. **Views Endpoint**: The views increment endpoint is public (no authentication required) to allow easy tracking of page views.

10. **CORS**: The API supports CORS and accepts requests from any origin.

---

## Best Practices

1. **Slug Generation**: Generate slugs from titles by:
   - Converting to lowercase
   - Replacing spaces with hyphens
   - Removing special characters
   - Ensuring uniqueness

2. **Content Structure**: Organize content blocks logically:
   - Start with an introductory paragraph
   - Use headings to structure sections
   - Include images to break up text
   - Use code blocks for technical content
   - Add quotes for emphasis
   - Use lists for key points

3. **Image Optimization**: 
   - Use optimized image formats (WebP, AVIF)
   - Provide descriptive alt text for accessibility
   - Use full URLs from reliable image hosting services

4. **SEO Considerations**:
   - Write descriptive excerpts
   - Use relevant tags and categories
   - Include featured images
   - Use proper heading hierarchy (h2, h3, etc.)

5. **Error Handling**: Always handle errors gracefully:
   ```javascript
   try {
     const response = await fetch('/api/blog/posts');
     if (!response.ok) {
       throw new Error(`HTTP error! status: ${response.status}`);
     }
     const data = await response.json();
   } catch (error) {
     console.error('Error fetching posts:', error);
     // Handle error in UI
   }
   ```

---

## Support

For questions or issues, please contact the backend team or refer to the main project documentation.
