FROM node:22-alpine AS build
ENV NODE_ENV=development

COPY . /app
WORKDIR /app
RUN npm install
RUN npm run build

FROM nginx:alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/ikna.localhost
COPY ./webserver/nginx /etc/nginx
COPY ./webserver/letsencrypt /etc/letsencrypt

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]