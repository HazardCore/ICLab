FROM harbor.diia.digital/docker-cache/library/node:14 as dist

ARG npm_build_command=build

WORKDIR /usr/src/app/

COPY ./ ./

RUN npm install

RUN npm run $npm_build_command



FROM harbor.diia.digital/docker-cache/library/nginx:latest
 
# ENV TZ=UTC
# RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN mkdir -p /app/dist

COPY --from=dist /usr/src/app/dist /app/dist

ADD ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 1025