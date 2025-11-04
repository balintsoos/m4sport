FROM node:24

WORKDIR /app

RUN npx -y playwright@1.55.1 install --with-deps firefox

COPY package*.json ./
RUN npm ci --omit=dev --audit=false --fund=false && npm cache clean --force

COPY scraper.js run-interval.js ./

USER node
CMD ["node", "run-interval.js"]
