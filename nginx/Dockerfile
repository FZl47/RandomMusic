FROM nginx:latest

RUN rm -rf /etc/nginx/conf.d/default.conf

ADD ./default.conf /etc/nginx/conf.d

ADD ./ssl /etc/nginx/snippets/ssl
