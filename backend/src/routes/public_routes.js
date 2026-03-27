const express = require('express')
const router = express.Router()

const {getallprodects,getsingleprodect,getallcategory} = require('../controllers/publiccontroller')
const { getBanners } = require('../controllers/bannercontroller')

router.get('/api/products',getallprodects)
router.get('/api/products/:id',getsingleprodect)
router.get('/api/categorys',getallcategory)
router.get('/api/banners', getBanners)

module.exports = router