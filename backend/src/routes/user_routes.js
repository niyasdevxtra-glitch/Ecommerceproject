const express = require('express');
const router = express.Router();

const { register, login, userupdate, logout } = require('../controllers/usercontroller');
const { addtocart, getcart, updatecart, removeItem, mergecart } = require('../controllers/cartcontroller');
const { createorder, getallorders, getorderbyid, cancelorder } = require('../controllers/ordercontroller');
const { isauthenticated } = require('../middleware/isauthenticated');

// User Routes
router.post('/register', register);
router.post('/login', login);
router.post('/user/update', isauthenticated, userupdate);
router.post('/logout', isauthenticated, logout);

// Cart Routes
router.post('/cart', isauthenticated, addtocart);
router.get('/cart', isauthenticated, getcart);
router.put('/cart', isauthenticated, updatecart);
router.delete('/cart', isauthenticated, removeItem);
router.post('/cart/merge', isauthenticated, mergecart);

// Order Routes
router.post('/order', isauthenticated, createorder);
router.get('/order', isauthenticated, getallorders);
router.get('/order/:id', isauthenticated, getorderbyid);
router.delete('/order/:id', isauthenticated, cancelorder);

module.exports = router;