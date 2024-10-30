FROM node:20.16
WORKDIR /user/src/app
COPY . /user/src/app/
RUN npm install
RUN npm run build
RUN npm run build:server
EXPOSE 3000
ENV AWS_ACCESS_KEY_ID AKIARZ5BM42LGYT6AQPM
ENV AWS_SECRET_ACCESS_KEY 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
ENV AWS_REGION us-west-2
ENV PGHOST localhost
ENV PGPORT 5432
ENV PGUSER postgres
ENV PGPASSWORD Boozork1

RUN sudo service postgresql start
RUN npm run setup:database
RUN npm run migrate:latest
RUN npm run seed:run
CMD node ./dist/server/server.js
