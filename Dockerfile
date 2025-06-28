# Stage 1: Build
FROM node:22.14.0-alpine AS builder

WORKDIR /app

# Cài dependencies
COPY package*.json ./
RUN npm install

# Copy mã nguồn
COPY . .

# Build NestJS
RUN npm run build

# Stage 2: Run
FROM node:22.14.0-alpine

WORKDIR /app

# Copy các file cần từ stage build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# COPY .env .env

# CMD ["node", "dist/main"]
