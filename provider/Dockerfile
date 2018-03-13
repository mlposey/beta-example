FROM node:9.8-alpine

RUN apk add --no-cache curl

WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

COPY . .

EXPOSE 8080
VOLUME /app/map

ENTRYPOINT npm start