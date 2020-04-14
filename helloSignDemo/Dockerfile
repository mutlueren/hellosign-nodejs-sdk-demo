FROM node:12

WORKDIR /app

COPY ./package*.json ./
RUN npm ci --production

COPY ./ ./

ENV PORT 5000
ENV HOST_URL localhost:$PORT
EXPOSE $PORT

CMD [ "npm", "run", "start" ]
