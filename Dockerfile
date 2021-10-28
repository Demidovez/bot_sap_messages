FROM node:slim

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

EXPOSE 5010

CMD [ "npm", "run", "start" ]