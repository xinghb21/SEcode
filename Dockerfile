FROM node:18 AS build

ENV FRONTEND=/opt/frontend

WORKDIR $FRONTEND

RUN yarn config set registry https://registry.npmmirror.com

COPY . .

RUN yarn install

RUN yarn build

FROM node:18

ENV HOME=/opt/app

WORKDIR $HOME

ENV NODE_ENV production

COPY --from=build /opt/frontend/.env ./.env
RUN true
COPY --from=build /opt/frontend/next.config.js ./next.config.js
RUN true
COPY --from=build /opt/frontend/public ./public
RUN true
COPY --from=build /opt/frontend/.next ./.next
RUN true
COPY --from=build /opt/frontend/node_modules ./node_modules
RUN true
COPY --from=build /opt/frontend/package.json ./package.json
RUN true

CMD ["yarn", "start", "-p", "80"]

EXPOSE 80 
