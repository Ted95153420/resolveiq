FROM node:24-alpine

WORKDIR /app

COPY streaming/consumer/package*.json ./streaming/consumer/
RUN cd streaming/consumer && npm ci

COPY server ./server
COPY streaming/consumer ./streaming/consumer

WORKDIR /app/streaming/consumer

CMD ["npm", "start"]