FROM node:18.16.0-bullseye-slim as build

# Env
ARG NODE_ENVIRONMENT=production
ENV NODE_ENV=$NODE_ENVIRONMENT
ENV HTTP_PORT=80

# Work directory
WORKDIR /var/app

# Copy package.json & associated files
COPY ./package*.json ./

# Install dependencies
RUN npm ci --omit=dev --ignore-scripts

# Copy project files
COPY ./

# Run migrations
CMD ["npm", "run", "migrate:latest"]

# Start project 
CMD ["npm", "start"]

EXPOSE 80
