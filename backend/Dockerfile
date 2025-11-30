# Backend Dockerfile
FROM node:22-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies (using install with legacy peer deps to handle conflicts)
RUN npm install --legacy-peer-deps

# Copy source code
COPY src ./src

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM node:22-slim

# Install OpenSSL and other dependencies for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

# Copy built application and Prisma files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/src/config/schema.prisma ./src/config/schema.prisma
COPY --from=builder /app/src/config/migrations ./src/config/migrations

# Create directory for database
RUN mkdir -p /app/data

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Run migrations and start server
CMD ["sh", "-c", "npx prisma@5.22.0 migrate deploy --schema=./src/config/schema.prisma && node dist/index.js"]

