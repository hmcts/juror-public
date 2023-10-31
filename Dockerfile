FROM hmctspublic.azurecr.io/base/node:18-alpine as base
COPY package.json yarn.lock ./

FROM base as build
USER root
RUN apk add autoconf automake gcc make g++ zlib-dev nasm
USER hmcts
COPY . .
RUN yarn install

FROM base as runtime
COPY --from=build $WORKDIR ./
USER hmcts
EXPOSE 3000
