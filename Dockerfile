# Stage 1: Build Frontend
FROM node:20-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Serve Backend & Frontend
FROM node:20-alpine
WORKDIR /app
# Set environment to production
ENV NODE_ENV=production

# Install PM2 globally for process management
RUN npm install -g pm2

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./

# Copy built frontend assets to the location expected by backend/app.js
COPY --from=build-frontend /app/frontend/dist ../frontend/dist

# Expose backend port
EXPOSE 3001

# Start the application with PM2
CMD ["pm2-runtime", "app.js"]
