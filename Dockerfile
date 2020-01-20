# base image
FROM node:13.6 AS build

# set working directory
WORKDIR /app

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install

# add app
COPY . /app

# Compile
RUN npm run build

# final image
FROM node:lts-alpine

# set working directory
WORKDIR /app

COPY --from=build /app /app

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
