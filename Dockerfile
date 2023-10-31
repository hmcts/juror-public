FROM hmctspublic.azurecr.io/base/node:18-alpine as base
COPY package.json ./

FROM base as build
COPY --chown=hmcts:hmcts . .
RUN yarn install
RUN yarn build

FROM base as runtime
COPY --from=build $WORKDIR ./
USER hmcts
EXPOSE 3000
CMD ["nodejs", "server/index.js"]
