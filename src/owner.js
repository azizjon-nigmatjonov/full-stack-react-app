// Owner API functions for article management

export class OwnerAPI {
    constructor(db) {
        this.db = db;
    }

    // Fetch all articles
    async getAllArticles() {
        try {
            if (!this.db) {
                throw new Error('Database not connected');
            }
            const articles = await this.db.collection('articles').find().toArray();
            return articles;
        } catch (error) {
            console.error('Error fetching articles:', error);
            throw new Error('Failed to fetch articles');
        }
    }

    // Fetch article by name
    async getArticleByName(name) {
        try {
            const foundArticle = await this.db.collection('articles').findOne(
                { articleName: name }
            );
            return foundArticle;
        } catch (error) {
            console.error('Error fetching article:', error);
            throw new Error('Failed to fetch article');
        }
    }

    // Upvote an article
    async upvoteArticle(name, uid) {
        try {
            const article = await this.db.collection('articles').findOne({ articleName: name });

            if (!uid) {
                throw new Error('not have uid');
            }
            if (!article) {
                throw new Error('Article not found');
            }
            if (article.upvodIds?.includes(uid)) {
                throw new Error('Already upvoted');
            }

            const updatedArticle = await this.db.collection('articles').findOneAndUpdate(
                { articleName: name },
                { $inc: { upvotes: 1 }, $push: { upvodIds: uid } },
                { returnDocument: 'after' }
            );

            return updatedArticle;
        } catch (error) {
            console.error('Error upvoting article:', error);
            throw error;
        }
    }

    // Add comment to article
    async addComment(name, commentText) {
        try {
            const updatedArticle = await this.db.collection('articles').findOneAndUpdate(
                { articleName: name },
                { $push: { comments: commentText } },
                { returnDocument: 'after' }
            );
            return updatedArticle;
        } catch (error) {
            console.error('Error adding comment:', error);
            throw new Error('Failed to add comment');
        }
    }

    // Initialize articles if they don't exist
    async initializeArticles() {
        try {
            const articles = this.db.collection('articles');
            const existingArticles = await articles.countDocuments();

            if (existingArticles === 0) {
                await articles.insertMany([
                    {
                        articleName: 'learn-react',
                        upvotes: 0,
                        comments: [],
                    },
                    {
                        articleName: 'learn-node',
                        upvotes: 0,
                        comments: [],
                    },
                    {
                        articleName: 'learn-mongodb',
                        upvotes: 0,
                        comments: [],
                    }
                ]);
                console.log('Initial articles created');
            }
        } catch (error) {
            console.error('Error initializing articles:', error);
            throw error;
        }
    }
}
