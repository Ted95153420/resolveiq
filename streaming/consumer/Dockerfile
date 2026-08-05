FROM node:24-alpine

WORKDIR /app

# Copy root workspace files.
COPY package.json package-lock.json ./

# Copy all workspace manifests so npm can resolve local packages.
COPY server/package.json ./server/package.json
COPY streaming/consumer/package.json ./streaming/consumer/package.json
COPY packages/kafka/package.json ./packages/kafka/package.json

# Install the consumer workspace and its shared Kafka dependency.
RUN npm ci --workspace=streaming/consumer --include-workspace-root=false

# Copy runtime source.
COPY server ./server
COPY streaming/consumer ./streaming/consumer
COPY packages/kafka ./packages/kafka

WORKDIR /app/streaming/consumer

CMD ["npm", "start:transactions"]