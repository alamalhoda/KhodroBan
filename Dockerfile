# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./frontend/

# Install dependencies
WORKDIR /app/frontend
RUN npm ci

# Copy source code
COPY frontend/ ./

# Build
ENV NODE_ENV=production
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/frontend/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

