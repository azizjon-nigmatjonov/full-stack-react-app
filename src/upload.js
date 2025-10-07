import multer from 'multer';
import admin from 'firebase-admin';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
    }
};

// Multer configuration
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

// Get Firebase Storage bucket
const getBucket = () => {
    return admin.storage().bucket('gs://your-project-id.appspot.com'); // Replace with your Firebase Storage bucket URL
};

/**
 * Upload image to Firebase Storage
 * @param {Buffer} fileBuffer - The file buffer from multer
 * @param {String} originalName - Original filename
 * @param {String} mimetype - File mimetype
 * @param {String} folder - Optional folder path in storage (e.g., 'portfolios', 'profiles')
 * @returns {Promise<String>} - Public URL of uploaded image
 */
export const uploadImageToFirebase = async (fileBuffer, originalName, mimetype, folder = 'images') => {
    try {
        const bucket = getBucket();
        
        // Generate unique filename
        const timestamp = Date.now();
        const fileName = `${folder}/${timestamp}-${originalName.replace(/\s+/g, '-')}`;
        
        // Create a file reference
        const file = bucket.file(fileName);
        
        // Upload file buffer
        await file.save(fileBuffer, {
            metadata: {
                contentType: mimetype,
            },
            public: true, // Makes the file publicly accessible
        });
        
        // Make the file public and get URL
        await file.makePublic();
        
        // Return public URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        return publicUrl;
        
    } catch (error) {
        console.error('Error uploading image to Firebase:', error);
        throw new Error('Failed to upload image');
    }
};

/**
 * Delete image from Firebase Storage
 * @param {String} imageUrl - The public URL of the image
 * @returns {Promise<Boolean>}
 */
export const deleteImageFromFirebase = async (imageUrl) => {
    try {
        const bucket = getBucket();
        
        // Extract filename from URL
        const urlParts = imageUrl.split('/');
        const fileName = decodeURIComponent(urlParts.slice(4).join('/'));
        
        // Delete the file
        await bucket.file(fileName).delete();
        
        return true;
    } catch (error) {
        console.error('Error deleting image from Firebase:', error);
        throw new Error('Failed to delete image');
    }
};

/**
 * Express route handler for single image upload
 */
export const handleImageUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        const folder = req.body.folder || 'images';
        
        const imageUrl = await uploadImageToFirebase(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype,
            folder
        );
        
        res.json({
            success: true,
            imageUrl: imageUrl,
            message: 'Image uploaded successfully'
        });
        
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to upload image' 
        });
    }
};

/**
 * Express route handler for multiple images upload
 */
export const handleMultipleImagesUpload = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }
        
        const folder = req.body.folder || 'images';
        
        // Upload all images in parallel
        const uploadPromises = req.files.map(file => 
            uploadImageToFirebase(
                file.buffer,
                file.originalname,
                file.mimetype,
                folder
            )
        );
        
        const imageUrls = await Promise.all(uploadPromises);
        
        res.json({
            success: true,
            imageUrls: imageUrls,
            count: imageUrls.length,
            message: 'Images uploaded successfully'
        });
        
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to upload images' 
        });
    }
};

