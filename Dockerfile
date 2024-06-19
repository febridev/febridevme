FROM nginx:stable

COPY public/. /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

