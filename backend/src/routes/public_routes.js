const express = require('express')
const router = express.Router()

const {getallprodects,getsingleprodect,getallcategory} = require('../controllers/publiccontroller')
const { getBanners } = require('../controllers/bannercontroller')

router.get('/api/products',getallprodects)
router.get('/api/products/:id',getsingleprodect)
router.get('/api/categorys',getallcategory)
router.get('/api/banners', getBanners)
const cloudinary = require('cloudinary').v2;

router.get('/api/test-cloudinary', async (req, res) => {
    try {
        const response = await cloudinary.api.ping();
        return res.status(200).json({
            success: true,
            message: "Cloudinary Connection Successful! API Keys are valid.",
            data: response
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Cloudinary Connection FAILED",
            error: err.message,
            diagnostic: {
                cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'UNDEFINED',
                apiKeyStart: process.env.CLOUDINARY_API_KEY ? process.env.CLOUDINARY_API_KEY.substring(0, 4) : 'UNDEFINED'
            }
        });
    }
});

module.exports = router