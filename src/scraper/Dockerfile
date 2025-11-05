FROM node:24-slim
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev --audit=false --fund=false && npm cache clean --force

ENV PLAYWRIGHT_BROWSERS_PATH=0
RUN npx -y playwright@1.55.1 install --with-deps --only-shell chromium

COPY scraper.js run-interval.js ./

CMD ["node", "run-interval.js"]
