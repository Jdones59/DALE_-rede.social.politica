FROM node:18

WORKDIR /usr/src/app

# Copiar dependências primeiro
COPY package.json package-lock.json ./

RUN npm install

# Copiar o restante dos arquivos
COPY . .

# Build do TypeScript
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
