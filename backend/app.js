const express = require("express");
require('dotenv').config();
const dbconnect = require('./src/config/db');
const port = process.env.PORT || 3000;

// Routes
const userRoute = require('./src/routes/user_routes');
const adminRoute = require('./src/routes/admin_routes');
const publicRouter = require('./src/routes/public_routes');

// Middleware
const createsession = require('./src/config/session');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require("path");
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
app.set("trust proxy", 1); 

// --- 1. SETTINGS & DB ---
dbconnect();

// --- 2. CORS CONFIGURATION ---
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://ecommerceproject-three-zeta.vercel.app"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- 3. RATE LIMITER DEFINITIONS (Must be defined before app.use) ---
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 500, 
    message: "Too many requests from this IP, please try again after 15 minutes",
    skip: (req) => req.ip === '::1' || req.ip === '127.0.0.1'
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20, 
    message: "Too many auth attempts from this IP, please try again after 15 minutes",
    skip: (req) => req.ip === '::1' || req.ip === '127.0.0.1'
});

// --- 4. GLOBAL MIDDLEWARE ---
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            connectSrc: ["'self'", "https://ecommerceproject-oau8.onrender.com"], 
            imgSrc: ["'self'", "data:", "blob:", "https://ecommerceproject-oau8.onrender.com", "https://via.placeholder.com"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
}));

app.use(globalLimiter);
app.use(express.json({ limit: '10kb' }));

// --- 5. SESSION & AUTH ---
// Session must be initialized before routes
app.use(createsession()); 
app.use('/api/auth', authLimiter);
app.use('/login', authLimiter);
app.use('/register', authLimiter);

// --- 6. ROUTES & STATIC FILES ---
// app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Removed during Cloudinary migration

app.use(userRoute);
app.use(adminRoute);
app.use(publicRouter);

// --- 7. ERROR HANDLING ---
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});