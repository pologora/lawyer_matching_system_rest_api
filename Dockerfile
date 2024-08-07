# Dockerfile

# Development stage
FROM node:20-alpine as development

WORKDIR /usr/src/app

COPY package*.json .
ARG NODE_ENV=development
RUN npm install

COPY . .
COPY logs /usr/src/app/logs
COPY public/img/users /usr/src/app/public/img/users
EXPOSE ${PORT}
RUN npm run build

# Production stage
FROM node:20-alpine as production

ARG NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY --from=development /usr/src/app/build ./build
COPY --from=development /usr/src/app/logs ./logs
COPY --from=development /usr/src/app/public/img/users ./public/img/users

CMD [ "node", "build/server.js" ]
