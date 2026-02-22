# Stage 1: Build the application
# Use specific Node.js version for building to ensure consistency
FROM node:18 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy dependency definitions first to leverage Docker cache
COPY package*.json ./

# Install dependencies based on the package-lock.json
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React application for production
# This generates the 'dist' folder
RUN npm run build

# Stage 2: Serve the application
# Use a lightweight Alpine image to reduce the final image size
FROM node:18-alpine

# Set working directory for the runtime container
WORKDIR /app

# Install 'serve' package globally to serve static files
RUN npm install -g serve

# Copy built artifacts from the 'builder' stage
# Only the compiled files are needed, not the source code
COPY --from=builder /app/dist ./dist

# Expose port 3000 for external access
EXPOSE 3000

# Start the static file server pointing to the dist folder
CMD ["serve", "-s", "dist", "-l", "3000"]
