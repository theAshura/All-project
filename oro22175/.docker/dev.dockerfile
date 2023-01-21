FROM node:16.14.0-alpine

# Create app folder
RUN mkdir -p /home/oro-admin-dev
WORKDIR /home/oro-admin-dev

# Copy app files into app folder
COPY ecosystem-dev.config.js ./
COPY  ./build ./build
COPY  ./server ./server
RUN cd server && yarn install

# Install node package
RUN yarn install --production \
  && yarn cache clean
RUN yarn global add pm2

# EXPOSE 8080 5000

ENTRYPOINT [ "pm2-runtime","start","ecosystem-dev.config.js" ]
