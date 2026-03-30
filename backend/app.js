const express = require("express");
require('dotenv').config();
const dbconnect = require('./src/config/db');
const port = process.env.PORT || 3000;

// ... (Routes)
const userRoute = require('./src/routes/user_routes');
const adminRoute = require('./src/routes/admin_routes');
const publicRouter = require('./src/routes/public_routes');

// ... (Middleware)
const createsession = require('./src/config/session');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require("path");
const errorHandler = require('./src/middleware/errorHandler');

const app = express();


app.set("trust proxy", 1); 

// Database Connection
dbconnect();


app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://ecommerceproject-three-zeta.vercel.app"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// ... (Limiters & Helmet remain the same)
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

app.use(createsession()); 

// Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use(userRoute);
app.use(adminRoute);
app.use(publicRouter);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
