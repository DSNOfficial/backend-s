# Dockerfile
FROM node:18.20.2-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 9899

CMD ["nodemon", "index.js"]
