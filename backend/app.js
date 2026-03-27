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

// Database Connection
dbconnect();

// CORS configuration early to ensure all responses (including errors/limits) have headers
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Global Middleware
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 500, // Increased for dev/testing
    message: "Too many requests from this IP, please try again after 15 minutes",
    skip: (req) => req.ip === '::1' || req.ip === '127.0.0.1'
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20, // Increased for dev/testing
    message: "Too many auth attempts from this IP, please try again after 15 minutes",
    skip: (req) => req.ip === '::1' || req.ip === '127.0.0.1'
});

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            connectSrc: ["'self'", "http://localhost:3001"],
            imgSrc: ["'self'", "data:", "blob:", "http://localhost:3001", "https://via.placeholder.com"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
}));
app.use(globalLimiter);

// Protect sensitive routes with stricter rate limiting
app.use('/api/auth', authLimiter);
app.use('/login', authLimiter);
app.use('/register', authLimiter);

app.use(express.json({ limit: '10kb' }));
app.use(createsession());

// Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use(userRoute);
app.use(adminRoute);
app.use(publicRouter);

// Global Error Handler
app.use(errorHandler);

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
        }
    });
}

// Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
