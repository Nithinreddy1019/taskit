FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ENV HOSTNAME "0.0.0.0"

RUN npm run db:generate

RUN npm run build


CMD ["npm", "run", "start"]


