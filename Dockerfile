# Stage 1: Build
FROM node:22.14.0-alpine AS builder

WORKDIR /app

# Cài git + build tools (nếu cần)
RUN apk add --no-cache git

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

# Cài git ở stage run để simple-git hoạt động
RUN apk add --no-cache git

# Copy các file cần từ stage build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Start app
CMD ["node", "dist/main"]
