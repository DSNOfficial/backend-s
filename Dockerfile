FROM node:18.19.1
ENV TZ="Asia/Bangkok"
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 9899
CMD ["npm", "run", "start"]
