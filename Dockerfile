FROM node:20-alpine as development

WORKDIR /usr/src/app

COPY package*.json .
ARG NODE_ENV=development
RUN npm install

COPY . .
EXPOSE ${PORT}
RUN npm run build

FROM node:20-alpine as production

ARG NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY --from=development /usr/src/app/build ./build

CMD [ "node", "build/server.js" ]

