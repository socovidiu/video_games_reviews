# Base image with Node.js
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy dependency files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Expose the port your server runs on (adjust if needed)
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]