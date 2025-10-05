FROM node:24

WORKDIR /app

RUN npx -y playwright@1.55.1 install --with-deps firefox

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

CMD ["node", "scraper.js"]
