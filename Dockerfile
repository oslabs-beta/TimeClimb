FROM node:20.16
WORKDIR /user/src/app
COPY . /user/src/app/
RUN npm install
RUN npm run build
RUN npm run build:server
EXPOSE 3000
CMD node ./dist/server/server.js
