FROM node:18-alpine as builder
ARG VITE_BASE_URL
ARG VITE_GTM_ID
ARG VITE_NETWORK_FLAG=0
ARG VITE_SENTRY_DSN
ENV NODE_OPTIONS=--max_old_space_size=4096
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine
EXPOSE 80
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /src/maintenance-page/index.html /usr/share/nginx/html/maintenance.html
COPY --from=builder /src/dist /usr/share/nginx/html
