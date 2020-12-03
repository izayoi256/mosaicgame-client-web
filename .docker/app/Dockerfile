FROM node:14.15.0-buster-slim

RUN npm install -g http-server

WORKDIR /app

EXPOSE 8080
CMD ["http-server", "build"]
