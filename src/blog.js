import { ObjectId } from 'mongodb';
import { sendBlogPostNotification } from './telegram.js';

export class BlogAPI {
    constructor(db) {
        this.db = db;
    }

    // ==================== Blog Posts Methods ====================
    
    async getAllBlogPosts() {
        try {
            const posts = await this.db.collection('blogPosts').find().sort({ publishedAt: -1 }).toArray();
            return posts;
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            throw new Error('Failed to fetch blog posts');
        }
    }

    async getBlogPostById(id) {
        try {
            let post;
            
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                post = await this.db.collection('blogPosts').findOne({ _id: new ObjectId(id) });
            } else if (/^\d+$/.test(id)) {
                post = await this.db.collection('blogPosts').findOne({ 
                    $or: [
                        { id: parseInt(id) },
                        { id: id },
                        { slug: id }
                    ]
                });
            } else {
                post = await this.db.collection('blogPosts').findOne({ slug: id });
            }
            
            if (!post) {
                throw new Error('Blog post not found');
            }
            
            return post;
        } catch (error) {
            console.error('Error fetching blog post by id:', error);
            throw new Error(error.message || 'Failed to fetch blog post');
        }
    }

    async getBlogPostBySlug(slug) {
        try {
            const post = await this.db.collection('blogPosts').findOne({ slug: slug });
            
            if (!post) {
                throw new Error('Blog post not found');
            }
            
            return post;
        } catch (error) {
            console.error('Error fetching blog post by slug:', error);
            throw new Error(error.message || 'Failed to fetch blog post');
        }
    }

    async createBlogPost(postData) {
        try {
            // Check if slug already exists
            if (postData.slug) {
                const existingPost = await this.db.collection('blogPosts').findOne({ slug: postData.slug });
                if (existingPost) {
                    throw new Error('Blog post with this slug already exists');
                }
            }

            const dataWithTimestamp = {
                ...postData,
                views: postData.views || 0,
                likes: postData.likes || 0,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            const result = await this.db.collection('blogPosts').insertOne(dataWithTimestamp);
            const createdPost = {
                ...dataWithTimestamp,
                _id: result.insertedId
            };

            // Generate blog URL and send to Telegram (don't block the response)
            const websiteDomain = process.env.WEBSITE_DOMAIN || 'https://www.azizjon7.uz';
            const blogUrl = `${websiteDomain}/blog/${postData.slug}`;
            
            // Send to Telegram asynchronously (don't await to avoid blocking the response)
            sendBlogPostNotification(blogUrl, postData.title || 'New Blog Post', postData.excerpt || '')
                .then(() => {
                    console.log(`Blog post notification sent to Telegram: ${blogUrl}`);
                })
                .catch((error) => {
                    console.error('Failed to send Telegram notification:', error);
                    // Don't throw - we don't want to fail the blog post creation if Telegram fails
                });

            return createdPost;
        } catch (error) {
            console.error('Error creating blog post:', error);
            throw new Error(error.message || 'Failed to create blog post');
        }
    }

    async updateBlogPost(id, postData) {
        try {
            let query;
            
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                query = { _id: new ObjectId(id) };
            } else if (/^\d+$/.test(id)) {
                query = { 
                    $or: [
                        { id: parseInt(id) },
                        { id: id },
                        { slug: id }
                    ]
                };
            } else {
                query = { slug: id };
            }

            // Check if slug is being updated and if it conflicts with another post
            if (postData.slug) {
                const existingPost = await this.db.collection('blogPosts').findOne({ 
                    slug: postData.slug,
                    _id: { $ne: query._id || new ObjectId(id) }
                });
                if (existingPost) {
                    throw new Error('Blog post with this slug already exists');
                }
            }
            
            const { _id, ...updateData } = postData;
            const dataWithTimestamp = {
                ...updateData,
                updatedAt: new Date()
            };
            
            const result = await this.db.collection('blogPosts').findOneAndUpdate(
                query,
                { $set: dataWithTimestamp },
                { returnDocument: 'after' }
            );
            
            if (!result) {
                throw new Error('Blog post not found');
            }
            
            return result;
        } catch (error) {
            console.error('Error updating blog post:', error);
            throw new Error(error.message || 'Failed to update blog post');
        }
    }

    async deleteBlogPost(id) {
        try {
            let query;
            
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                query = { _id: new ObjectId(id) };
            } else if (/^\d+$/.test(id)) {
                query = { 
                    $or: [
                        { id: parseInt(id) },
                        { id: id },
                        { slug: id }
                    ]
                };
            } else {
                query = { slug: id };
            }
            
            const result = await this.db.collection('blogPosts').deleteOne(query);
            
            if (result.deletedCount === 0) {
                throw new Error('Blog post not found');
            }
            
            return { success: true, message: 'Blog post deleted successfully' };
        } catch (error) {
            console.error('Error deleting blog post:', error);
            throw new Error(error.message || 'Failed to delete blog post');
        }
    }

    // ==================== Blog Post Interactions ====================

    async incrementViews(id) {
        try {
            let query;
            
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                query = { _id: new ObjectId(id) };
            } else if (/^\d+$/.test(id)) {
                query = { 
                    $or: [
                        { id: parseInt(id) },
                        { id: id },
                        { slug: id }
                    ]
                };
            } else {
                query = { slug: id };
            }
            
            const result = await this.db.collection('blogPosts').findOneAndUpdate(
                query,
                { $inc: { views: 1 } },
                { returnDocument: 'after' }
            );
            
            if (!result) {
                throw new Error('Blog post not found');
            }
            
            return result;
        } catch (error) {
            console.error('Error incrementing views:', error);
            throw new Error(error.message || 'Failed to increment views');
        }
    }

    async toggleLike(id) {
        try {
            let query;
            
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                query = { _id: new ObjectId(id) };
            } else if (/^\d+$/.test(id)) {
                query = { 
                    $or: [
                        { id: parseInt(id) },
                        { id: id },
                        { slug: id }
                    ]
                };
            } else {
                query = { slug: id };
            }
            
            // Get current post to check likes
            const post = await this.db.collection('blogPosts').findOne(query);
            if (!post) {
                throw new Error('Blog post not found');
            }
            
            // Increment or decrement based on current value
            const increment = post.likes >= 0 ? 1 : -1;
            
            const result = await this.db.collection('blogPosts').findOneAndUpdate(
                query,
                { $inc: { likes: increment } },
                { returnDocument: 'after' }
            );
            
            return result;
        } catch (error) {
            console.error('Error toggling like:', error);
            throw new Error(error.message || 'Failed to toggle like');
        }
    }

    // ==================== Blog Categories and Tags ====================

    async getAllCategories() {
        try {
            const categories = await this.db.collection('blogPosts').distinct('category');
            return categories.filter(cat => cat != null);
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw new Error('Failed to fetch categories');
        }
    }

    async getAllTags() {
        try {
            const posts = await this.db.collection('blogPosts').find({ tags: { $exists: true, $ne: [] } }).toArray();
            const allTags = posts.flatMap(post => post.tags || []);
            const uniqueTags = [...new Set(allTags)];
            return uniqueTags.sort();
        } catch (error) {
            console.error('Error fetching tags:', error);
            throw new Error('Failed to fetch tags');
        }
    }

    async getBlogPostsByCategory(category) {
        try {
            const posts = await this.db.collection('blogPosts')
                .find({ category: category })
                .sort({ publishedAt: -1 })
                .toArray();
            return posts;
        } catch (error) {
            console.error('Error fetching blog posts by category:', error);
            throw new Error('Failed to fetch blog posts by category');
        }
    }

    async getBlogPostsByTag(tag) {
        try {
            const posts = await this.db.collection('blogPosts')
                .find({ tags: tag })
                .sort({ publishedAt: -1 })
                .toArray();
            return posts;
        } catch (error) {
            console.error('Error fetching blog posts by tag:', error);
            throw new Error('Failed to fetch blog posts by tag');
        }
    }

    // Initialize blog posts with default data if empty
    async initializeBlogPosts() {
        try {
            const postsCount = await this.db.collection('blogPosts').countDocuments();
            if (postsCount === 0) {
                const defaultPosts = [
                    {
                        id: "1",
                        slug: "building-modern-web-applications-with-nextjs",
                        title: "Building Modern Web Applications with Next.js 14",
                        excerpt: "Explore the latest features in Next.js 14 and learn how to build performant, SEO-friendly web applications with React Server Components and the App Router.",
                        author: {
                            name: "Azizjon Nigmatjonov",
                            avatar: "https://i.ibb.co/BVKxNsNR/1760214133973-57f431a58820974d58c926865d32dffa-1756801360-jpeg.jpg",
                        },
                        publishedAt: "2024-01-15T10:00:00Z",
                        readTime: 8,
                        tags: ["Next.js", "React", "Web Development", "SSR"],
                        category: "Web Development",
                        featuredImage: "https://i.ibb.co/whHyJXxQ/1768381644936-2025-12-10-10-27-51-jpg.jpg",
                        content: [
                            {
                                id: "1",
                                type: "paragraph",
                                content: "Next.js 14 has revolutionized how we build web applications. With the introduction of React Server Components and the App Router, developers can now create more efficient, scalable applications with better performance and SEO.",
                            },
                            {
                                id: "2",
                                type: "heading",
                                content: "What's New in Next.js 14",
                                level: 2,
                            },
                            {
                                id: "3",
                                type: "paragraph",
                                content: "The latest version brings several groundbreaking features that make development faster and applications more performant. Let's dive into the key improvements.",
                            },
                            {
                                id: "4",
                                type: "image",
                                content: "",
                                imageUrl: "https://i.ibb.co/whHyJXxQ/1768381644936-2025-12-10-10-27-51-jpg.jpg",
                                imageAlt: "Next.js 14 Architecture",
                            },
                            {
                                id: "4.5",
                                type: "video",
                                content: "",
                                videoUrl: "https://youtu.be/H19-at0u354?si=PhDmTNG600AFT0fR",
                                videoTitle: "Next.js 14 Tutorial - Getting Started",
                            },
                            {
                                id: "5",
                                type: "heading",
                                content: "React Server Components",
                                level: 3,
                            },
                            {
                                id: "6",
                                type: "paragraph",
                                content: "Server Components allow you to build UI that can leverage server infrastructure. By default, components in the App Router are Server Components, which means they run on the server and can directly access backend resources.",
                            },
                            {
                                id: "7",
                                type: "code",
                                content: `// app/posts/page.tsx
export default async function PostsPage() {
  const posts = await fetchPosts(); // Runs on server
  
  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}`,
                                language: "typescript",
                            },
                            {
                                id: "8",
                                type: "paragraph",
                                content: "This approach reduces the JavaScript bundle size sent to the client, improving initial page load times and overall performance.",
                            },
                            {
                                id: "9",
                                type: "heading",
                                content: "The App Router",
                                level: 3,
                            },
                            {
                                id: "10",
                                type: "paragraph",
                                content: "The new App Router provides a more intuitive file-system based routing system with support for layouts, loading states, error handling, and more.",
                            },
                            {
                                id: "11",
                                type: "quote",
                                content: "The App Router is the future of Next.js. It provides a better developer experience and enables new patterns that weren't possible before.",
                            },
                            {
                                id: "12",
                                type: "heading",
                                content: "Best Practices",
                                level: 2,
                            },
                            {
                                id: "13",
                                type: "list",
                                content: "Key practices for Next.js 14",
                                items: [
                                    "Use Server Components by default",
                                    "Leverage streaming and Suspense for better UX",
                                    "Implement proper caching strategies",
                                    "Optimize images with next/image",
                                    "Use TypeScript for type safety",
                                ],
                            },
                            {
                                id: "14",
                                type: "paragraph",
                                content: "By following these practices, you can build applications that are not only fast but also maintainable and scalable.",
                            },
                        ],
                        views: 1250,
                        likes: 89,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        id: "2",
                        slug: "mastering-typescript-in-react-applications",
                        title: "Mastering TypeScript in React Applications",
                        excerpt: "Learn advanced TypeScript patterns and best practices for building type-safe React applications that scale.",
                        author: {
                            name: "Azizjon Nigmatjonov",
                            avatar: "https://i.ibb.co/BVKxNsNR/1760214133973-57f431a58820974d58c926865d32dffa-1756801360-jpeg.jpg",
                        },
                        publishedAt: "2024-01-10T14:30:00Z",
                        readTime: 12,
                        tags: ["TypeScript", "React", "Type Safety"],
                        category: "Programming",
                        featuredImage: "https://i.ibb.co/whHyJXxQ/1768381644936-2025-12-10-10-27-51-jpg.jpg",
                        content: [
                            {
                                id: "1",
                                type: "paragraph",
                                content: "TypeScript has become the standard for building large-scale React applications. Its type system helps catch errors early, improves developer experience, and makes codebases more maintainable.",
                            },
                            {
                                id: "2",
                                type: "heading",
                                content: "Advanced Type Patterns",
                                level: 2,
                            },
                            {
                                id: "3",
                                type: "paragraph",
                                content: "Understanding advanced TypeScript patterns can significantly improve how you structure your React components and hooks.",
                            },
                            {
                                id: "4",
                                type: "code",
                                content: `// Generic component with proper typing
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}`,
                                language: "typescript",
                            },
                            {
                                id: "5",
                                type: "paragraph",
                                content: "This pattern allows you to create reusable components that maintain type safety across different data types.",
                            },
                        ],
                        views: 980,
                        likes: 67,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        id: "3",
                        slug: "optimizing-react-performance-tips-and-tricks",
                        title: "Optimizing React Performance: Tips and Tricks",
                        excerpt: "Discover practical techniques to improve your React application's performance, from memoization to code splitting.",
                        author: {
                            name: "Azizjon Nigmatjonov",
                            avatar: "https://i.ibb.co/BVKxNsNR/1760214133973-57f431a58820974d58c926865d32dffa-1756801360-jpeg.jpg",
                        },
                        publishedAt: "2024-01-05T09:15:00Z",
                        readTime: 6,
                        tags: ["React", "Performance", "Optimization"],
                        category: "Web Development",
                        content: [
                            {
                                id: "1",
                                type: "paragraph",
                                content: "Performance optimization is crucial for creating smooth user experiences. In this article, we'll explore various techniques to make your React applications faster and more efficient.",
                            },
                            {
                                id: "2",
                                type: "heading",
                                content: "Memoization Strategies",
                                level: 2,
                            },
                            {
                                id: "3",
                                type: "paragraph",
                                content: "React.memo, useMemo, and useCallback are powerful tools for preventing unnecessary re-renders and computations.",
                            },
                            {
                                id: "4",
                                type: "quote",
                                content: "Premature optimization is the root of all evil. But when you need it, React provides excellent tools.",
                            },
                        ],
                        views: 750,
                        likes: 45,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                ];
                await this.db.collection('blogPosts').insertMany(defaultPosts);
                console.log('Default blog posts created');
            }
        } catch (error) {
            console.error('Error initializing blog posts:', error);
            throw error;
        }
    }
}
