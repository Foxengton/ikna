FROM node:22-alpine AS build
ENV NODE_ENV=development
ENV VITE_SERVER_BASE_URL=VITE_SERVER_BASE_URL

COPY . /app
WORKDIR /app
RUN npm install
RUN npm run build

FROM nginx:alpine AS prod

COPY --from=build /app/dist /var/www/html/public
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

COPY env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh

CMD ["nginx", "-g", "daemon off;"]