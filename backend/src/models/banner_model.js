const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema({
    type: { type: String, enum: ['image', 'video'], required: true },
    category: { type: String, enum: ['main', 'new_launch', 'top', 'category_section'], required: true },
    productCategory: { type: String }, 
    src: { type: String }, // image or video URL (can be empty for text)
    title: { type: String },
    highlight: { type: String },
    subtitle: { type: String },
    link: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('banners', bannerSchema);
