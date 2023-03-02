# Base on offical Node.js Alpine image
FROM node:current-alpine

# Set working directory
WORKDIR /usr/app

ENV TZ="Asia/Bangkok"
# Install PM2 globally
RUN npm install --global pm2

RUN npm install -g pnpm

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY ./package*.json ./
COPY ./pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install -P 

RUN pnpm install --save-dev typescript @types/react @types/node

# Copy all files
COPY ./ ./

# Build app
RUN pnpm run build

RUN chmod -R 777 ./

# Expose the listening port
EXPOSE 3000

# Run container as non-root (unprivileged) user
# The node user is provided in the Node.js Alpine base image
USER node

# Run npm start script with PM2 when container starts
CMD [ "pm2-runtime", "pnpm", "--", "start" ]

# CMD ["pnpm", "run", "dev"]