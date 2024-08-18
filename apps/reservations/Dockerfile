FROM node:alpine as development

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install

COPY apps/reservations apps/reservations
COPY libs libs

# Install @nestjs/cli
RUN npm install --save-dev @nestjs/cli

RUN npm run build reservations

FROM node:alpine as production

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

# only install production dependencies
RUN npm install --only=prod

COPY --from=development /usr/src/app/dist ./dist

COPY proto proto

CMD ["node", "dist/apps/reservations/main.js"]
