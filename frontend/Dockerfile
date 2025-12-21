# Frontend Dockerfile
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code and public assets
COPY src ./src
COPY public ./public
# Note: webpack.config.ts is optional

# Build arguments for environment variables
ARG REACT_APP_API_URL
ARG REACT_APP_STATUS_API_URL
ARG REACT_APP_SERVER_STATUS_URL
ARG REACT_APP_SERVER_NAME

# Set environment variables for build
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_STATUS_API_URL=$REACT_APP_STATUS_API_URL
ENV REACT_APP_SERVER_STATUS_URL=$REACT_APP_SERVER_STATUS_URL
ENV REACT_APP_SERVER_NAME=$REACT_APP_SERVER_NAME

# Build the application
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

