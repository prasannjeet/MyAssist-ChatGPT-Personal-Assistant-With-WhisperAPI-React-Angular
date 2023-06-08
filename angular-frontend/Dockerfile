FROM node:14.20.0-alpine AS build
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build --prod

FROM nginx:1.17.10-alpine
COPY --from=build /app/dist/angular-front /usr/share/nginx/html
# Fix 404 error nginx
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# create docker image by: docker build -t prasannjeet/tweetfront:1.0.m1 .
# Run the created angular image in a container
# docker run -d -p 4200:80 --name tweetfront prasannjeet/tweetfront:1.0.m1
# intel variation: prasannjeet/tweetfront:1.0.intel
# docker buildx build --push --platform linux/arm64/v8,linux/amd64 --tag prasannjeet/myassist:1.0.0 .
