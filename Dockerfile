FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

RUN mkdir -p /app/data

CMD ["node", "src/index.js"]
