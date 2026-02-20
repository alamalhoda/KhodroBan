FROM node:20-alpine AS builder

WORKDIR /app

COPY shared ./shared
COPY frontend-vue/package*.json ./frontend-vue/

WORKDIR /app/frontend-vue
RUN npm ci

COPY frontend-vue/ ./

ARG VITE_API_URL=/api
ARG VITE_BACKEND_TYPE=django
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_BACKEND_TYPE=$VITE_BACKEND_TYPE

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/frontend-vue/dist /usr/share/nginx/html
COPY frontend-vue/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
