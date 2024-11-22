FROM node:23.3.0-alpine3.20

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run db:generate

RUN npm run build


CMD ["npm", "run", "start"]


