FROM node:20

WORKDIR /app

# Copia SOMENTE os arquivos do BACKEND
COPY backend/package*.json ./

RUN npm install

# Copia todo o backend
COPY backend/. .

# Build do TypeScript
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
