# ========================================================================================
# MULTI-STAGE BUILD: Otimiza a imagem Docker para Next.js em produção
# Reduz tamanho da imagem final descartando devDependencies e arquivos desnecessários
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
# package*.json pega ambos package.json e package-lock.json (se existirem)
COPY package*.json ./

# RUN: Executa npm install para instalar todas as dependências
# Instala devDependencies necessárias para build (Next.js, TypeScript, ESLint, Tailwind, etc.)
RUN npm install

# COPY: Copia todo o código-fonte (arquivos .tsx, .ts, .css, etc.)
COPY . .

# RUN: Compila a aplicação Next.js
# Gera pasta .next/ com código otimizado para produção
# .next/standalone contém servidor Next.js standalone e arquivos compilados
RUN npm run build

# ========================================================================================
# ETAPA 2: PRODUÇÃO (Imagem Final)
# ========================================================================================
# FROM: Usa novamente node:20-alpine para a imagem final (limpa, sem arquivos de build)
# Descarta tudo da etapa anterior, resultando em imagem muito menor
# (sem node_modules de desenvolvimento, sem código-fonte original, etc.)
FROM node:20-alpine

# WORKDIR: Define /app como diretório de trabalho na imagem final
WORKDIR /app

# COPY --from=builder: Copia a pasta .next/standalone compilada da etapa "builder"
# /app/.next/standalone ./
# Contém o servidor Next.js standalone e arquivos JavaScript compilados
COPY --from=builder /app/.next/standalone ./

# COPY --from=builder: Copia a pasta .next/static da etapa "builder"
# /app/.next/static ./.next/static
# Contém arquivos estáticos otimizados (CSS, JavaScript do navegador, etc.)
COPY --from=builder /app/.next/static ./.next/static

# COPY --from=builder: Copia a pasta public da etapa "builder"
# /app/public ./public
# Contém arquivos públicos (favicon, imagens, etc.) acessíveis via HTTP
COPY --from=builder /app/public ./public

# EXPOSE: Documenta que a aplicação escuta na porta 3000
# (Não publica automaticamente, apenas documenta a porta para referência)
EXPOSE 3000

# CMD: Define o comando padrão a executar quando o container inicia
# "node server.js" executa o servidor Next.js standalone
# O arquivo server.js é parte do .next/standalone copiado anteriormente
CMD ["node", "server.js"]
