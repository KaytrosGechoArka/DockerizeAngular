#  FROM node:latest as builder
#  RUN mkdir -p /app
#  WORKDIR /app
#  COPY . .
#  RUN npm install 
#  RUN npm run build --prod
# //CMD ["npm","start"]

# FROM nginx:alpine
# COPY src/nginx/etc/conf.d/default.conf /etc/nginx/conf/default.conf
# COPY --from=builder app/dist/employeemanagerapp usr/share/nginx/html
# COPY dist/employeemanagerapp/ /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/nginx.conf

# FROM node:12.7-alpine AS builder
# RUN mkdir /app
# WORKDIR /app
# COPY . .

# RUN npm install
# RUN npm run build --prod

# FROM nginx:1.17.1-alpine
# COPY src/nginx/etc/conf.d/default.conf /etc/nginx/conf/default.conf
# COPY --from=builder /app/dist/employeemanagerapp /usr/share/nginx/html
# #COPY dist/employeemanagerapp/ /usr/share/nginx/html

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]


ARG WORK_DIR=/build

FROM node:14.17 as builder

ARG WORK_DIR
ENV PATH ${WORK_DIR}/node_modules/.bin:$PATH

RUN mkdir ${WORK_DIR}
WORKDIR ${WORK_DIR}

COPY package.json ${WORK_DIR}
COPY package-lock.json ${WORK_DIR}

RUN npm install @angular/cli
RUN npm install

COPY . ${WORK_DIR}

ARG configuration=production

RUN ng build --configuration $configuration --output-path=./dist/out

FROM nginx:latest

ARG WORK_DIR

COPY --from=builder ${WORK_DIR}/dist/out /usr/share/nginx/html

COPY src/nginx/etc/conf.d/default.conf /etc/nginx/conf/default.conf

EXPOSE 80

CMD nginx -g "daemon off;"
