FROM hmctspublic.azurecr.io/base/node:14-alpine as base
COPY package.json ./

FROM node:14.18.3-alpine as build
RUN mkdir /opt/app
WORKDIR /opt/app
RUN npm install fibers@1.0.15 --ignore-script
COPY . .
RUN npm install --production

FROM base as runtime
COPY --from=build $WORKDIR ./
USER hmcts
EXPOSE 3000
CMD ["nodejs", "server/index.js"]
