FROM node:18-alpine
WORKDIR /src
COPY package.json yarn.lock /src/
RUN yarn

COPY . /src

EXPOSE 3000

CMD ["yarn", "start"]