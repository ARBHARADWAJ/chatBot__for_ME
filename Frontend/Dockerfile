# Stage 1: Build the React application
FROM node:18-slim as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Copy the build output from the build stage to Nginx's web server directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# The Nginx image will automatically start the server.
# The default command is "nginx -g 'daemon off;'".
# We will add a custom config file to handle SPA routing.
COPY nginx.conf /etc/nginx/conf.d/default.conf
