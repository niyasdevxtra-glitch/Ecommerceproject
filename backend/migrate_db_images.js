require('dotenv').config();
const mongoose = require('mongoose');

// Import exact Mongoose models based on your architecture
const Product = require('./src/models/product_model');
const Banner = require('./src/models/banner_model');

// The optimized Cloudinary Base URL (configured with q_auto,f_auto)
const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dw8zflhiy/image/upload/q_auto,f_auto/v1/ecommerce_uploads/';

async function runMigration() {
    try {
        console.log("Connecting securely via process.env.MONGOURL...");
        await mongoose.connect(process.env.MONGOURL);
        console.log("Connected Successfully.");

        let productsUpdated = 0;
        let bannersUpdated = 0;

        // --- 1. PRODUCT MIGRATION ---
        const products = await Product.find({});
        for (const pd of products) {
            // Idempotency: skip if missing image, or firmly starts with 'http'
            if (pd.image && !pd.image.startsWith('http')) {
                const oldVal = pd.image;
                
                // Strip stray upload directories to extract raw filename just in case
                const cleanFilename = oldVal.replace(/^\/?uploads\//, '');
                
                pd.image = CLOUDINARY_BASE_URL + cleanFilename;
                await pd.save();
                
                console.log(`[Product Refactor] Updated: ${oldVal}  ->  ${pd.image}`);
                productsUpdated++;
            }
        }

        // --- 2. BANNER MIGRATION ---
        const banners = await Banner.find({});
        for (const bn of banners) {
            // Banners use the 'src' field. Skip if missing or starts with http.
            if (bn.src && !bn.src.startsWith('http')) {
                const oldVal = bn.src;
                
                const cleanFilename = oldVal.replace(/^\/?uploads\//, '');
                
                bn.src = CLOUDINARY_BASE_URL + cleanFilename;
                await bn.save();
                
                console.log(`[Banner Refactor] Updated: ${oldVal}  ->  ${bn.src}`);
                bannersUpdated++;
            }
        }

        console.log(`\n--- MIGRATION COMPLETE ---`);
        console.log(`Products Updated: ${productsUpdated}`);
        console.log(`Banners Updated:  ${bannersUpdated}`);
        process.exit(0);
        
    } catch (err) {
        console.error("CRITICAL FATAL:", err);
        process.exit(1);
    }
}

runMigration();
