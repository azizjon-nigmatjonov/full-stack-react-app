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
import { ExperienceAPI } from './experience.js';
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
let experienceAPI;

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
        experienceAPI = new ExperienceAPI(db);
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

// ==================== Experience API Routes (Public GET endpoints) ====================

// About Me routes
app.get('/api/about-me', async (req, res) => {
    try {
        const aboutMe = await experienceAPI.getAboutMe();
        res.json(aboutMe);
    } catch (error) {
        const statusCode = error.message === 'About me not found' ? 404 : 500;
        res.status(statusCode).json({ error: error.message });
    }
});

// Contacts routes
app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await experienceAPI.getAllContacts();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/contacts/:id', async (req, res) => {
    try {
        const contact = await experienceAPI.getContactById(req.params.id);
        res.json(contact);
    } catch (error) {
        const statusCode = error.message === 'Contact not found' ? 404 : 500;
        res.status(statusCode).json({ error: error.message });
    }
});

// Experiences routes
app.get('/api/experiences', async (req, res) => {
    try {
        const experiences = await experienceAPI.getAllExperiences();
        res.json(experiences);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/experiences/:id', async (req, res) => {
    try {
        const experience = await experienceAPI.getExperienceById(req.params.id);
        res.json(experience);
    } catch (error) {
        const statusCode = error.message === 'Experience not found' ? 404 : 500;
        res.status(statusCode).json({ error: error.message });
    }
});

// Skills routes
app.get('/api/skills', async (req, res) => {
    try {
        const skills = await experienceAPI.getAllSkills();
        res.json(skills);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/skills/:id', async (req, res) => {
    try {
        const skill = await experienceAPI.getSkillById(req.params.id);
        res.json(skill);
    } catch (error) {
        const statusCode = error.message === 'Skill not found' ? 404 : 500;
        res.status(statusCode).json({ error: error.message });
    }
});

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

// ==================== Experience API Routes (Protected POST/PUT/DELETE endpoints) ====================

// About Me routes
app.post('/api/about-me', async (req, res) => {
    try {
        const aboutMe = await experienceAPI.createAboutMe(req.body);
        res.status(201).json(aboutMe);
    } catch (error) {
        const statusCode = error.message.includes('already exists') ? 409 : 500;
        res.status(statusCode).json({ error: error.message });
    }
});

app.put('/api/about-me', async (req, res) => {
    try {
        const updatedAboutMe = await experienceAPI.updateAboutMe(req.body);
        res.json(updatedAboutMe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/about-me', async (req, res) => {
    try {
        const result = await experienceAPI.deleteAboutMe();
        res.json(result);
    } catch (error) {
        const statusCode = error.message === 'About me not found' ? 404 : 500;
        res.status(statusCode).json({ error: error.message });
    }
});

// Contacts routes
app.post('/api/contacts', async (req, res) => {
    try {
        const contact = await experienceAPI.createContact(req.body);
        res.status(201).json(contact);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/contacts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedContact = await experienceAPI.updateContact(id, req.body);
        res.json(updatedContact);
    } catch (error) {
        const statusCode = error.message === 'Contact not found' ? 404 : 500;
        res.status(statusCode).json({ error: error.message });
    }
});

app.delete('/api/contacts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await experienceAPI.deleteContact(id);
        res.json(result);
    } catch (error) {
        const statusCode = error.message === 'Contact not found' ? 404 : 500;
        res.status(statusCode).json({ error: error.message });
    }
});

// Experiences routes
app.post('/api/experiences', async (req, res) => {
    try {
        const experience = await experienceAPI.createExperience(req.body);
        res.status(201).json(experience);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/experiences/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedExperience = await experienceAPI.updateExperience(id, req.body);
        res.json(updatedExperience);
    } catch (error) {
        const statusCode = error.message === 'Experience not found' ? 404 : 500;
        res.status(statusCode).json({ error: error.message });
    }
});

app.delete('/api/experiences/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await experienceAPI.deleteExperience(id);
        res.json(result);
    } catch (error) {
        const statusCode = error.message === 'Experience not found' ? 404 : 500;
        res.status(statusCode).json({ error: error.message });
    }
});

// Skills routes
app.post('/api/skills', async (req, res) => {
    try {
        const skill = await experienceAPI.createSkill(req.body);
        res.status(201).json(skill);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/skills/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedSkill = await experienceAPI.updateSkill(id, req.body);
        res.json(updatedSkill);
    } catch (error) {
        const statusCode = error.message === 'Skill not found' ? 404 : 500;
        res.status(statusCode).json({ error: error.message });
    }
});

app.delete('/api/skills/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await experienceAPI.deleteSkill(id);
        res.json(result);
    } catch (error) {
        const statusCode = error.message === 'Skill not found' ? 404 : 500;
        res.status(statusCode).json({ error: error.message });
    }
});

async function startServer() {
    await connectToMongo();
    await ownerAPI.initializeArticles();
    await usersAPI.initializeUsers();
    await meAPI.initializeMe();
    await portfolioAPI.initializePortfolios();
    await experienceAPI.initializeExperienceData();

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

startServer().catch(console.error);