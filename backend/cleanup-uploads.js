require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('./src/models/product_model');
const Banner = require('./src/models/banner_model');
const Category = require('./src/models/category_model');

async function main() {
    try {
        console.log("Starting...");
        await mongoose.connect(process.env.MONGOURL);
        console.log("Connected...");
        let count = 0;
        const products = await Product.find({}, 'image');
        const dbFiles = new Set();
        const extractFilename = (urlPath) => {
            if (!urlPath) return null;
            const parts = urlPath.split('/');
            return parts[parts.length - 1];
        };
        products.forEach(p => {
            const f = extractFilename(p.image);
            if (f) dbFiles.add(f);
        });
        const banners = await Banner.find({}, 'src');
        banners.forEach(b => {
             const f = extractFilename(b.src);
             if (f) dbFiles.add(f);
        });
        const categories = await Category.find({}, 'image');
        categories.forEach(c => {
             const f = extractFilename(c.image);
             if (f) dbFiles.add(f);
        });
        
        console.log(`Found ${dbFiles.size} unique referenced files in DB.`);
        
        const uploadsDir = path.join(__dirname, 'uploads');
        const filesOnDisk = fs.readdirSync(uploadsDir);
        let deleted = 0;
        for (const file of filesOnDisk) {
            if (!dbFiles.has(file)) {
                 fs.unlinkSync(path.join(uploadsDir, file));
                 deleted++;
                 console.log("Deleted unused file: " + file);
            }
        }
        console.log(`Finished! Deleted ${deleted} orphaned files out of ${filesOnDisk.length}.`);
    } catch (e) {
        fs.writeFileSync('my_error.txt', e.stack);
        console.error("Failed", e);
    } finally {
        mongoose.disconnect();
    }
}
main();
