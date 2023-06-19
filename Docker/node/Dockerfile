FROM node:18.15-alpine

RUN npm install -g @angular/cli@"~16.0.0"

RUN mkdir /app

RUN chown 1000:1000 /app

WORKDIR /app

EXPOSE 4200

ENTRYPOINT ["ng", "serve", "--host=0.0.0.0", "--port=4200"]
