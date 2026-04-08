# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependencias primero para aprovechar cache
COPY package.json package-lock.json ./

# FIX: npm ci en lugar de npm install para builds reproducibles
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve con Nginx
FROM nginx:alpine

RUN rm /etc/nginx/nginx.conf

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
