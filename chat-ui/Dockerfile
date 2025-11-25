FROM node:20-alpine as base

WORKDIR /app

COPY . .

RUN npm ci

CMD ["npm", "run", "dev"]
