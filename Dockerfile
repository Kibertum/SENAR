FROM node:22-alpine AS build

WORKDIR /repo

# Copy full repo structure needed for content sync
COPY standard/ standard/
COPY guide/ guide/
COPY reference/ reference/
COPY core/ core/
COPY scripts/sync-site-content.js scripts/

# Copy site source
COPY site/ site/

# Install site dependencies
WORKDIR /repo/site
RUN npm ci

# Sync content from repo root → site/src/content/ and build
RUN npm run build

WORKDIR /repo

FROM nginx:alpine
COPY --from=build /repo/site/dist /usr/share/nginx/html
COPY site/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
