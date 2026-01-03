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
import { PortfolioAPI } from './portfolio.js';
import { upload, handleImageUpload, handleMultipleImagesUpload, handleImageDelete, handleImagesList } from './upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO_URL = !process.env.MONGODB_USERNAME ? 'mongodb://localhost:27017' : `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.tnwx56b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const DB_NAME = 'fullstack-app';
let db;
let ownerAPI;
let usersAPI;
let meAPI;
let portfolioAPI;

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
  credential: admin.credential.cert(credentials),
  storageBucket: credentials.project_id + '.appspot.com' // Add storage bucket
});


app.use(cors({
    origin: true, // Allow all origins
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
        portfolioAPI = new PortfolioAPI(db);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

app.use(express.static(path.join(__dirname, 'dist')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// Portfolio route
app.get('/api/portfolios', async (req, res) => {
    try {
        const portfolios = await portfolioAPI.getAllPortfolios();
        res.json(portfolios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/portfolios/:id', async (req, res) => {
    try {
        const portfolio = await portfolioAPI.getPortfolioById(req.params.id);
        res.json(portfolio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Public image listing endpoint (no auth required)
app.get('/api/images', (req, res, next) => {
    req.portfolioAPI = portfolioAPI;
    next();
}, handleImagesList);

// Protected portfolio routes
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

// Image upload routes (protected by authentication middleware above)
app.post('/api/upload-image', (req, res, next) => {
    req.portfolioAPI = portfolioAPI;
    next();
}, upload.single('image'), handleImageUpload);

app.post('/api/upload-images', (req, res, next) => {
    req.portfolioAPI = portfolioAPI;
    next();
}, upload.array('images', 10), handleMultipleImagesUpload);

app.delete('/api/images/:id', (req, res, next) => {
    req.portfolioAPI = portfolioAPI;
    next();
}, handleImageDelete);

app.post('/api/portfolios', async (req, res) => {
    try {
        const portfolio = await portfolioAPI.createPortfolio(req.body);
        res.status(201).json(portfolio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/portfolios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPortfolio = await portfolioAPI.updatePortfolio(id, req.body);
        res.json(updatedPortfolio);
    } catch (error) {
        const statusCode = error.message === 'Portfolio not found' ? 404 : 500;
        res.status(statusCode).json({ error: error.message });
    }
});

app.delete('/api/portfolios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await portfolioAPI.deletePortfolio(id);
        res.json(result);
    } catch (error) {
        const statusCode = error.message === 'Portfolio not found' ? 404 : 500;
        res.status(statusCode).json({ error: error.message });
    }
});

async function startServer() {
    await connectToMongo();
    await ownerAPI.initializeArticles();
    await usersAPI.initializeUsers();
    await meAPI.initializeMe();
    await portfolioAPI.initializePortfolios();

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

startServer().catch(console.error);