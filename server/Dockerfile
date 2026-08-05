FROM node:24-alpine

WORKDIR /app

# Copy the workspace definitions and lock file first.
COPY package.json package-lock.json ./

# npm needs the package.json from each registered workspace
# in order to understand the workspace structure.
COPY server/package.json ./server/package.json
COPY streaming/consumer/package.json ./streaming/consumer/package.json
COPY packages/kafka/package.json ./packages/kafka/package.json

# Install the API workspace and its shared workspace dependencies.
RUN npm ci --workspace=server --include-workspace-root=false

# Copy the API source code.
COPY server ./server

# Copy the shared Kafka package source code.
COPY packages/kafka ./packages/kafka

WORKDIR /app/server

EXPOSE 4000

CMD ["npm", "start"]