FROM node:18.15-alpine

# Create the directory and set permissions
RUN mkdir /src && chown node:node /src

WORKDIR /src

# Copy package.json and package-lock.json
COPY backend/package.json backend/package-lock.json ./

# Install dependencies
RUN npm install --silent

# Copy the rest of your application source code
COPY backend/ ./

# Switch to a non-root user
USER node

CMD ["npm", "start"]