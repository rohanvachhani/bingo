<<<<<<< HEAD
=======
bashCopy code
>>>>>>> 11324092339a911f3a370b4e24f02f6c54e46844
# Use the official Node.js image as the base image
FROM node:12

# Set the working directory in the container
WORKDIR /app

# Copy the application files into the working directory
COPY . /app

# Install the application dependencies
RUN npm install

# Define the entry point for the container
CMD ["npm", "start"]