FROM node:18  

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# Expose ports for backend and websocket
EXPOSE 8000 8080 3001 

# Start both Strapi and WebSocket
CMD ["sh", "-c", "npm run dev & cd src && node ."]