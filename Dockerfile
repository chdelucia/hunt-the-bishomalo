# Stage 1: Build the Angular application
FROM oven/bun:1.2.14-slim AS build

WORKDIR /app

# Copy dependency files first to leverage Docker layer caching
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Set environment variable to disable Nx daemon in CI/Docker environments
ENV NX_DAEMON=false

# Reset Nx cache to ensure a clean build
RUN bun x nx reset || true

# Build the application for production
RUN bun x nx build hunt-the-bishomalo --configuration=production

# Stage 2: Serve the application using NGINX
FROM nginx:1.27.4-alpine AS runtime

# Copy custom NGINX configuration for SPA support and performance
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts from the build stage to NGINX's public directory
COPY --from=build /app/dist/hunt-the-bishomalo/browser /usr/share/nginx/html

# Add a health check to ensure the container is running correctly
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost/index.html || exit 1

# Expose port 80
EXPOSE 80

# Start NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
