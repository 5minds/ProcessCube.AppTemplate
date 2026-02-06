FROM ghcr.io/5minds/processcube_lowcode:7.6.0-alpha.33

# Root Benutzer für die Installation von Systempaketen
USER root

RUN npm install @mschaeffler/node-red-logic

# copy src und npm install für dependencies
COPY ./src /package_src/
# wechsel in das Verzeichnis, in dem die package.json liegt
RUN cd /package_src/ && npm install && npm run build
    
# npm packages in den Suchpfad von Node.js/Node-RED verlinken (Symlink) im Workdir
RUN npm install /package_src/

# node-red ist der Benutzer unter dem Node-RED läuft
USER node-red

