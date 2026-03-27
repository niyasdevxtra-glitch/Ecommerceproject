# Pixel Mobails - Premium E-commerce Storefront

A high-performance, full-stack e-commerce platform built for speed, security, and a premium user experience.

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, GSAP (Animations), Tailwind CSS, Lucide React
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **State Management**: React Context API
- **Security**: Helmet, Bcrypt (10 rounds), Express Rate Limit

## 🛠️ Performance & Security Optimizations

This project underwent a rigorous technical audit to ensure readiness for high-traffic (10k+ users) production environments.

### 1. Memory Efficiency & Animation Cleanup
- **GSAP Context**: All animations are wrapped in `gsap.context()` to ensure proper garbage collection and prevent memory leaks during route transitions.
- **Request Cancellation**: Integrated `AbortController` across all data-fetching hooks to cancel pending API requests when components unmount, saving bandwidth and preventing state updates on unmounted components.

### 2. LCP & Asset Optimization
- **Priority Loading**: Implemented `fetchpriority="high"` and `eager` loading for 'Hero' assets to optimize the Largest Contentful Paint (LCP).
- **Lazy Loading**: Standardized `loading="lazy"` for all off-screen product imagery to improve initial page load speed.

### 3. Backend Hardening
- **Security Headers**: Custom Helmet configuration with strict Content Security Policy (CSP) and Cross-Origin Resource Policy (CORP).
- **Payload Protection**: Strict 10kb JSON body limits and input sanitization layers to prevent DoS attacks and injection.
- **Rate Limiting**: Multi-tiered rate limiting (Global + Auth-specific) to mitigate brute-force and scraping attempts.

### 4. Database Performance
- **Indexed Queries**: Implemented MongoDB indexes on `category`, `name`, and `user` fields, achieving sub-300ms response times even under simulated load.
- **Non-blocking I/O**: Audited all controllers to ensure zero synchronous blocking calls on the Node.js event loop.

## 📦 Deployment

### Production Start (PM2)
The backend is configured for PM2 process management to ensure 100% uptime and automatic restarts.
```bash
cd backend
npm run production-start
```

### Docker
Deploy the entire stack in seconds using Docker:
```bash
docker-compose up --build
```

## 🧪 Seeding Data
To populate the database with professional launch-ready data:
```bash
cd backend
node seed.js
```

---
*Built with ❤️ and optimized for performance.*
