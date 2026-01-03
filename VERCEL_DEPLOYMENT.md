# Vercel Deployment Guide

## MongoDB Connection Error Fix

The error `querySrv ENOTFOUND _mongodb._tcp.cluster0.tnwx56b.mongodb.net` typically occurs due to:

1. **Missing or incorrect environment variables**
2. **MongoDB Atlas IP whitelist restrictions**
3. **Incorrect connection string format**

## Steps to Fix:

### 1. Set Environment Variables in Vercel

Go to your Vercel project dashboard → Settings → Environment Variables and add:

**Option A: Use Full Connection String (Recommended)**
```
MONGODB_URI=mongodb+srv://full-stack-react-server:ArCtfpkC7RgKw05h@cluster0.tnwx56b.mongodb.net/fullstack-app?retryWrites=true&w=majority&appName=Cluster0
```

**Option B: Use Individual Credentials**
```
MONGODB_USERNAME=full-stack-react-server
MONGODB_PASSWORD=ArCtfpkC7RgKw05h
DB_NAME=fullstack-app
```

### 2. Set Firebase Credentials

Add your Firebase credentials as an environment variable:
```
FIREBASE_CREDENTIALS={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

**Important:** The entire JSON object should be on one line as a string.

### 3. Configure MongoDB Atlas Network Access

1. Go to MongoDB Atlas Dashboard
2. Navigate to **Network Access** (or **IP Access List**)
3. Click **Add IP Address**
4. Click **Allow Access from Anywhere** (0.0.0.0/0) - This allows Vercel's dynamic IPs
5. Save the changes

**Note:** For production, you might want to restrict this, but Vercel uses dynamic IPs, so allowing all IPs is often necessary.

### 4. Verify Connection String Format

Make sure your MongoDB connection string includes:
- ✅ Username and password
- ✅ Cluster hostname
- ✅ Database name (after the `/`)
- ✅ Connection options (`?retryWrites=true&w=majority`)

Example format:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database-name?retryWrites=true&w=majority&appName=Cluster0
```

### 5. Redeploy

After setting environment variables:
1. Go to Vercel Dashboard → Deployments
2. Click the three dots on the latest deployment
3. Click **Redeploy**

Or push a new commit to trigger a new deployment.

## Troubleshooting

### Still getting connection errors?

1. **Check environment variables are set correctly:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Make sure they're set for **Production**, **Preview**, and **Development** environments

2. **Test the connection string locally:**
   ```bash
   # Test if the connection string works
   node -e "const {MongoClient} = require('mongodb'); const client = new MongoClient('YOUR_CONNECTION_STRING'); client.connect().then(() => console.log('Connected!')).catch(e => console.error(e));"
   ```

3. **Check MongoDB Atlas logs:**
   - Go to MongoDB Atlas → Monitoring → Logs
   - Look for connection attempts and errors

4. **Verify database name:**
   - Make sure the database `fullstack-app` exists in your MongoDB Atlas cluster

## Additional Notes

- The server is now configured to work with Vercel's serverless functions
- MongoDB connection is initialized on first request (lazy loading)
- Connection is cached for subsequent requests in the same serverless function instance

