FROM node:22-alpine AS build
ENV NODE_ENV=production

COPY . /app
WORKDIR /app
RUN npm install && rm package-lock.json && rm package.json

FROM node:22-alpine AS prod

COPY --from=build /app /app
COPY ./config.json /app/config.json
WORKDIR /app

EXPOSE 80

CMD ["node", "app.mjs"]