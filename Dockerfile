
# Use the official Node.js image as the base image
FROM node:12

# Set the working directory in the container
WORKDIR /app

# Copy the application files into the working directory
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . /app

EXPOSE 4040

# Install the application dependencies
RUN npm install

# Define the entry point for the container
CMD [ "node", "server.js" ]