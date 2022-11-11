FROM pierrezemb/gostatic
COPY ./public/ /srv/http/

ENTRYPOINT [ "/goStatic", "-fallback", "/index.html" ]