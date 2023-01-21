# FROM keymetrics/pm2:8-alpine
FROM quay.io/vmoteam/pm2:14.14.0-alpine
LABEL author="manh.nguyen@vmodev.com"

# Make User
RUN mkdir -p /home/svm-admin-webapp
WORKDIR /home/svm-admin-webapp

COPY server ./server
COPY ecosystem-uat.config.js ./
RUN cd server && yarn install
COPY build ./build

EXPOSE 3001

ENTRYPOINT [ "pm2-runtime","start","ecosystem-uat.config.js" ]
