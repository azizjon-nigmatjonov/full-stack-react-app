import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import admin from 'firebase-admin'
import fs from 'fs'
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO_URL = !process.env.MONGODB_USERNAME ? 'mongodb://localhost:27017' : `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.tnwx56b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const DB_NAME = 'fullstack-app';
let db;

const app = express();
const PORT = process.env.PORT || 3000;

let credentials;
if (process.env.FIREBASE_CREDENTIALS) {
    // Use environment variable in production
    credentials = JSON.parse(process.env.FIREBASE_CREDENTIALS);
} else {
    // Use local file in development
    credentials = JSON.parse(fs.readFileSync('./credentials.json'));
}
admin.initializeApp({
  credential: admin.credential.cert(credentials)
});


app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true, // Allow cookies/credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

async function connectToMongo() {
    try {
        const client = new MongoClient(MONGO_URL);
        await client.connect();
        db = client.db(DB_NAME);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

app.use(express.static(path.join(__dirname, 'dist')));

app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/api/articles', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ error: 'Database not connected' });
        }
        const articles = await db.collection('articles').find().toArray();
        res.json(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});

app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params;
    const foundArticle = await db.collection('articles').findOne(
        { articleName: name },
    );

    res.json(foundArticle);
});

app.use(async function(req, res, next) {
    const {authtoken} = req.headers;
    if (authtoken) {
        const user = await admin.auth().verifyIdToken(authtoken);
        req.user = user;
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}) 

app.put('/api/articles/:name/upvote', async (req, res) => {
    const { name } = req.params;
    const { uid } = req.user
    
    const article = await db.collection('articles').findOne({ articleName: name });

    if (!uid) {
        return res.status(401).json({ error: 'not have uid' });
    }
    if (!article) {
        return res.status(404).json({ error: 'Article not found' });
    }
    if (article.upvodIds?.includes(uid)) {
        return res.status(403).json({ error: 'Already upvoted' });
    }

    const updatedArticle = await db.collection('articles').findOneAndUpdate(
        { articleName: name },
        { $inc: { upvotes: 1 }, $push: { upvodIds: uid  } },
        { returnDocument: 'after' }
    );

    res.json(updatedArticle);
});

app.post('/api/articles/:name/comments', (req, res) => {
    const { name } = req.params;
    const { nameText } = req.body;
    const updatedArticle = db.collection('articles').findOneAndUpdate(
        { articleName: name },
        { $push: { comments: nameText }},
        { returnDocument: 'after' }
    );

    res.json(updatedArticle);
});

async function startServer() {
    await connectToMongo();

    // Initialize articles if they don't exist
    const articles = db.collection('articles');
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

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

startServer().catch(console.error);