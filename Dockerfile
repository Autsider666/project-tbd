FROM node:16-alpine as base

WORKDIR /src
COPY package*.json /

EXPOSE 5000

FROM base as production
ENV NODE_ENV=production
RUN npm ci
COPY . /
CMD ["npm", "run", "start:server"]

FROM base as dev
ENV NODE_ENV=development
COPY . /
RUN npm ci
CMD ["npm", "run", "start:server"]