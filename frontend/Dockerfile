# Use official node image
FROM node:16-alpine

# Set working directory to /frontend
WORKDIR /frontend

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm install
RUN npm install react-scripts@3.4.1 -g
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

# Copy app contents to container
COPY . ./

# Expose port 3000
EXPOSE 3000

USER node

CMD ["npm", "start"]
