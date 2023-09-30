FROM node:latest as build 
WORKDIR /app
COPY . /app
RUN npm install -g @angular/cli
RUN npm install
RUN ng build 

FROM nginx:1.17.1-alpine
COPY --from=build /app/dist/employeemanagerapp /usr/share/nginx/html
COPY src/nginx/etc/conf.d/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
