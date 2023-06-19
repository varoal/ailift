FROM node:18.15-alpine

RUN mkdir /src

RUN chown 1000:1000 /src

WORKDIR /src

COPY backend/package.json backend/package-lock.json ./
COPY backend/.env ./

RUN npm install --silent

CMD ["npm", "start"]
