# syntax=docker/dockerfile:1

# ARG NODE_VERSION=22

# FROM node:${NODE_VERSION}-alpine AS builder

# # Use production node environment by default.
# # ENV NODE_ENV=production

# WORKDIR /usr/src/app

# COPY ["package.json", "package-lock.json", "./"]

# RUN npm install

# COPY . .

# # Expose the port that the application listens on.
# EXPOSE 3000

# # Run the application.
# CMD ["npm", "run", "dev"]



FROM node:23-alpine as build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./

RUN npm install

# Copy source and build
COPY . .

RUN npm run build

# Step 2: Serve the app using Nginx
FROM nginx:alpine

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built React files
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: custom Nginx config (for SPA routing)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

