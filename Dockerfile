FROM node:alpine

RUN mkdir -p /usr/src/posterBot
WORKDIR /usr/src/posterBot

COPY package.json /usr/src/posterBot/
RUN npm install
COPY . /usr/src/posterBot

COPY settings/templates/firebase.json /data/

# EXPOSE 8080

CMD ["npm", "start"]

# Configure PosterBot
VOLUME ["/data"]
