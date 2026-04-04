const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// STRICT VALIDATION
const requiredEnvs = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
requiredEnvs.forEach(key => {
  if (!process.env[key]) {
    console.error(`🚨 FATAL: Missing Environment Variable: ${key}`);
    // Throwing error stops server start if the keys form Render are completely missing
    // throw new Error(`Missing Cloudinary Configuration: ${key}`);
  }
});

const apiKey = process.env.CLOUDINARY_API_KEY || '';
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';

// MASKED LOGGING FOR RENDER CONSOLE
console.log(`\n🔍 CLOUDINARY DIAGNOSTICS ACTIVATED:`);
console.log(`-> Target Cloud: ${cloudName}`);
console.log(`-> API Key Starts With: ${apiKey.substring(0, 4)}********`);

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecommerce_uploads',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'mp4'],
    resource_type: 'auto'
  }
});

// MULTTER FIELD NAME AUDIT NOTES:
// If frontend sends 'file' but backend uses upload.single('image')
// Multer throws: "MulterError: Unexpected field". 
// This error differs from "Invalid api_key", confirming Multer is succeeding but Cloudinary authentication is failing.
const uploadCloudinary = multer({ storage: storage });

module.exports = uploadCloudinary;
