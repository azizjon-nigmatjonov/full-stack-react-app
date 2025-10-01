import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import admin from 'firebase-admin'
import fs from 'fs'
import { fileURLToPath } from 'url';
import path from 'path';
import { OwnerAPI } from './owner.js';
import { UsersAPI } from './users.js';
import { MeAPI } from './me.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO_URL = !process.env.MONGODB_USERNAME ? 'mongodb://localhost:27017' : `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.tnwx56b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const DB_NAME = 'fullstack-app';
let db;
let ownerAPI;
let usersAPI;
let meAPI;

const app = express();
const PORT = process.env.PORT || 8888;

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


app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173', 'https://myportfolio-q88t.vercel.app', 'https://myportfolio-pied-eta-vykkrihxyw.vercel.app'], // Multiple frontend URLs
    credentials: true, // Allow cookies/credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'authtoken'],
    optionsSuccessStatus: 200 // For legacy browser support
}));

app.use(express.json());

async function connectToMongo() {
    try {
        const client = new MongoClient(MONGO_URL);
        await client.connect();
        db = client.db(DB_NAME);
        ownerAPI = new OwnerAPI(db);
        usersAPI = new UsersAPI(db);
        meAPI = new MeAPI(db);
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

app.get('/api/me', async (req, res) => {
    try {
        const user = await meAPI.getMe();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await usersAPI.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/users/:uid', async (req, res) => {

    try {
        const user = await usersAPI.getUserByUid(req.params.uid);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/articles', async (req, res) => {
    try {
        const articles = await ownerAPI.getAllArticles();
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/articles/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const foundArticle = await ownerAPI.getArticleByName(name);
        res.json(foundArticle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/me', async (req, res) => {
    try {
        const user = await meAPI.getMe();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/me', async (req, res) => {
    try {
        const updatedUser = await meAPI.updateMe(req.body);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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
    try {
        const { name } = req.params;
        const { uid } = req.user;
        const updatedArticle = await ownerAPI.upvoteArticle(name, uid);
        res.json(updatedArticle);
    } catch (error) {
        const statusCode = error.message === 'not have uid' ? 401 : 
                          error.message === 'Article not found' ? 404 : 
                          error.message === 'Already upvoted' ? 403 : 500;
        res.status(statusCode).json({ error: error.message });
    }
});

app.post('/api/articles/:name/comments', async (req, res) => {
    try {
        const { name } = req.params;
        const { nameText } = req.body;
        const updatedArticle = await ownerAPI.addComment(name, nameText);
        res.json(updatedArticle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

async function startServer() {
    await connectToMongo();
    await ownerAPI.initializeArticles();
    await usersAPI.initializeUsers();
    await meAPI.initializeMe();

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

startServer().catch(console.error);