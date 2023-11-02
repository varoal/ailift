# This is the Dockerfile for the Angular frontend
FROM node:18.15-alpine

# Install Angular CLI globally in the container
RUN npm install -g @angular/cli@"~16.0.0"

# Create app directory and set user permissions
RUN mkdir /app && chown node:node /app

WORKDIR /app

# Copy package.json and package-lock.json
COPY frontend/package.json frontend/package-lock.json ./

# Install app dependencies
RUN npm install

# Copy the rest of your frontend source code
COPY frontend/ ./

# The Angular CLI serves the app on port 4200 by default
EXPOSE 4200

# Start the Angular app using the CLI
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]
