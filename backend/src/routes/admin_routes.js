const express = require('express')
const router = express.Router()

const {createproduct,
    updateproduct,
    deleteproduct,
    listallusers,
    createcategory,
    updatecategory,
    deletecategory,
    getallordersadmin,
    updateorderstatus,
    adminUpdateUser} =require('../controllers/admincontroller')

const { createBanner, deleteBanner, updateBanner } = require('../controllers/bannercontroller')

const {isauthenticated} = require('../middleware/isauthenticated')
const {isadmin} = require('../middleware/isadmin')
const upload  = require("../middleware/multer")

router.post('/admin/products',isauthenticated,isadmin,upload.single('image'),createproduct)
router.put('/admin/products/:id',isauthenticated,isadmin,upload.single('image'),updateproduct)
router.delete('/admin/products/:id',isauthenticated,isadmin,deleteproduct)

router.get('/admin/users',isauthenticated,isadmin,listallusers)
router.put('/admin/users/:id',isauthenticated,isadmin,adminUpdateUser)

router.post('/admin/category',isauthenticated,isadmin,upload.single('image'),createcategory)
router.put('/admin/category/:id',isauthenticated,isadmin,upload.single('image'),updatecategory)
router.delete('/admin/category/:id',isauthenticated,isadmin,deletecategory)

router.get('/admin/orders',isauthenticated,isadmin,getallordersadmin)
router.put('/admin/orders/:id',isauthenticated,isadmin,updateorderstatus)

// Banner API Routes
router.post('/admin/banners',isauthenticated,isadmin,upload.single('image'),createBanner)
router.put('/admin/banners/:id',isauthenticated,isadmin,upload.single('image'),updateBanner)
router.delete('/admin/banners/:id',isauthenticated,isadmin,deleteBanner)

module.exports = router