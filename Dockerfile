# TODO Start: [Student] Complete Dockerfile
# Stage 0: build
FROM node:18 AS build

ENV FRONTEND=/opt/frontend

WORKDIR $FRONTEND

RUN yarn config set registry https://registry.npmmirror.com

COPY . .

RUN yarn install

RUN yarn build

RUN yarn export

# Stage 1
FROM node:18-alpine

ENV HOME=/opt/app

WORKDIR $HOME

ENV NODE_ENV production

COPY --from=build /opt/frontend/public ./public
COPY --from=build /opt/frontend/.next ./.next
COPY --from=build /opt/frontend/node_modules ./node_modules
COPY --from=build /opt/frontend/package.json ./package.json

CMD ["yarn", "start", "-p", "80"]

EXPOSE 80

EXPOSE 80
# TODO End