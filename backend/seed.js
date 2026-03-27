const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./src/models/product_model');
const Category = require('./src/models/category_model');
const Banner = require('./src/models/banner_model');
const User = require('./src/models/user_model');
const bcrypt = require('bcrypt');

const seedData = async () => {
    try {
        if (!process.env.MONGOURL) {
            console.error('MONGOURL not found in .env');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGOURL);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data for a clean launch state
        console.log('Cleaning up existing data...');
        await Product.deleteMany({});
        await Category.deleteMany({});
        await Banner.deleteMany({});
        
        // Ensure a clean admin user exists
        await User.deleteMany({ role: 'admin' });
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            username: 'Admin',
            email: 'admin@pixelmobails.com',
            password: hashedPassword,
            role: 'admin'
        });
        console.log('Admin user created: admin@pixelmobails.com / admin123');

        // 1. Create Professional Categories
        console.log('Seeding categories...');
        const categories = await Category.insertMany([
            { name: 'Phones', discription: 'Latest flagship devices and high-performance smartphones.' },
            { name: 'Watches', discription: 'Premium smartwatches and professional chronographs.' },
            { name: 'Headset', discription: 'High-fidelity audio and active noise-cancelling headphones.' },
            { name: 'Speakers', discription: 'Powerful wireless speakers and home audio systems.' },
            { name: 'Airpords', discription: 'Seamless wireless earbuds for an untethered life.' }
        ]);

        // 2. Create Professional Products
        console.log('Seeding products...');
        await Product.insertMany([
            {
                name: 'iPhone 17 Pro',
                description: 'The ultimate smartphone with titanium design and A19 Pro chip.',
                price: 129999,
                category: 'Phones',
                stock: 50,
                image: 'iphone-17.jpg'
            },
            {
                name: 'Pixel 10 Pro',
                description: 'Google AI at its best with the most advanced mobile camera.',
                price: 99999,
                category: 'Phones',
                stock: 35,
                image: 'pixel-10.jpg'
            },
            {
                name: 'Sony WH-1000XM6',
                description: 'Industry-leading noise cancellation and industry-defining sound.',
                price: 29999,
                category: 'Headset',
                stock: 100,
                image: 'sony-xm6.jpg'
            },
            {
                name: 'Apple Watch Ultra 3',
                description: 'The most rugged and capable Apple Watch ever built.',
                price: 89999,
                category: 'Watches',
                stock: 25,
                image: 'apple-watch-ultra.jpg'
            },
            {
                name: 'Marshall Stanmore III',
                description: 'The legendary speaker with room-filling sound and vintage style.',
                price: 45000,
                category: 'Speakers',
                stock: 15,
                image: 'marshall-stanmore.jpg'
            }
        ]);

        // 3. Create Launch Banners
        console.log('Seeding banners...');
        await Banner.insertMany([
            {
                type: 'image',
                category: 'main',
                title: 'Future in Your Hand',
                subtitle: 'Discover the iPhone 17 Pro and flagship smartphones.',
                highlight: 'Flash Launch',
                src: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2000&auto=format&fit=crop',
                link: '/products'
            },
            {
                type: 'image',
                category: 'top',
                title: 'High-Fidelity Audio',
                subtitle: 'Precision sound for the most demanding ears.',
                highlight: 'Premium Gear',
                src: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2000&auto=format&fit=crop',
                productCategory: 'Headset',
                link: '/products'
            },
            {
                type: 'image',
                category: 'new_launch',
                title: 'Pixel 10 Pro',
                subtitle: 'The smartest AI phone is here.',
                highlight: 'Just In',
                src: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=2000&auto=format&fit=crop',
                link: '/products'
            }
        ]);

        console.log('Seeding completed successfully! 🚀');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
