const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
    console.log(`❌ Directory does not exist: ${uploadsDir}`);
    console.log('This often happens on Render Free Tier after a restart because of ephemeral storage.');
} else {
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            console.error(`Error reading ${uploadsDir}:`, err);
            return;
        }
        
        if (files.length === 0) {
            console.log(`⚠️ The directory exists at ${uploadsDir}, but it is empty.`);
        } else {
            console.log(`✅ Found ${files.length} file(s) in ${uploadsDir}:`);
            files.forEach(file => {
                console.log(`- ${file}`);
            });
        }
    });
}
