# Multi-stage Docker build for production optimization
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci --prefer-offline --no-audit

# Copy source code and configuration files
COPY tsconfig.json ./
COPY src ./src

# Build the TypeScript application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Set NODE_ENV to production
ENV NODE_ENV=production

# Create app directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
  adduser -S taxi-app -u 1001

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production --prefer-offline --no-audit && \
  npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=taxi-app:nodejs /app/dist ./dist

# Copy additional necessary files
COPY --chown=taxi-app:nodejs .env.example .env.example

# Create uploads directory for file uploads
RUN mkdir -p uploads && chown taxi-app:nodejs uploads

# Switch to non-root user
USER taxi-app

# Expose port
EXPOSE 3001

# Health check with improved reliability
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }).on('error', () => { process.exit(1); });"

# Start the application
CMD ["node", "dist/index.js"]