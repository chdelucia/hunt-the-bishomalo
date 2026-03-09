# Etapa 1: Build de la app con Bun
FROM oven/bun:1-slim AS build

WORKDIR /app

# Copiar los archivos clave para instalar dependencias
COPY package.json bun.lock nx.json project.json tsconfig*.json ./

# Copiar el resto del proyecto
COPY . .

# Instalar dependencias de forma limpia
RUN bun install --frozen-lockfile

# Evitar que Nx use el modo daemon
ENV NX_DAEMON=false

# Limpiar caché corrupta (si existiera)
RUN bun x nx reset || true

# Compilar la app
RUN bun x nx build hunt-the-bishomalo

# Etapa 2: Servir la app con NGINX
FROM nginx:alpine AS runtime

# Copiar configuración personalizada para Angular (routing por ejemplo)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar el resultado del build al contenedor NGINX
COPY --from=build /app/dist/hunt-the-bishomalo/browser /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

# Lanzar NGINX
CMD ["nginx", "-g", "daemon off;"]
