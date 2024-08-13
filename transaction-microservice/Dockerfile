# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Install Prisma CLI
RUN npm install -g prisma

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN prisma generate

RUN chmod +x docker-entrypoint.sh

# Use the custom entrypoint script
ENTRYPOINT ["./docker-entrypoint.sh"]

# Expose the port that the app runs on
EXPOSE 3001

# Define the command to run the application

CMD ["npm", "run", "start:prod"]