FROM node:16.19.1-alpine3.17

ENV TZ=America/Sao_Paulo

RUN apk add --no-cache bash supervisor curl tzdata

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /usr/src/

ENV path /usr/src/node_modules/.bin:$PATH

COPY . /usr/src/

RUN chmod +x supervisord.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
EXPOSE 3000