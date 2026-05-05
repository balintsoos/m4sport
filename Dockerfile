FROM node:24.15.0-slim

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --audit=false --fund=false && npm cache clean --force

ENV PLAYWRIGHT_BROWSERS_PATH=0
RUN npx playwright install --with-deps --only-shell chromium

COPY src/ ./src/

RUN mkdir /config && chown node:node /config
ENV MANIFEST_FILE_PATH=/config/manifest.json

USER node
CMD ["node", "src/main.js"]
