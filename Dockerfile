# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle your app's source code
COPY . .

# Expose a port that the application will listen on
EXPOSE 8080

# Define the command to run your application
CMD [ "npm", "run", "start" ]
