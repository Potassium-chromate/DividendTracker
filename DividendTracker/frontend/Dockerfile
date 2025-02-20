# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install dependencies
RUN npm install

# Build React app
RUN npm run build

# Install serve to serve static files
RUN npm install -g serve

# Expose port 5000 (or 3000 if you prefer, based on your configuration)
EXPOSE 3000

# Start server with dist folder (where Vite outputs the built files)
CMD ["serve", "-s", "dist"]

