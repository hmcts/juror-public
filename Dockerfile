FROM hmctspublic.azurecr.io/base/node:20-alpine AS base

COPY --chown=hmcts:hmcts . .
RUN yarn install

ENV NODE_ENV=production

EXPOSE 3000

CMD ["yarn", "serve"]
