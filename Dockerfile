FROM node:4

RUN npm install -g bower coffee-script@1.7.1

ADD . /home

ENV NODE_ENV production
ENV MONGODB_HOST pcdb
ENV MONGODB_PORT 27017

WORKDIR /home

RUN bower install --allow-root
RUN npm install

EXPOSE 8020

CMD ["coffee", "server.coffee"]
