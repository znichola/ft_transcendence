FROM nginx

COPY ./prod.templates /etc/nginx/templates

COPY ./certs /certs