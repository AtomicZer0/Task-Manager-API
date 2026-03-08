# Etapa 1: build
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: produção (imagem menor, sem devDependencies)
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist

EXPOSE 3001
CMD ["node", "dist/main"]
