FROM node:18  

# Create app directory
WORKDIR /usr/src/app

# Copy package.json และติดตั้ง dependencies
COPY package*.json ./
RUN npm install

# Copy โค้ดทั้งหมดเข้าไปใน Container
COPY . .

# ✅ ตั้งค่าให้ใช้งาน Production Mode
ENV NODE_ENV=production

# เปิด Port 3000 สำหรับ React
EXPOSE 3000

CMD ["npm", "run", "dev"]