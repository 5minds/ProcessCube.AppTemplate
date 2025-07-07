FROM ghcr.io/5minds/processcube_lowcode:7.0.3

# Root Benutzer für die Installation von Systempaketen
USER root

RUN npm install @mschaeffler/node-red-logic

COPY ./src /package_src/
RUN cd /package_src/ && npm install
    
RUN npm install /package_src/

# node-red ist der Benutzer unter dem Node-RED läuft
USER node-red

