# Use the official Node image as base
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Build the React app
RUN npm run build

# Serve the build using a lightweight HTTP server
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]