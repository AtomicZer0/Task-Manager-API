# ========================================================================================
# MULTI-STAGE BUILD: Cria uma imagem otimizada e menor para produção
# ========================================================================================

# ========================================================================================
# ETAPA 1: BUILD (Compilação)
# ========================================================================================
# FROM: Usa a imagem base node:20-alpine (Node.js 20 em Alpine Linux - ultra leve)
# AS builder: Nomeia esta etapa como "builder" para referência posterior
FROM node:20-alpine AS builder

# WORKDIR: Define /app como diretório de trabalho dentro do container
WORKDIR /app

# COPY: Copia arquivos package.json e package-lock.json do host para o container
# package*.json pega ambos package.json e package-lock.json
COPY package*.json ./

# RUN: Executa o comando npm install para instalar todas as dependências
# (inclusive devDependencies necessárias para build/compilação)
RUN npm install

# COPY: Copia todo o código-fonte do projeto para o container
COPY . .

# RUN: Compila o código TypeScript para JavaScript
# Gera os arquivos compilados na pasta dist/
RUN npm run build

# ========================================================================================
# ETAPA 2: PRODUÇÃO (Imagem Final)
# ========================================================================================
# FROM: Usa novamente node:20-alpine para a imagem final (limpa, sem arquivos de build)
# Descarta tudo da etapa anterior, resultando em imagem muito menor
FROM node:20-alpine

# WORKDIR: Define /app como diretório de trabalho na imagem final
WORKDIR /app

# COPY: Copia apenas package*.json para instalar dependências em produção
COPY package*.json ./

# RUN: Instala APENAS as dependências de produção (sem devDependencies)
# --only=production exclui ferramentas de desenvolvimento como TypeScript, ESLint, etc.
# Reduz drasticamente o tamanho da imagem final
RUN npm install --only=production

# COPY --from=builder: Copia a pasta dist/ compilada da etapa "builder"
# /app/dist ./dist: Copia os arquivos JavaScript compilados para a imagem final
COPY --from=builder /app/dist ./dist

# EXPOSE: Documenta que a aplicação escuta na porta 3001
# (Não publica automaticamente, apenas documenta a porta)
EXPOSE 3001

# CMD: Define o comando padrão a executar quando o container inicia
# "node dist/main": Executa o arquivo main.js compilado (ponto de entrada)
CMD ["node", "dist/main"]
